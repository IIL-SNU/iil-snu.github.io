/* Home: hero with a small computed speckle pattern, theme tiles (no numbering or arrows between them), image-led news rail with filters, principal investigator, team teaser. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  /* four themes (Virtual Staining is part of Computational Microscopy: H.PARENT in site.js) */
  var themes = H.themes();

  /* ---------------- hero: a small computed light pattern (PI 2026-10-15: no lab photograph, no large research image, no carousel) ----------------
     data-mode="speckle": fully developed laser speckle behind an elliptical aperture (as in rolling-shutter speckle imaging), the
     pupil phase turning slowly so the grains decorrelate and re-form; data-mode="psf": the caustic point-spread function of a
     smooth random phase mask (as in the lab's lensless cameras), morphing slowly. Computed with a 256 x 256 FFT, drawn in the
     palette. Pauses offscreen, on the pause button and with reduced motion (one still frame); nothing is added to the DOM. */
  (function viz() {
    var host = document.getElementById("viz"), cv = document.getElementById("viz-c"), pp = document.getElementById("viz-pp");
    if (!host || !cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var N = 256, LOG = 8, mode = host.getAttribute("data-mode") || "speckle";
    var re = new Float32Array(N * N), im = new Float32Array(N * N);
    var cosT = new Float32Array(N / 2), sinT = new Float32Array(N / 2), rev = new Uint16Array(N);
    for (var k = 0; k < N / 2; k++) { cosT[k] = Math.cos(2 * Math.PI * k / N); sinT[k] = -Math.sin(2 * Math.PI * k / N); }
    for (var r = 0; r < N; r++) { var x = r, y = 0; for (var b = 0; b < LOG; b++) { y = (y << 1) | (x & 1); x >>= 1; } rev[r] = y; }
    var bufR = new Float32Array(N), bufI = new Float32Array(N);
    function fft1(off, stride, inv) {
      for (var i = 0; i < N; i++) { var j = off + rev[i] * stride; bufR[i] = re[j]; bufI[i] = im[j]; }
      for (var size = 2; size <= N; size <<= 1) {
        var half = size >> 1, step = N / size;
        for (var s0 = 0; s0 < N; s0 += size) for (var q = 0; q < half; q++) {
          var wr = cosT[q * step], wi = inv ? -sinT[q * step] : sinT[q * step];
          var a = s0 + q, c = a + half, tr = bufR[c] * wr - bufI[c] * wi, ti = bufR[c] * wi + bufI[c] * wr;
          bufR[c] = bufR[a] - tr; bufI[c] = bufI[a] - ti; bufR[a] += tr; bufI[a] += ti;
        }
      }
      for (var i2 = 0; i2 < N; i2++) { var j2 = off + i2 * stride; re[j2] = bufR[i2]; im[j2] = bufI[i2]; }
    }
    function fft2(inv) { for (var r2 = 0; r2 < N; r2++) fft1(r2 * N, 1, inv); for (var c2 = 0; c2 < N; c2++) fft1(c2, N, inv); }
    /* seeded random numbers so every visitor sees the same pattern */
    var seed = 20261015; function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    var pa = new Float32Array(N * N), pb = new Float32Array(N * N), amp = new Float32Array(N * N), H2r, H2i;
    function fq(i) { return i < N / 2 ? i : i - N; }
    if (mode === "psf") {
      /* smooth random phase: low-pass filtered noise, two independent surfaces */
      [pa, pb].forEach(function (P) {
        for (var i = 0; i < N * N; i++) { re[i] = rnd() - .5; im[i] = 0; }
        fft2(false);
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var f = Math.hypot(fq(x), fq(y)), g = Math.exp(-(f * f) / 18); re[y * N + x] *= g; im[y * N + x] *= g; }
        fft2(true);
        var m = 0; for (var i3 = 0; i3 < N * N; i3++) m = Math.max(m, Math.abs(re[i3]));
        for (var i4 = 0; i4 < N * N; i4++) P[i4] = re[i4] / m * 26;
      });
      /* free-space propagation (angular spectrum, paraxial) to the sensor plane */
      H2r = new Float32Array(N * N); H2i = new Float32Array(N * N);
      for (var y5 = 0; y5 < N; y5++) for (var x5 = 0; x5 < N; x5++) { var ph = -0.0042 * (fq(x5) * fq(x5) + fq(y5) * fq(y5)); H2r[y5 * N + x5] = Math.cos(ph); H2i[y5 * N + x5] = Math.sin(ph); }
      for (var i5 = 0; i5 < N * N; i5++) amp[i5] = 1;
    } else {
      /* elliptical aperture in the pupil, long axis across the sensor rows: grains elongated along the columns */
      for (var y6 = 0; y6 < N; y6++) for (var x6 = 0; x6 < N; x6++) {
        var u = fq(x6) / 54, v = fq(y6) / 17, i6 = y6 * N + x6;
        amp[i6] = u * u + v * v <= 1 ? 1 : 0; pa[i6] = rnd() * 4 * Math.PI; pb[i6] = rnd() * 4 * Math.PI;
      }
    }
    /* palette ramp: white mist, sky, lavender, steel, navy (bright light = deep ink) */
    var STOPS = mode === "psf"
      ? [[0, [29, 48, 87]], [.42, [71, 106, 150]], [.7, [174, 203, 231]], [.9, [236, 242, 250]], [1, [251, 215, 205]]]
      : [[0, [255, 255, 255]], [.28, [228, 238, 248]], [.55, [174, 203, 231]], [.8, [127, 152, 189]], [1, [29, 48, 87]]];
    var LUT = new Uint8ClampedArray(256 * 3);
    for (var l = 0; l < 256; l++) {
      var t = l / 255, z = 1; while (z < STOPS.length - 1 && STOPS[z][0] < t) z++;
      var A = STOPS[z - 1], B = STOPS[z], w = (t - A[0]) / (B[0] - A[0] || 1);
      for (var ch = 0; ch < 3; ch++) LUT[l * 3 + ch] = A[1][ch] + (B[1][ch] - A[1][ch]) * w;
    }
    /* soft round envelope: the pattern fades out towards the edge like an illuminated spot */
    var env = new Float32Array(N * N);
    for (var y7 = 0; y7 < N; y7++) for (var x7 = 0; x7 < N; x7++) { var rr = Math.hypot(x7 - N / 2 + .5, y7 - N / 2 + .5) / (N * .39); env[y7 * N + x7] = mode === "psf" ? 1 : Math.exp(-Math.pow(rr, 6)); }
    var img = ctx.createImageData(N, N), px = img.data;
    function frame(time) {
      var c = Math.cos(time), s = Math.sin(time);
      for (var i = 0; i < N * N; i++) {
        if (!amp[i]) { re[i] = 0; im[i] = 0; continue; }
        var ph = pa[i] * c + pb[i] * s; re[i] = amp[i] * Math.cos(ph); im[i] = amp[i] * Math.sin(ph);
      }
      fft2(false);
      if (mode === "psf") {
        for (var j = 0; j < N * N; j++) { var a = re[j], b = im[j]; re[j] = a * H2r[j] - b * H2i[j]; im[j] = a * H2i[j] + b * H2r[j]; }
        fft2(true);
      }
      var mean = 0, I = re; /* reuse re as intensity */
      for (var k2 = 0; k2 < N * N; k2++) { var v2 = re[k2] * re[k2] + im[k2] * im[k2]; I[k2] = v2; mean += v2; }
      mean /= N * N;
      var g = mode === "psf" ? 2.4 * mean : 1.25 * mean;
      for (var m = 0, o = 0; m < N * N; m++, o += 4) {
        var n = (1 - Math.exp(-I[m] / g)) * env[m], q = (n * 255) | 0;
        px[o] = LUT[q * 3]; px[o + 1] = LUT[q * 3 + 1]; px[o + 2] = LUT[q * 3 + 2]; px[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    var T0 = .6, t = T0, last = 0, raf = 0, playing = !(H.reduce || H.still), vis = true, SPEED = mode === "psf" ? .03 : .012;
    frame(t);
    if (!pp) return;
    if (H.reduce || H.still) { pp.hidden = true; return; }
    function loop(now) {
      raf = 0;
      if (!playing || !vis || document.hidden) return;
      if (now - last >= 1000 / 24) { t += SPEED * Math.min(now - last, 120) / 1000 * 6; last = now; frame(t); }
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

  /* ---------------- theme tiles ---------------- */
  /* one figure per theme (H.FIG_HOME in site.js); research figures stay small on this page. The themes are parallel areas,
     not steps: tiles carry no sequence numbers and no arrows (PI 2026-10-15). */
  var TILE = {
    fp: { mat: "contain mat-white flow", alt: "Rendering of a Fourier ptychographic microscope with pupil-plane polarization multiplexing", cap: "Pupil-plane multiplexing Fourier ptychographic microscope: LED array, sample, objective, split polarizer and camera.", credit: "H. Chae et al., Laser & Photonics Reviews 2026", pos: "50% 50%", sub: "Fourier ptychography, phase and polarization imaging, virtual staining" },
    lensless: { alt: "Fabricated phase mask with a Turing-pattern relief, backlit", cap: "Phase mask with a Turing-pattern relief, fabricated in one exposure by grayscale lithography.", credit: "Imaging Intelligence Laboratory", pos: "50% 50%", sub: "Phase masks and learned reconstruction" },
    speckle: { video: "assets/research2/video/rssi-in-vivo-time-lapse.mp4", pos: "50% 50%", sub: "Blood-flow imaging with rolling-shutter speckle" },
    hbi: { pos: "50% 50%", sub: "Interactive experiments with living microorganisms (past work)" }
  };
  Object.keys(TILE).forEach(function (k) {
    var n = H.FIG_HOME[k], f = (/^assets\//.test(n) ? H.findFig(n) : H.mrGet(n)) || {};
    TILE[k].src = f.src || n; TILE[k].alt = f.alt; TILE[k].cap = f.caption; TILE[k].credit = f.credit;
  });
  document.getElementById("tiles").innerHTML = themes.map(function (t, i) {
    var c = TILE[t.key] || { src: t.keyFigure.src, sub: "" };
    var f = H.findFig(c.src) || {};
    var alt = c.alt || f.alt || "", cap = c.cap || f.caption || "", credit = c.credit || f.credit || "";
    return '<li data-rv style="--i:' + (i % 3) + '"><a class="tile hover-host" data-th="' + esc(t.key) + '" href="research.html#' + esc(t.key) + '">' +
      '<div class="media zoom wash ' + (c.mat || "") + '">' + (c.video ? H.video(c.video, c.src, alt) : H.img(c.src, alt, { style: "object-position:" + c.pos, sizes: "(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw" })) +
      '<p class="w-cap">' + esc(cap) + (credit ? '<span class="credit">' + esc(credit) + "</span>" : "") + "</p></div>" +
      '<div class="t-row"><span class="t-dot" aria-hidden="true"></span><h3 class="h3">' + esc(t.title) + "</h3></div>" +
      '<p class="t-sub">' + esc(c.sub) + "</p></a></li>";
  }).join("");

  /* ---------------- news rail ---------------- */
  /* one lab-made image per item at most, never repeated (H.newsMedia in site.js): lab photo, paper figure, event photo or
     verified logo; otherwise a typographic panel */
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
  /* drag to scroll with the mouse */
  var dx0 = null, sl0 = 0, moved = false;
  rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button) return; dx0 = e.clientX; sl0 = rail.scrollLeft; moved = false; });
  window.addEventListener("pointermove", function (e) {
    if (dx0 == null) return; var d = e.clientX - dx0;
    if (Math.abs(d) > 4) { moved = true; rail.classList.add("drag"); rail.scrollLeft = sl0 - d; }
  });
  window.addEventListener("pointerup", function () { dx0 = null; rail.classList.remove("drag"); });
  rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  renderRail();

  /* ---------------- principal investigator: the standard intro (data/identity.js) ---------------- */
  var piIntro = document.getElementById("pi-intro");
  if (piIntro && IIL.identity) piIntro.textContent = IIL.identity.piIntro;

  /* ---------------- team teaser ---------------- */
  var mem = IIL.members || [];
  document.getElementById("team-line").innerHTML = mem.length + ' members: research professors, postdoctoral researchers, graduate students and undergraduate interns, with <a class="ul" href="pi.html">Prof. Seung Ah Lee</a>.';
  document.getElementById("faces").innerHTML = [IIL.pi].concat(mem).filter(Boolean).map(function (m) {
    return '<li><img src="' + H.base + esc(H.face(m.photo, true)) + '" alt="' + esc(m.name) + '" width="46" height="46" loading="lazy" decoding="async"><span class="nm" aria-hidden="true">' + esc(m.name) + "</span></li>";
  }).join("");

  H.reveal(); H.parallax(); H.videos();
})();
