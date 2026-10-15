/* Home: hero with a lab photograph, theme tiles, image-led news rail with filters, principal investigator, team teaser. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  /* four themes (Virtual Staining is part of Computational Microscopy: H.PARENT in site.js) */
  var themes = H.themes();

  /* ---------------- hero: a lab photograph (index.html); the former research-figure carousel was removed at the PI's request ---------------- */

  /* ---------------- theme tiles ---------------- */
  /* one figure per theme (H.FIG_HOME in site.js); research figures stay small on this page */
  var TILE = {
    fp: { pos: "50% 50%", sub: "Fourier ptychography, phase and polarization imaging, virtual staining" },
    lensless: { pos: "50% 50%", sub: "Phase masks and learned reconstruction" },
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
