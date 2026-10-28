(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var themes = H.themes();
  (function viz() {
    var host = document.getElementById("viz"), cv = document.getElementById("viz-c"), pp = document.getElementById("viz-pp");
    if (!host || !cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var N = 512, LOG = 9, NZ = 512, CM = 70;
    var LAM = 5, K = 2 * Math.PI / LAM;
    var re = new Float32Array(N), im = new Float32Array(N), cosT = new Float32Array(N / 2), sinT = new Float32Array(N / 2), rev = new Uint16Array(N);
    for (var k = 0; k < N / 2; k++) { cosT[k] = Math.cos(2 * Math.PI * k / N); sinT[k] = -Math.sin(2 * Math.PI * k / N); }
    for (var r = 0; r < N; r++) { var x = r, y = 0; for (var b = 0; b < LOG; b++) { y = (y << 1) | (x & 1); x >>= 1; } rev[r] = y; }
    function fft(inv) {
      for (var i = 0; i < N; i++) { var j = rev[i]; if (j > i) { var t1 = re[i]; re[i] = re[j]; re[j] = t1; t1 = im[i]; im[i] = im[j]; im[j] = t1; } }
      var sg = inv ? -1 : 1;
      for (var size = 2; size <= N; size <<= 1) {
        var half = size >> 1, step = N / size;
        for (var s0 = 0; s0 < N; s0 += size) for (var q = 0; q < half; q++) {
          var wr = cosT[q * step], wi = sg * sinT[q * step], a = s0 + q, c = a + half;
          var tr = re[c] * wr - im[c] * wi, ti = re[c] * wi + im[c] * wr;
          re[c] = re[a] - tr; im[c] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
      if (inv) for (var i2 = 0; i2 < N; i2++) { re[i2] /= N; im[i2] /= N; }
    }
    var seed = 2026; function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed + .5) / 4294967296; }
    var LC = 45, SIG = 5, phi = new Float32Array(N);
    for (var i3 = 0; i3 < N; i3++) { re[i3] = Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd()); im[i3] = 0; }
    fft(false);
    for (var i3b = 0; i3b < N; i3b++) { var fr = (i3b < N / 2 ? i3b : i3b - N) / N, g3 = Math.exp(-fr * fr * LC * LC * Math.PI * Math.PI / 2); re[i3b] *= g3; im[i3b] *= g3; }
    fft(true);
    var m3 = 0, v3 = 0; for (var i3c = 0; i3c < N; i3c++) m3 += re[i3c] / N;
    for (var i3d = 0; i3d < N; i3d++) v3 += (re[i3d] - m3) * (re[i3d] - m3) / N;
    for (var i3e = 0; i3e < N; i3e++) phi[i3e] = (re[i3e] - m3) * SIG / Math.sqrt(v3);
    var pmin = 1e9, pmax = -1e9; for (var i4 = 0; i4 < N; i4++) { if (phi[i4] < pmin) pmin = phi[i4]; if (phi[i4] > pmax) pmax = phi[i4]; }
    for (var i5 = 0; i5 < N; i5++) { re[i5] = Math.cos(phi[i5]); im[i5] = Math.sin(phi[i5]); }
    fft(false);
    var F0r = Float32Array.from(re), F0i = Float32Array.from(im), KZ = new Float32Array(N), PROP = new Uint8Array(N);
    for (var i6 = 0; i6 < N; i6++) { var kx = 2 * Math.PI * (i6 < N / 2 ? i6 : i6 - N) / N, kk = K * K - kx * kx; PROP[i6] = kk > 0 ? 1 : 0; KZ[i6] = kk > 0 ? Math.sqrt(kk) : 0; }
    var NP = N * NZ, INT = new Float32Array(NP), PH = new Float32Array(NP);
    for (var c = 0; c < NZ; c++) {
      if (c <= CM) { for (var xi = 0; xi < N; xi++) { INT[xi * NZ + c] = 1; PH[xi * NZ + c] = K * (c - CM); } continue; }
      var z = c - CM;
      for (var f = 0; f < N; f++) { if (!PROP[f]) { re[f] = im[f] = 0; continue; } var ca = Math.cos(KZ[f] * z), sa = Math.sin(KZ[f] * z); re[f] = F0r[f] * ca - F0i[f] * sa; im[f] = F0r[f] * sa + F0i[f] * ca; }
      fft(true);
      for (var x2 = 0; x2 < N; x2++) { var o = x2 * NZ + c; INT[o] = re[x2] * re[x2] + im[x2] * im[x2]; PH[o] = Math.atan2(im[x2], re[x2]); }
    }
    var zBest = CM + 1, best = 0;
    for (var c2 = CM + 1; c2 < NZ; c2++) { var mx = 0; for (var x3 = 0; x3 < N; x3++) if (INT[x3 * NZ + c2] > mx) mx = INT[x3 * NZ + c2]; if (mx > best) { best = mx; zBest = c2; } }
    var TONE = new Float32Array(NP);
    for (var x4 = 0; x4 < N; x4++) {
      var ey = 1;
      for (var c3 = 0; c3 < NZ; c3++) {
        var ex = Math.min(1, (NZ - 1 - c3) / 30, (c3 + 1) / 30); ex = ex * ex * (3 - 2 * ex);
        TONE[x4 * NZ + c3] = (1 - Math.exp(-INT[x4 * NZ + c3] / 2.2)) * ey * Math.min(1, (c3 + 1) / 30);
      }
    }
    var CS = getComputedStyle(document.documentElement), hx = function (n) { var v = CS.getPropertyValue(n).trim().replace("#", ""); return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)]; };
    var SKY = hx("--sky"), mixw = SKY.map(function (v) { return Math.round(255 + (v - 255) * .45); });
    (function () {
      var R = 4, row = new Float32Array(NZ);
      for (var xs = 0; xs < N; xs++) {
        var base = xs * NZ, acc = 0;
        for (var cz = 0; cz < NZ; cz++) row[cz] = TONE[base + cz];
        for (var cz2 = 0; cz2 < NZ; cz2++) {
          var s = 0, n = 0;
          for (var d = -R; d <= R; d++) { var cc = cz2 + d; if (cc >= 0 && cc < NZ) { s += row[cc]; n++; } }
          TONE[base + cz2] = s / n;
        }
      }
    })();
    var STOPS = [[0, [255, 255, 255]], [.28, mixw], [.55, SKY], [.8, hx("--steel")], [1, hx("--navy")]];
    var LUT = new Uint8ClampedArray(256 * 3);
    for (var l = 0; l < 256; l++) {
      var t0 = l / 255, zz = 1; while (zz < STOPS.length - 1 && STOPS[zz][0] < t0) zz++;
      var S0 = STOPS[zz - 1], S1 = STOPS[zz], w = (t0 - S0[0]) / (S1[0] - S0[0] || 1);
      for (var ch = 0; ch < 3; ch++) LUT[l * 3 + ch] = S0[1][ch] + (S1[1][ch] - S0[1][ch]) * w;
    }
    var COS = new Float32Array(1024); for (var i7 = 0; i7 < 1024; i7++) COS[i7] = Math.cos(2 * Math.PI * i7 / 1024);
    var oc = document.createElement("canvas"); oc.width = NZ; oc.height = N;
    var octx = oc.getContext("2d"), img = octx.createImageData(NZ, N), px = img.data;
    for (var a4 = 3; a4 < px.length; a4 += 4) px[a4] = 255;
    var PI2 = 1024 / (2 * Math.PI);
    var ENV = new Float32Array(NZ);
    function field(wt) {
      var zc = ((wt * 34) % (NZ + 260)) - 130;
      for (var ce = 0; ce < NZ; ce++) { var dz = (ce - zc) / 95; ENV[ce] = .62 + .38 * Math.exp(-dz * dz); }
      for (var p = 0, o2 = 0; p < NP; p++, o2 += 4) {
        var tn = TONE[p];
        var v = Math.min(1, Math.pow(tn, .8) * ENV[p % NZ] * 1.08);
        var q2 = (v * 255) | 0; q2 *= 3;
        px[o2] = LUT[q2]; px[o2 + 1] = LUT[q2 + 1]; px[o2 + 2] = LUT[q2 + 2];
      }
      octx.putImageData(img, 0, 0);
    }
    var W = 0, Hh = 0, dpr = 1;
    function size() {
      var rc = cv.getBoundingClientRect(); dpr = Math.min(2.5, window.devicePixelRatio || 1);
      var w2 = Math.max(64, Math.round(rc.width * dpr)), h2 = Math.max(64, Math.round(rc.height * dpr));
      if (w2 !== W || h2 !== Hh) { W = cv.width = w2; Hh = cv.height = h2; return true; } return false;
    }
    var INK = "#1D3057", STEEL = "#476A96", LAV = "#A6B6D3";
    function overlay(zs) {
      var sx = W / NZ, sy = Hh / N, u = dpr;
      var mx0 = CM * sx;
      ctx.beginPath(); ctx.moveTo(mx0, 0);
      for (var i = 0; i <= N; i += 2) { var ii = i % N; ctx.lineTo(mx0 + (2 + 12 * (phi[ii] - pmin) / (pmax - pmin)) * u, i * sy); }
      ctx.lineTo(mx0, Hh); ctx.closePath();
      ctx.fillStyle = "rgba(166,182,211,.55)"; ctx.fill();
      ctx.strokeStyle = STEEL; ctx.lineWidth = 1 * u; ctx.stroke();
      var X = zs * sx, ci = Math.max(CM + 1, Math.min(NZ - 1, Math.round(zs)));
      ctx.strokeStyle = "rgba(29,48,87,.35)"; ctx.lineWidth = 1 * u; ctx.setLineDash([3 * u, 4 * u]);
      ctx.beginPath(); ctx.moveTo(X, 10 * u); ctx.lineTo(X, Hh - 10 * u); ctx.stroke(); ctx.setLineDash([]);
      var amp = Math.min(70 * u, W * .12);
      ctx.beginPath();
      for (var j = 0; j < N; j++) { var e = Math.min(1, Math.min(j, N - 1 - j) / 46); var v = (1 - Math.exp(-INT[j * NZ + ci] / 6)) * e; var xx = X + 3 * u + amp * v, yy = (j + .5) * sy; if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
      ctx.strokeStyle = INK; ctx.lineWidth = 1.25 * u; ctx.stroke();
      ctx.font = (11 * u) + "px 'Plus Jakarta Sans', system-ui, sans-serif"; ctx.fillStyle = "rgba(17,17,17,.62)"; ctx.textBaseline = "bottom";
      ctx.fillText("z →", mx0 + 16 * u, Hh - 8 * u);
    }
    function draw(wt, zs) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(oc, 0, 0, W, Hh); }
    var Z0 = CM + 30, Z1 = NZ - 40;
    function plane(t) { var s1 = .5 - .5 * Math.cos(t * .23); return Z0 + (Z1 - Z0) * s1; }
    var t = Math.acos(1 - 2 * (zBest - Z0) / (Z1 - Z0)) / .23, last = 0, raf = 0, playing = !(H.reduce || H.still), vis = true, wt = 0;
    function frame() { field(wt); draw(wt, plane(t)); }
    size(); frame();
    window.addEventListener("resize", function () { if (size()) draw(wt, plane(t)); });
    if (!pp) return;
    if (H.reduce || H.still) { pp.hidden = true; return; }
    function loop(now) {
      raf = 0;
      if (!playing || !vis || document.hidden) return;
      if (now - last >= 1000 / 30) { var dt = Math.min(now - last, 120) / 1000; t += dt; wt += 2.4 * dt; last = now; frame(); }
      raf = requestAnimationFrame(loop);
    }
    function go() { if (!raf && playing && vis && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; go(); }).observe(host);
    document.addEventListener("visibilitychange", go);
    pp.addEventListener("click", function () {
      playing = !playing;
      pp.setAttribute("aria-pressed", String(!playing));
      pp.setAttribute("aria-label", playing ? "Pause the animation" : "Play the animation");
      go();
    });
    go();
  })();
  var TILE = {
    fp: { pan: true, sub: "Fourier ptychography, phase and polarization imaging, virtual staining" },
    lensless: { video: "assets/research2/video/turing-mask-zoom.mp4", pos: "50% 50%", sub: "Lensless camera hardware designed for each application, and the algorithms that reconstruct its images" },
    speckle: { video: "assets/research2/video/rssi-in-vivo-time-lapse.mp4", pos: "50% 50%", sub: "Analyzing speckle from dynamic scattering to measure sample dynamics, such as blood flow" },
    hbi: { video: "assets/research2/video/microaquarium-hand-gesture.mp4", pos: "50% 50%", sub: "Interactive experiments with living microorganisms" }
  };
  Object.keys(TILE).forEach(function (k) {
    var n = H.FIG_HOME[k], f = (/^assets\//.test(n) ? H.findFig(n) : H.mrGet(n)) || {};
    TILE[k].src = f.src || n; TILE[k].alt = f.alt; TILE[k].cap = f.caption; TILE[k].credit = f.credit;
  });
  document.getElementById("tiles").innerHTML = themes.map(function (t, i) {
    var c = TILE[t.key] || { src: t.keyFigure.src, sub: "" };
    var f = H.findFig(c.src) || {};
    var alt = c.alt || f.alt || "", cap = c.cap || f.caption || "", credit = c.credit || f.credit || "";
    var title = t.title;
    return '<li data-rv style="--i:' + (i % 3) + '"><a class="tile hover-host" data-th="' + esc(t.key) + '" href="research.html#' + esc(t.key) + '">' +
      '<div class="media zoom wash ' + (c.mat || "") + '">' + (c.video ? H.video(c.video, c.src, alt) : c.pan ? H.img(c.src, alt, { cls: "pan-x" }) : H.img(c.src, alt, { style: "object-position:" + c.pos, sizes: "(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw" })) +
      '<p class="w-cap">' + esc(cap) + (credit ? '<span class="credit">' + esc(credit) + "</span>" : "") + "</p></div>" +
      '<div class="t-row"><span class="t-dot" aria-hidden="true"></span><h3 class="h3">' + esc(title) + "</h3></div>" +
      '<p class="t-sub">' + esc(c.sub) + "</p></a></li>";
  }).join("");
  var KIND = { paper: "Paper", talk: "Talk", award: "Award", funding: "Grant", event: "Event", lab: "Lab", people: "People", service: "Service" };
  var ORDER = ["award", "paper", "funding", "talk", "event", "lab", "people", "service"];
  var FILTERS = [["all", "All"], ["paper", "Papers"], ["talk", "Talks"], ["award", "Awards"], ["funding", "Grants"], ["event", "Events"]];
  var RINGS = '<svg viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="52"/><circle cx="100" cy="100" r="74"/><circle cx="100" cy="100" r="96"/></svg>';
  var news = (IIL.news || []).map(function (n, idx) {
    var media = H.newsMedia()[idx];
    var kind = "other";
    for (var i = 0; i < ORDER.length; i++) if (n.tags.indexOf(ORDER[i]) >= 0) { kind = ORDER[i]; break; }
    return { n: n, media: media, kind: kind };
  });
  var rail = document.getElementById("rail"), chipsEl = document.getElementById("n-chips");
  chipsEl.innerHTML = FILTERS.map(function (f) {
    var c = f[0] === "all" ? news.length : news.filter(function (x) { return x.n.tags.indexOf(f[0]) >= 0; }).length;
    return '<button class="chip" type="button" data-f="' + f[0] + '" aria-pressed="' + (f[0] === "all") + '">' + f[1] + ' <span class="n">' + c + "</span></button>";
  }).join("");
  function card(x, i) {
    var n = x.n, m = x.media, top;
    if (m && m.kind === "logo") {
      top = '<div class="media logo-card ' + (m.bg === "dark" ? "lc-dark" : "lc-" + x.kind) + '">' + H.img(m.src, m.alt, { wh: H.dims(m.src) || [400, 160] }) + "</div>";
    } else if (m) {
      var people = m.kind === "photo";
      var fit = (m.fit === "contain" || /\.png$/.test(m.src)) ? " contain mat-white" : "";
      top = '<div class="media zoom' + fit + (people ? " photo" : "") + '">' + H.img(m.src, m.alt || "", { sizes: "340px" }) +
        (m.cap ? '<span class="ph-cap">' + esc(m.cap) + "</span>" : "") + "</div>";
    } else {
      top = '<div class="panel k-' + x.kind + '"><span class="p-kind">' + KIND[x.kind] + "</span>" + RINGS + '<span class="p-date">' + H.date(n.date) + "</span></div>";
    }
    var tags = n.tags.filter(function (t) { return KIND[t]; }).slice(0, 3).map(function (t) { return '<span class="tag' + (t === "award" ? " blush" : "") + '">' + KIND[t] + "</span>"; }).join("");
    return '<li class="enter" style="--i:' + Math.min(i, 6) + '"><article class="ev hover-host">' + top +
      '<div class="body"><time datetime="' + esc(n.date) + '">' + H.date(n.date, true) + '</time><p class="txt">' + n.html + "</p>" +
      '<div class="tags">' + tags + "</div></div></article></li>";
  }
  var filter = "all";
  function renderRail() {
    var list = news.filter(function (x) { return filter === "all" || x.n.tags.indexOf(filter) >= 0; });
    rail.innerHTML = list.map(card).join("");
    rail.scrollLeft = 0;
    document.getElementById("rail-n").textContent = list.length + (list.length === 1 ? " item" : " items");
    prog();
  }
  chipsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    filter = b.getAttribute("data-f");
    chipsEl.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    renderRail();
  });
  var bar = document.getElementById("rail-bar"), pr2 = 0;
  function prog() {
    pr2 = 0;
    var max = rail.scrollWidth - rail.clientWidth;
    var vis = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
    var p = max > 0 ? rail.scrollLeft / max : 1;
    bar.style.transform = "translateX(" + (p * (1 - vis) * 100).toFixed(2) + "%) scaleX(" + Math.max(vis, .04).toFixed(3) + ")";
  }
  rail.addEventListener("scroll", function () { if (!pr2) pr2 = requestAnimationFrame(prog); }, { passive: true });
  window.addEventListener("resize", prog);
  function step(dir) {
    var li = rail.querySelector("li"); var w = li ? li.getBoundingClientRect().width + 20 : 340;
    rail.scrollBy({ left: dir * w * Math.max(1, Math.floor(rail.clientWidth / w) - 1), behavior: H.reduce ? "auto" : "smooth" });
  }
  document.getElementById("rail-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("rail-next").addEventListener("click", function () { step(1); });
  var dx0 = null, sl0 = 0, moved = false;
  rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button) return; dx0 = e.clientX; sl0 = rail.scrollLeft; moved = false; });
  window.addEventListener("pointermove", function (e) {
    if (dx0 == null) return; var d = e.clientX - dx0;
    if (Math.abs(d) > 4) { moved = true; rail.classList.add("drag"); rail.scrollLeft = sl0 - d; }
  });
  window.addEventListener("pointerup", function () { dx0 = null; rail.classList.remove("drag"); });
  rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  renderRail();
  var mem = IIL.members || [];
  var ROLES = [["Research Professor", "a research professor", "research professors"], ["Postdoctoral Fellow", "a postdoctoral fellow", "postdoctoral fellows"],
    ["Visiting Faculty", "a visiting faculty member", "visiting faculty members"]];
  var parts = ['<a class="ul" href="pi.html">Prof. Seung Ah Lee</a>'];
  ROLES.forEach(function (r) {
    var n = mem.filter(function (m) { return m.role === r[0]; }).length;
    if (n) parts.push(n === 1 ? r[1] : n + " " + r[2]);
  });
  if (mem.some(function (m) { return m.group === "grad"; })) parts.push("graduate students");
  var interns = mem.some(function (m) { return m.group === "intern"; });
  var total = mem.length + (IIL.pi ? 1 : 0);
  document.getElementById("team-line").innerHTML = total + " people: " + parts.join(", ") + (interns ? " and undergraduate interns." : ".");
  document.getElementById("faces").innerHTML = [IIL.pi].concat(mem).filter(Boolean).map(function (m) {
    var img = '<img src="' + H.base + esc(H.face(m.photo, true)) + '" alt="' + esc(m === IIL.pi ? "Prof. " + m.name + ", profile" : m.name) + '" width="46" height="46" loading="lazy" decoding="async">';
    return "<li>" + (m === IIL.pi ? '<a class="f-pi" href="pi.html">' + img + "</a>" : img) + '<span class="nm" aria-hidden="true">' + esc(m.name) + "</span></li>";
  }).join("");
  H.reveal(); H.parallax(); H.videos();
})();
