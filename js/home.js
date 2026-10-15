/* Home: hero carousel of research figures, theme tiles, image-led news rail with filters, team teaser. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var themes = (IIL.research || []).slice().sort(function (a, b) { return a.order - b.order; });
  function theme(k) { for (var i = 0; i < themes.length; i++) if (themes[i].key === k) return themes[i]; return null; }

  /* ---------------- hero carousel ---------------- */
  /* hero-kind figures from data/media_research.js, varied across themes; lensless phase masks feature prominently */
  var SLIDES = [
    ["rssi-raw-speckle-closeup.jpg", "50% 50%"],
    ["fabricated-phase-masks-on-glass-slide.jpg", "50% 50%"],
    ["fpvs-reconstructed-phase.jpg", "50% 50%"],
    ["lily-root-full-fov-vs-polarization-camera.jpg", "30% 50%"],
    ["learned-illumination-virtual-he.jpg", "50% 50%"],
    ["phase-mask-against-light.jpg", "50% 35%"],
    ["faded-slide-restained-zoom.jpg", "50% 50%"],
    ["measured-psf-caustic-wide.jpg", "50% 50%"]
  ].map(function (x) {
    var f = H.mrGet(x[0]) || {}; var t = theme(f.theme);
    return { src: f.src, pos: x[1], alt: f.alt, cap: f.caption, credit: f.credit, theme: t ? t.title : "" };
  }).filter(function (s) { return s.src; });
  var stage = document.getElementById("stage"), wrap = document.getElementById("slides");
  var capCard = stage.querySelector(".cap-card"), bars = document.getElementById("s-bars");
  var playBtn = document.getElementById("s-play");
  var N = SLIDES.length, cur = 0, DUR = 7000;
  wrap.innerHTML = SLIDES.map(function (s, i) {
    return '<figure class="slide' + (i === 0 ? " on" : "") + '" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + N + '"' + (i ? ' aria-hidden="true"' : "") + '><div class="sv">' +
      H.img(s.src, s.alt, { eager: i === 0, style: "object-position:" + s.pos, sizes: "(max-width: 980px) 100vw, 64vw" }) + "</div></figure>";
  }).join("");
  bars.innerHTML = SLIDES.map(function (s, i) {
    return '<button type="button" tabindex="-1" aria-label="Show figure ' + (i + 1) + '"' + (i === 0 ? ' class="on"' : "") + "><i></i></button>";
  }).join("");
  bars.removeAttribute("aria-hidden");
  document.getElementById("s-total").textContent = H.pad(N);
  var slides = wrap.querySelectorAll(".slide"), barEls = bars.querySelectorAll("button");
  stage.setAttribute("tabindex", "0");

  function setCap(i) {
    var s = SLIDES[i];
    document.getElementById("s-n").textContent = H.pad(i + 1);
    document.getElementById("s-theme").textContent = s.theme;
    document.getElementById("s-cap").textContent = s.cap;
    document.getElementById("s-credit").textContent = s.credit;
  }
  function go(i) {
    i = (i + N) % N;
    if (i === cur) return;
    slides[cur].classList.remove("on"); slides[cur].setAttribute("aria-hidden", "true");
    slides[i].classList.add("on"); slides[i].removeAttribute("aria-hidden");
    barEls.forEach(function (b, k) { b.classList.toggle("done", k < i); b.classList.remove("on"); b.querySelector("i").style.transform = k < i ? "scaleX(1)" : "scaleX(0)"; });
    barEls[i].classList.add("on");
    if (H.reduce) setCap(i);
    else { capCard.classList.add("swap"); setTimeout(function () { setCap(i); capCard.classList.remove("swap"); }, 380); }
    cur = i; elapsed = 0;
  }
  setCap(0);

  /* autoplay with a rAF clock: holds while hovered or focused, while the tab is hidden, or when paused */
  var elapsed = 0, last = 0, hold = false, paused = H.reduce, raf = 0;
  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = last ? Math.min(t - last, 100) : 0; last = t;
    if (paused || hold || document.hidden) return;
    elapsed += dt;
    var p = Math.min(elapsed / DUR, 1);
    barEls[cur].querySelector("i").style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (p >= 1) go(cur + 1);
  }
  function setPaused(v) {
    paused = v; playBtn.setAttribute("aria-pressed", String(v));
    playBtn.setAttribute("aria-label", v ? "Play slideshow" : "Pause slideshow");
    stage.classList.toggle("paused", v);
  }
  setPaused(paused);
  if (!H.still) raf = requestAnimationFrame(frame);
  else barEls[0].querySelector("i").style.transform = "scaleX(.35)";
  playBtn.addEventListener("click", function () { setPaused(!paused); });
  document.getElementById("s-prev").addEventListener("click", function () { go(cur - 1); });
  document.getElementById("s-next").addEventListener("click", function () { go(cur + 1); });
  bars.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(Array.prototype.indexOf.call(barEls, b)); });
  stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hold = true; });
  stage.addEventListener("pointerleave", function () { hold = false; slides.forEach(function (s) { s.style.removeProperty("--px"); s.style.removeProperty("--py"); }); });
  stage.addEventListener("keydown", function (e) {
    if (e.target !== stage) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });
  /* pointer parallax: the figure drifts slightly against the cursor */
  if (H.fine && !H.reduce) {
    var pr = 0, mx = 0, my = 0;
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - .5) * -18; my = ((e.clientY - r.top) / r.height - .5) * -14;
      if (!pr) pr = requestAnimationFrame(function () { pr = 0; slides[cur].style.setProperty("--px", mx.toFixed(1) + "px"); slides[cur].style.setProperty("--py", my.toFixed(1) + "px"); });
    });
  }
  /* swipe */
  var sx = null, sy = 0;
  stage.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") { sx = e.clientX; sy = e.clientY; } });
  stage.addEventListener("pointerup", function (e) {
    if (sx == null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
  });

  /* ---------------- theme tiles ---------------- */
  var TILE = {
    fp: { f: "siemens-star-orientation-map.jpg", pos: "50% 50%", sub: "Fourier ptychography, phase and polarization imaging" },
    vs: { f: "phase-to-he-and-ihc-split.jpg", pos: "50% 50%", sub: "Label-free histology from phase images" },
    lensless: { f: "lensless-camera-module-with-coin.jpg", pos: "50% 55%", sub: "Phase masks and learned reconstruction" },
    speckle: { f: "rssi-in-vivo-time-lapse-poster.jpg", video: "assets/research2/video/rssi-in-vivo-time-lapse.mp4", pos: "50% 50%", sub: "Blood-flow imaging with rolling-shutter speckle" },
    hbi: { f: "remember-installation.jpg", pos: "50% 50%", sub: "Interactive experiments with living microorganisms (past work)" }
  };
  Object.keys(TILE).forEach(function (k) { var f = H.mrGet(TILE[k].f) || {}; TILE[k].src = f.src; TILE[k].alt = f.alt; TILE[k].cap = f.caption; TILE[k].credit = f.credit; });
  document.getElementById("tiles").innerHTML = themes.map(function (t, i) {
    var c = TILE[t.key] || { src: t.keyFigure.src, sub: "" };
    var f = H.findFig(c.src) || {};
    var alt = c.alt || f.alt || "", cap = c.cap || f.caption || "", credit = c.credit || f.credit || "";
    return '<li data-rv style="--i:' + (i % 3) + '"><a class="tile hover-host" data-th="' + esc(t.key) + '" href="research.html#' + esc(t.key) + '">' +
      '<div class="media zoom wash ' + (c.mat || "") + '">' + (c.video ? H.video(c.video, c.src, alt) : H.img(c.src, alt, { style: "object-position:" + c.pos, sizes: i < 2 ? "(max-width: 980px) 50vw, 56vw" : "(max-width: 980px) 50vw, 33vw" })) +
      '<p class="w-cap">' + esc(cap) + (credit ? '<span class="credit">' + esc(credit) + "</span>" : "") + "</p></div>" +
      '<div class="t-row"><span class="meta">' + H.pad(i + 1) + '</span><h3 class="h3">' + esc(t.title) + "</h3>" + H.arrow + "</div>" +
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

  /* ---------------- team teaser ---------------- */
  var mem = IIL.members || [];
  document.getElementById("team-line").innerHTML = mem.length + ' members: research professors, postdoctoral researchers, graduate students and undergraduate interns, with <a class="ul" href="pi.html">Prof. Seung Ah Lee</a>.';
  document.getElementById("faces").innerHTML = [IIL.pi].concat(mem).filter(Boolean).map(function (m) {
    return '<li><img src="' + H.base + esc(H.face(m.photo, true)) + '" alt="' + esc(m.name) + '" width="46" height="46" loading="lazy" decoding="async"><span class="nm" aria-hidden="true">' + esc(m.name) + "</span></li>";
  }).join("");

  H.reveal(); H.parallax(); H.videos();
})();
