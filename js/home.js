(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var themes = H.themes();
  (function viz() {
    var host = document.getElementById("viz"), cv = document.getElementById("viz-c"), pp = document.getElementById("viz-pp");
    if (!host || !cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var N = cv.width, LOG = Math.round(Math.log(N) / Math.LN2), NN = N * N;
    var re = new Float32Array(NN), im = new Float32Array(NN);
    var cosT = new Float32Array(N / 2), sinT = new Float32Array(N / 2), rev = new Uint16Array(N);
    for (var k = 0; k < N / 2; k++) { cosT[k] = Math.cos(2 * Math.PI * k / N); sinT[k] = -Math.sin(2 * Math.PI * k / N); }
    for (var r = 0; r < N; r++) { var x = r, y = 0; for (var b = 0; b < LOG; b++) { y = (y << 1) | (x & 1); x >>= 1; } rev[r] = y; }
    var bufR = new Float32Array(N), bufI = new Float32Array(N);
    function fft1(off, stride) {
      for (var i = 0; i < N; i++) { var j = off + rev[i] * stride; bufR[i] = re[j]; bufI[i] = im[j]; }
      for (var size = 2; size <= N; size <<= 1) {
        var half = size >> 1, step = N / size;
        for (var s0 = 0; s0 < N; s0 += size) for (var q = 0; q < half; q++) {
          var wr = cosT[q * step], wi = sinT[q * step];
          var a = s0 + q, c = a + half, tr = bufR[c] * wr - bufI[c] * wi, ti = bufR[c] * wi + bufI[c] * wr;
          bufR[c] = bufR[a] - tr; bufI[c] = bufI[a] - ti; bufR[a] += tr; bufI[a] += ti;
        }
      }
      for (var i2 = 0; i2 < N; i2++) { var j2 = off + i2 * stride; re[j2] = bufR[i2]; im[j2] = bufI[i2]; }
    }
    function fft2() { for (var r2 = 0; r2 < N; r2++) fft1(r2 * N, 1); for (var c2 = 0; c2 < N; c2++) fft1(c2, N); }
    var seed = 20261015; function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    function fq(i) { return i < N / 2 ? i : i - N; }
    var pupil = [];
    for (var y6 = 0; y6 < N; y6++) for (var x6 = 0; x6 < N; x6++) { var u = fq(x6) / 54, v = fq(y6) / 17; if (u * u + v * v <= 1) pupil.push(y6 * N + x6); }
    function speckle() {
      re.fill(0); im.fill(0);
      for (var i = 0; i < pupil.length; i++) { var ph = rnd() * 2 * Math.PI; re[pupil[i]] = Math.cos(ph); im[pupil[i]] = Math.sin(ph); }
      fft2();
      var s = 0; for (var j = 0; j < NN; j++) s += re[j] * re[j] + im[j] * im[j];
      var g = 1 / Math.sqrt(s / NN); for (var j2 = 0; j2 < NN; j2++) { re[j2] *= g; im[j2] *= g; }
    }
    var BARS = ["M74 238h86a12 12 0 0 1 12 12v263a12 12 0 0 1-12 12H74a12 12 0 0 1-12-12V250a12 12 0 0 1 12-12Z",
      "M288 238h86a12 12 0 0 1 12 12v263a12 12 0 0 1-12 12h-86a12 12 0 0 1-12-12V250a12 12 0 0 1 12-12Z",
      "M331 78a67 67 0 1 1 0 134a67 67 0 1 1 0-134Z",
      "M486 87h82a12 12 0 0 1 12 12v281a73 73 0 0 0 73 73h43a12 12 0 0 1 12 12v61a12 12 0 0 1-12 12h-76A146 146 0 0 1 474 392V99a12 12 0 0 1 12-12Z"];
    var STARS = ["M116 30C121.75 110.5 150.5 139.25 231 145C150.5 150.75 121.75 179.5 116 260C110.25 179.5 81.5 150.75 1 145C81.5 139.25 110.25 110.5 116 30Z",
      "M186 181C187.55 202.7 195.3 210.45 217 212C195.3 213.55 187.55 221.3 186 243C184.45 221.3 176.7 213.55 155 212C176.7 210.45 184.45 202.7 186 181Z"];
    var LS = .58 * N / 712, LX = N / 2 - 356 * LS, LY = N / 2 - 284 * LS + N * .01;
    function place(c) { c.setTransform(LS, 0, 0, LS, LX, LY); }
    var m = new Float32Array(NN), okPath = typeof Path2D === "function";
    if (okPath) {
      var oc = document.createElement("canvas"); oc.width = oc.height = N;
      var mc = oc.getContext("2d");
      if (mc) {
        place(mc); mc.fillStyle = "#fff"; BARS.concat(STARS).forEach(function (d) { mc.fill(new Path2D(d)); });
        var md = mc.getImageData(0, 0, N, N).data;
        for (var i7 = 0; i7 < NN; i7++) m[i7] = md[i7 * 4 + 3] / 255;
        var tmp = new Float32Array(NN);
        for (var pass = 0; pass < 2; pass++) {
          for (var yy = 0; yy < N; yy++) for (var xx = 0; xx < N; xx++) { var sm = 0; for (var d1 = -2; d1 <= 2; d1++) { var xq = Math.min(N - 1, Math.max(0, xx + d1)); sm += m[yy * N + xq]; } tmp[yy * N + xx] = sm / 5; }
          for (var yy2 = 0; yy2 < N; yy2++) for (var xx2 = 0; xx2 < N; xx2++) { var sm2 = 0; for (var d2 = -2; d2 <= 2; d2++) { var yq = Math.min(N - 1, Math.max(0, yy2 + d2)); sm2 += tmp[yq * N + xx2]; } m[yy2 * N + xx2] = sm2 / 5; }
        }
      }
    }
    var STOPS = [[0, [255, 255, 255]], [.28, [228, 238, 248]], [.55, [174, 203, 231]], [.8, [127, 152, 189]], [1, [29, 48, 87]]];
    var LUT = new Uint8ClampedArray(256 * 3);
    for (var l = 0; l < 256; l++) {
      var t0 = l / 255, z = 1; while (z < STOPS.length - 1 && STOPS[z][0] < t0) z++;
      var A = STOPS[z - 1], B = STOPS[z], w = (t0 - A[0]) / (B[0] - A[0] || 1);
      for (var ch = 0; ch < 3; ch++) LUT[l * 3 + ch] = A[1][ch] + (B[1][ch] - A[1][ch]) * w;
    }
    var env = new Float32Array(NN);
    for (var y7 = 0; y7 < N; y7++) for (var x7 = 0; x7 < N; x7++) { var rr = Math.hypot(x7 - N / 2 + .5, y7 - N / 2 + .5) / (N * .39); env[y7 * N + x7] = Math.exp(-Math.pow(rr, 6)); }
    var img = ctx.createImageData(N, N), px = img.data, G = 1.25;
    function paint(i, Iv) {
      var q = ((1 - Math.exp(-Iv / G)) * env[i] * 255) | 0, o = i * 4;
      px[o] = LUT[q * 3]; px[o + 1] = LUT[q * 3 + 1]; px[o + 2] = LUT[q * 3 + 2]; px[o + 3] = 255;
    }
    speckle();
    var idx = [];
    for (var i8 = 0; i8 < NN; i8++) { if (m[i8] > .004 && env[i8] > .002) idx.push(i8); else paint(i8, re[i8] * re[i8] + im[i8] * im[i8]); }
    var M = idx.length, ca = new Float32Array(M), cb = new Float32Array(M), sR = new Float32Array(M), sI = new Float32Array(M), DR = [], DI = [];
    var x0 = N, y0 = N, x1 = 0, y1 = 0;
    for (var p = 0; p < M; p++) {
      var ii = idx[p], mm = m[ii]; ca[p] = Math.cos(Math.PI * mm / 2); cb[p] = Math.sin(Math.PI * mm / 2); sR[p] = re[ii] * ca[p]; sI[p] = im[ii] * ca[p];
      var px2 = ii % N, py2 = (ii / N) | 0; if (px2 < x0) x0 = px2; if (px2 > x1) x1 = px2; if (py2 < y0) y0 = py2; if (py2 > y1) y1 = py2;
    }
    for (var f = 0; f < 4; f++) {
      speckle();
      var dr = new Float32Array(M), di = new Float32Array(M);
      for (var p2 = 0; p2 < M; p2++) { dr[p2] = re[idx[p2]] * cb[p2]; di[p2] = im[idx[p2]] * cb[p2]; }
      DR.push(dr); DI.push(di);
    }
    re = im = null;
    function frame(time) {
      var a = Math.PI / 4 + .35 * Math.sin(.21 * time), bb = time, c2 = 1.37 * time + 1;
      var w1 = Math.cos(a) * Math.cos(bb), w2 = Math.cos(a) * Math.sin(bb), w3 = Math.sin(a) * Math.cos(c2), w4 = Math.sin(a) * Math.sin(c2);
      var R1 = DR[0], R2 = DR[1], R3 = DR[2], R4 = DR[3], I1 = DI[0], I2 = DI[1], I3 = DI[2], I4 = DI[3];
      for (var p3 = 0; p3 < M; p3++) {
        var er = sR[p3] + w1 * R1[p3] + w2 * R2[p3] + w3 * R3[p3] + w4 * R4[p3];
        var ei = sI[p3] + w1 * I1[p3] + w2 * I2[p3] + w3 * I3[p3] + w4 * I4[p3];
        paint(idx[p3], er * er + ei * ei);
      }
      if (time === T0) ctx.putImageData(img, 0, 0);
      else if (M) ctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    }
    var T0 = .6, t = T0, last = 0, raf = 0, playing = !(H.reduce || H.still), vis = true, SPEED = .8;
    frame(t);
    if (!pp) return;
    if (H.reduce || H.still) { pp.hidden = true; return; }
    function loop(now) {
      raf = 0;
      if (!playing || !vis || document.hidden) return;
      if (now - last >= 1000 / 30) { t += SPEED * Math.min(now - last, 120) / 1000; last = now; frame(t); }
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
    hbi: { pos: "50% 50%", sub: "Interactive experiments with living microorganisms" }
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
