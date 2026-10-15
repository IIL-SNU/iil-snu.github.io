/* Virtual staining scanner (ported from concept D2, restyled for D5).
   A label-free image of an unstained tissue section (raw frame under learned illumination) is scanned
   field by field; behind the scan head each field turns into the network's virtual H&E of the same field.
   A loupe (pointer, touch or arrow keys) magnifies the virtual H&E anywhere on the slide.
   Images: K. C. Lee et al., J. Phys. Photonics 2026 (published result; nothing is inferred in the browser).
   The canvas only draws images (no pixel reads), so it is never tainted and works from file://.
   API: IIL.vsScanner.build() -> <figure>; IIL.vsScanner.mount(figure, { input, stain, onReady, onError }). */
(function () {
  'use strict';
  var IIL = window.IIL = window.IIL || {};
  if (IIL.vsScanner) return;

  var UM_PER_PX = 50 / 296;       /* the published 50 um scale bar spans 296 px of the source frame */
  var SRC_W = 1154, SRC_H = 1008; /* cropped source size (scale bar removed) */
  var PATTERNS = 16;              /* learned illumination patterns per field (published) */
  var uid = 0;

  function mq(q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; }
  function iconSVG(name) {
    var ui = IIL.ui;
    if (ui && ui.iconSVG) return ui.iconSVG(name, 'scn-i');
    return name === 'play'
      ? '<svg class="scn-i" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>'
      : '<svg class="scn-i" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" fill="currentColor"/></svg>';
  }

  /* markup, built in JS so the page HTML only needs a static fallback */
  function build() {
    var id = 'scn-help-' + (++uid);
    var f = document.createElement('figure');
    f.className = 'scn';
    f.setAttribute('data-mode', 'scanning');
    f.innerHTML =
      '<div class="scn-bar">' +
        '<span class="label scn-mode"><span class="scn-dot" aria-hidden="true"></span><span data-r="mode">Scanning</span></span>' +
        '<span class="scn-legend label" aria-hidden="true">' +
          '<span><i class="scn-sw scn-sw-in"></i>Label-free input</span>' +
          '<span><i class="scn-sw scn-sw-st"></i>Virtual H&amp;E</span>' +
        '</span>' +
        '<button class="scn-btn" type="button" data-scan-toggle aria-pressed="false"><span class="scn-ic" aria-hidden="true"></span><span class="scn-t">Pause</span><span class="sr-only"> the slide scan animation</span></button>' +
      '</div>' +
      '<div class="scn-stage">' +
        '<canvas tabindex="0" role="img" aria-roledescription="interactive image" aria-label="Virtual staining scanner. A grey, label-free image of an unstained tissue section is scanned field by field, and each scanned field turns into the pink and purple virtual H&amp;E stain of the same tissue. A loupe magnifies the virtual stain." aria-describedby="' + id + '"></canvas>' +
        '<span class="scn-hint" aria-hidden="true"><span class="h-fine">Hover to inspect</span><span class="h-touch">Touch to inspect</span></span>' +
      '</div>' +
      '<dl class="scn-readouts">' +
        '<div><dt>Stage x, y <span class="u">&micro;m</span></dt><dd><span data-r="x">0.0</span>, <span data-r="y">0.0</span></dd></div>' +
        '<div><dt>Scan area</dt><dd data-r="fov">195 &times; 130 <span class="u">&micro;m</span></dd></div>' +
        '<div><dt>Pattern</dt><dd><span data-r="pat">00/16</span></dd></div>' +
        '<div><dt>Stain</dt><dd>H&amp;E, virtual</dd></div>' +
        '<div><dt>Loupe</dt><dd data-r="mag">off</dd></div>' +
        '<div><dt>Stained</dt><dd><span data-r="cov">30%</span><span class="scn-meter" aria-hidden="true"><i data-r="bar"></i></span></dd></div>' +
      '</dl>' +
      '<figcaption>' +
        '<span>Raw label-free input and the network&rsquo;s virtual H&amp;E of the same field.</span>' +
        '<cite>K. C. Lee et al., J. Phys. Photonics 2026</cite>' +
        '<span id="' + id + '" class="sr-only">Point or touch the image to move a magnifying loupe over the virtual stain. With the image focused, the arrow keys move the loupe, plus and minus change its magnification, Space pauses the scan and Escape hides the loupe.</span>' +
      '</figcaption>';
    return f;
  }

  function mount(fig, opts) {
    opts = opts || {};
    if (!fig || fig.__scn) return;
    fig.__scn = true;
    var stage = fig.querySelector('.scn-stage');
    var canvas = fig.querySelector('canvas');
    var ctx = canvas && canvas.getContext('2d');
    if (!ctx) { if (opts.onError) opts.onError(); return; }

    var out = {
      x: fig.querySelector('[data-r="x"]'), y: fig.querySelector('[data-r="y"]'),
      fov: fig.querySelector('[data-r="fov"]'), pat: fig.querySelector('[data-r="pat"]'),
      cov: fig.querySelector('[data-r="cov"]'), mode: fig.querySelector('[data-r="mode"]'),
      mag: fig.querySelector('[data-r="mag"]'), bar: fig.querySelector('[data-r="bar"]')
    };
    var pauseBtn = fig.querySelector('[data-scan-toggle]');
    var mqReduced = mq('(prefers-reduced-motion: reduce)');

    var imgIn = new Image(), imgSt = new Image(), loaded = 0, failed = false;
    var C = {};
    function readColors() {
      var cs = getComputedStyle(fig);
      function v(n, d) { return cs.getPropertyValue(n).trim() || d; }
      C.accent = v('--scn-accent', '#853898');
      C.veil = v('--scn-veil', 'rgba(133,56,152,.14)');
      C.paper = v('--paper', '#FFFFFF');
      C.ink = v('--graphite', '#1D1E1C');
      C.line = v('--scn-line', 'rgba(29,30,28,.18)');
      C.paperVeil = v('--scn-paper-veil', 'rgba(255,255,255,.86)');
      C.mono = v('--mono', 'ui-monospace, Menlo, monospace');
    }
    readColors();

    var dpr = 1, W = 0, H = 0, cw = 0, ch = 0;
    var src = { x: 0, y: 0, w: SRC_W, h: SRC_H };
    var COLS = 6, ROWS = 4, N = 24;
    var order = [], alpha = [], stainAt = [];
    var reduced = !!mqReduced.matches;

    var T_MOVE = 230, T_ACQ = 300, T_DEV = 520, T_HOLD = 2600, T_CLEAR = 1100;
    var st = { idx: 0, phase: 'move', t0: 0, from: 0, pat: 0 };
    var running = !reduced, visible = true, raf = 0, lastUi = 0;
    var loupe = { on: false, x: 0, y: 0, mag: 2.5, kbd: false, hideAt: 0 };

    function layout() {
      var r = stage.getBoundingClientRect();
      cw = Math.max(1, r.width); ch = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.round(cw * dpr); H = Math.round(ch * dpr);
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;
      var a = cw / ch, sa = SRC_W / SRC_H;
      if (a > sa) { src.w = SRC_W; src.h = SRC_W / a; src.x = 0; src.y = (SRC_H - src.h) / 2; }
      else { src.h = SRC_H; src.w = SRC_H * a; src.y = 0; src.x = (SRC_W - src.w) / 2; }
      var cols = a >= 1.3 ? 6 : 5;
      var rows = Math.max(3, Math.round(cols / a));
      if (cols !== COLS || rows !== ROWS || !order.length) {
        COLS = cols; ROWS = rows; N = COLS * ROWS;
        order = [];
        for (var rr = 0; rr < ROWS; rr++) for (var c = 0; c < COLS; c++) order.push(rr * COLS + (rr % 2 ? COLS - 1 - c : c));
        alpha = new Array(N).fill(0); stainAt = new Array(N).fill(-1);
        seed();
      }
      if (out.fov) out.fov.innerHTML = fmt(src.w * UM_PER_PX, 0) + ' &times; ' + fmt(src.h * UM_PER_PX, 0) + ' <span class="u">&micro;m</span>';
    }

    /* first frame: part of the slide is already stained, so both states show at once */
    function seed() {
      var k = reduced ? Math.floor(N / 2) : Math.round(N * 0.3);
      for (var i = 0; i < N; i++) { alpha[order[i]] = i < k ? 1 : 0; stainAt[order[i]] = i < k ? 0 : -1; }
      st.idx = Math.min(k, N - 1); st.from = Math.max(0, k - 1); st.phase = reduced ? 'still' : 'move'; st.t0 = performance.now();
      st.pat = reduced ? PATTERNS : 0;
    }

    function fmt(v, d) { return v.toFixed(d); }
    function easeIO(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    function tileRect(i) {
      var c = i % COLS, r = (i / COLS) | 0;
      var x0 = Math.round(c * W / COLS), x1 = Math.round((c + 1) * W / COLS);
      var y0 = Math.round(r * H / ROWS), y1 = Math.round((r + 1) * H / ROWS);
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
    function drawSrc(img, d) {
      ctx.drawImage(img, src.x + d.x / W * src.w, src.y + d.y / H * src.h, d.w / W * src.w, d.h / H * src.h, d.x, d.y, d.w, d.h);
    }
    function reticlePos(now) {
      var a = tileRect(order[st.from]), b = tileRect(order[st.idx]);
      var k = st.phase === 'move' ? easeIO(Math.min(1, (now - st.t0) / T_MOVE)) : 1;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k };
    }

    function step(now) {
      var e = now - st.t0;
      if (st.phase === 'move' && e >= T_MOVE) { st.phase = 'acq'; st.t0 = now; st.pat = 0; }
      else if (st.phase === 'acq') {
        st.pat = Math.min(PATTERNS, 1 + Math.floor(e / (T_ACQ / PATTERNS)));
        if (e >= T_ACQ) {
          stainAt[order[st.idx]] = now;
          if (st.idx >= N - 1) { st.phase = 'hold'; st.t0 = now; }
          else { st.from = st.idx; st.idx++; st.phase = 'move'; st.t0 = now; }
        }
      } else if (st.phase === 'hold' && e >= T_HOLD) { st.phase = 'clear'; st.t0 = now; }
      else if (st.phase === 'clear' && e >= T_CLEAR + 200) {
        for (var i = 0; i < N; i++) { alpha[i] = 0; stainAt[i] = -1; }
        st.from = 0; st.idx = 0; st.phase = 'move'; st.t0 = now; st.pat = 0;
      }
      for (var j = 0; j < N; j++) {
        if (st.phase === 'clear') {
          var c = j % COLS, r = (j / COLS) | 0;
          var delay = ((COLS - 1 - c) + (ROWS - 1 - r)) / (COLS + ROWS - 2) * (T_CLEAR * 0.6);
          alpha[j] = 1 - easeOut(Math.max(0, Math.min(1, (e - delay) / (T_CLEAR * 0.4))));
        } else if (stainAt[j] > 0) {
          alpha[j] = easeOut(Math.min(1, (now - stainAt[j]) / T_DEV));
        }
      }
    }

    function draw(now) {
      if (loaded < 2 || !W) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(imgIn, src.x, src.y, src.w, src.h, 0, 0, W, H);
      var i, cov = 0;
      for (i = 0; i < N; i++) {
        if (alpha[i] <= 0.001) continue;
        cov += alpha[i];
        ctx.globalAlpha = alpha[i];
        drawSrc(imgSt, tileRect(i));
      }
      ctx.globalAlpha = 1;

      /* stitch marks at tile corners */
      var u = dpr, arm = 4 * u;
      ctx.strokeStyle = C.paperVeil; ctx.lineWidth = Math.max(1, u);
      ctx.beginPath();
      for (var r = 1; r < ROWS; r++) for (var c = 1; c < COLS; c++) {
        var px = Math.round(c * W / COLS) + .5, py = Math.round(r * H / ROWS) + .5;
        ctx.moveTo(px - arm, py); ctx.lineTo(px + arm, py); ctx.moveTo(px, py - arm); ctx.lineTo(px, py + arm);
      }
      ctx.stroke();

      if (st.phase !== 'hold' && st.phase !== 'clear') drawReticle(reticlePos(now), now);
      if (loupe.on) drawLoupe();
      if (now - lastUi > 90) { lastUi = now; ui(cov / N); }
    }

    function tag(text, x, y, color) {
      var u = dpr;
      ctx.font = '500 ' + (10 * u) + 'px ' + C.mono;
      var tw = ctx.measureText(text).width + 10 * u, th = 17 * u;
      return { w: tw, h: th, draw: function (tx, ty) {
        ctx.fillStyle = C.paper; ctx.fillRect(tx, ty, tw, th);
        ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, tx + 5 * u, ty + th / 2 + .5 * u);
      } };
    }

    function drawReticle(p, now) {
      var u = dpr, L = Math.min(16 * u, p.w * .28), lw = 2 * u;
      var x = p.x + lw / 2, y = p.y + lw / 2, w = p.w - lw, h = p.h - lw;
      if (st.phase === 'acq') {
        var k = (now - st.t0) / T_ACQ;
        ctx.fillStyle = C.veil; ctx.globalAlpha = .5 + .5 * Math.sin(k * Math.PI);
        ctx.fillRect(p.x, p.y, p.w, p.h); ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = C.accent; ctx.lineWidth = lw; ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(x, y + L); ctx.lineTo(x, y); ctx.lineTo(x + L, y);
      ctx.moveTo(x + w - L, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + L);
      ctx.moveTo(x + w, y + h - L); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - L, y + h);
      ctx.moveTo(x + L, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - L);
      ctx.stroke();
      ctx.lineWidth = Math.max(1, u * .75); ctx.globalAlpha = .45;
      ctx.strokeRect(x, y, w, h); ctx.globalAlpha = 1;

      /* 4 x 4 pattern indicator: one cell per learned illumination pattern */
      var cell = Math.max(3 * u, Math.min(5 * u, p.w / 26)), gap = Math.max(1, u), n = st.pat;
      var gx = p.x + p.w - 8 * u - (cell * 4 + gap * 3), gy = p.y + p.h - 8 * u - (cell * 4 + gap * 3);
      ctx.fillStyle = C.paperVeil;
      ctx.fillRect(gx - 3 * u, gy - 3 * u, cell * 4 + gap * 3 + 6 * u, cell * 4 + gap * 3 + 6 * u);
      for (var q = 0; q < PATTERNS; q++) {
        ctx.fillStyle = q < n ? C.accent : C.line;
        ctx.fillRect(gx + (q % 4) * (cell + gap), gy + ((q / 4) | 0) * (cell + gap), cell, cell);
      }

      var t = tag('FOV ' + pad2(st.idx + 1), 0, 0, C.ink);
      var tx = Math.min(p.x, W - t.w), ty = p.y - t.h - 3 * u;
      if (ty < 2 * u) { ty = p.y + 4 * u; tx = p.x + 4 * u; }
      t.draw(tx, ty);
    }

    function drawLoupe() {
      var u = dpr;
      var R = Math.max(54, Math.min(96, cw * .12)) * u;
      var cx = loupe.x * u, cy = loupe.y * u, M = loupe.mag;
      var sx = src.x + cx / W * src.w, sy = src.y + cy / H * src.h;
      var sr = R / M / W * src.w;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.closePath();
      ctx.fillStyle = C.paper; ctx.fill();
      ctx.clip();
      ctx.drawImage(imgSt, sx - sr, sy - sr, sr * 2, sr * 2, cx - R, cy - R, R * 2, R * 2);
      ctx.restore();
      ctx.lineWidth = 3 * u; ctx.strokeStyle = C.paper;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1 * u; ctx.strokeStyle = C.ink; ctx.globalAlpha = .5;
      ctx.beginPath(); ctx.arc(cx, cy, R + 2 * u, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5 * u; ctx.beginPath();
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (d) {
        ctx.moveTo(cx + d[0] * (R - 9 * u), cy + d[1] * (R - 9 * u)); ctx.lineTo(cx + d[0] * (R - 2 * u), cy + d[1] * (R - 2 * u));
      });
      ctx.stroke();
      var t = tag('H&E · ' + M.toFixed(1) + '×', 0, 0, C.ink);
      var tx = cx - t.w / 2, ty = cy + R + 6 * u;
      if (ty + t.h > H - 2 * u) ty = cy - R - t.h - 6 * u;
      tx = Math.max(2 * u, Math.min(W - t.w - 2 * u, tx));
      t.draw(tx, ty);
    }

    function ui(cov) {
      var px, py;
      if (loupe.on) { px = loupe.x / cw; py = loupe.y / ch; }
      else { var t = tileRect(order[st.idx]); px = (t.x + t.w / 2) / W; py = (t.y + t.h / 2) / H; }
      if (out.x) out.x.textContent = fmt(px * src.w * UM_PER_PX, 1);
      if (out.y) out.y.textContent = fmt(py * src.h * UM_PER_PX, 1);
      if (out.pat) out.pat.textContent = pad2(st.pat) + '/' + PATTERNS;
      if (out.cov) out.cov.textContent = Math.round(cov * 100) + '%';
      if (out.bar) out.bar.style.transform = 'scaleX(' + cov.toFixed(3) + ')';
      if (out.mag) out.mag.textContent = loupe.on ? loupe.mag.toFixed(1) + '×' : 'off';
      if (out.mode) {
        var m = reduced ? 'Still frame' : !running ? 'Paused' : st.phase === 'acq' ? 'Acquiring' : st.phase === 'hold' ? 'Stained' : st.phase === 'clear' ? 'New slide' : 'Scanning';
        if (out.mode.textContent !== m) out.mode.textContent = m;
        fig.setAttribute('data-mode', m.toLowerCase().replace(/\s+/g, '-'));
      }
    }

    function frame(now) {
      raf = 0;
      if (running && !reduced) step(now);
      if (loupe.on && !loupe.kbd && loupe.hideAt && now > loupe.hideAt) { loupe.on = false; loupe.hideAt = 0; fig.classList.remove('has-loupe'); }
      draw(now);
      if (shouldLoop()) raf = requestAnimationFrame(frame);
    }
    function shouldLoop() { return running && !reduced && visible && !document.hidden && loaded === 2; }
    function kick() { if (!raf && loaded === 2) raf = requestAnimationFrame(frame); }

    /* pause / visibility */
    var pausedAt = 0;
    function resumeShift() {
      if (!pausedAt) return;
      var d = performance.now() - pausedAt; pausedAt = 0;
      st.t0 += d; for (var i = 0; i < N; i++) if (stainAt[i] > 0) stainAt[i] += d;
    }
    function setRunning(on) {
      if (reduced) on = false;
      if (on && !running) resumeShift();
      if (!on && running) pausedAt = performance.now();
      running = on;
      if (pauseBtn) {
        pauseBtn.disabled = reduced;
        pauseBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
        pauseBtn.querySelector('.scn-t').textContent = reduced ? 'Still' : on ? 'Pause' : 'Play';
        pauseBtn.querySelector('.scn-ic').innerHTML = reduced ? '' : iconSVG(on ? 'pause' : 'play');
      }
      ui(currentCov());
      kick();
    }
    if (pauseBtn) pauseBtn.addEventListener('click', function () { setRunning(!running); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var v = es[es.length - 1].isIntersecting;
        if (v && !visible) { visible = true; if (running) resumeShift(); kick(); }
        else if (!v && visible) { visible = false; if (running) pausedAt = performance.now(); }
      }, { threshold: 0.02 }).observe(stage);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (running && !pausedAt) pausedAt = performance.now(); }
      else if (running && visible) { resumeShift(); kick(); }
    });
    if (mqReduced.addEventListener) mqReduced.addEventListener('change', function () {
      reduced = !!mqReduced.matches; order = []; layout(); setRunning(!reduced); draw(performance.now());
    });

    /* loupe: pointer, touch, keyboard */
    function local(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function showLoupe(x, y, sticky) {
      loupe.on = true; loupe.x = Math.max(0, Math.min(cw, x)); loupe.y = Math.max(0, Math.min(ch, y));
      loupe.hideAt = sticky ? 0 : performance.now() + 1800;
      fig.classList.add('has-loupe');
      if (!shouldLoop()) draw(performance.now()); else kick();
    }
    function hideLoupe() { loupe.on = false; loupe.kbd = false; fig.classList.remove('has-loupe'); draw(performance.now()); ui(currentCov()); }
    canvas.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse' || e.buttons || e.pointerType === 'pen') { var p = local(e); showLoupe(p.x, p.y, e.pointerType === 'mouse'); }
    });
    canvas.addEventListener('pointerdown', function (e) { var p = local(e); showLoupe(p.x, p.y, e.pointerType === 'mouse'); });
    canvas.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'mouse') return;
      loupe.hideAt = performance.now() + 1800; kick();
      if (!shouldLoop()) setTimeout(function () { if (loupe.hideAt && performance.now() >= loupe.hideAt) hideLoupe(); }, 1850);
    });
    canvas.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !loupe.kbd) hideLoupe(); });
    canvas.addEventListener('pointercancel', function () { if (!loupe.kbd) hideLoupe(); });
    canvas.addEventListener('wheel', function (e) {
      if (!loupe.on || !(e.ctrlKey || e.altKey)) return; /* zoom the loupe only with a modifier; never take page scroll */
      e.preventDefault(); loupe.mag = Math.max(1.5, Math.min(4, loupe.mag + (e.deltaY < 0 ? .25 : -.25))); draw(performance.now());
    }, { passive: false });
    canvas.addEventListener('focus', function () { if (!loupe.on) { loupe.kbd = true; showLoupe(cw / 2, ch / 2, true); } });
    canvas.addEventListener('blur', function () { if (loupe.kbd) hideLoupe(); });
    canvas.addEventListener('keydown', function (e) {
      var k = e.key, d = e.shiftKey ? 40 : 12, used = true;
      if (!loupe.on && /^Arrow/.test(k)) { loupe.kbd = true; showLoupe(cw / 2, ch / 2, true); }
      if (k === 'ArrowLeft') loupe.x -= d; else if (k === 'ArrowRight') loupe.x += d;
      else if (k === 'ArrowUp') loupe.y -= d; else if (k === 'ArrowDown') loupe.y += d;
      else if (k === '+' || k === '=') loupe.mag = Math.min(4, loupe.mag + .5);
      else if (k === '-' || k === '_') loupe.mag = Math.max(1.5, loupe.mag - .5);
      else if (k === 'Escape') { hideLoupe(); return; }
      else if (k === ' ' || k === 'Enter') { setRunning(!running); }
      else used = false;
      if (used) { e.preventDefault(); loupe.kbd = true; showLoupe(loupe.x, loupe.y, true); ui(currentCov()); }
    });
    function currentCov() { var s = 0; for (var i = 0; i < N; i++) s += alpha[i] || 0; return N ? s / N : 0; }

    /* boot: images first, then layout and the first frame */
    function ready() {
      if (failed) return;
      loaded++;
      if (loaded !== 2) return;
      if (opts.onReady) opts.onReady(fig);
      layout(); readColors(); fig.classList.add('is-live');
      draw(performance.now()); setRunning(running);
      if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); draw(performance.now()); }).observe(stage);
      else window.addEventListener('resize', function () { layout(); draw(performance.now()); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(performance.now()); });
    }
    function fail() { if (failed) return; failed = true; if (opts.onError) opts.onError(fig); }
    imgIn.onload = ready; imgSt.onload = ready;
    imgIn.onerror = imgSt.onerror = fail;
    imgIn.src = opts.input || 'img/vs-input.jpg';
    imgSt.src = opts.stain || 'img/vs-stain.jpg';
  }

  IIL.vsScanner = { build: build, mount: mount };
})();
