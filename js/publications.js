/* Publications: grouped by year, text search, topic filter chips; highlighted papers carry a figure thumbnail with hover zoom. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var pubs = (IIL.pubs || []).slice().sort(function (a, b) { return b.year - a.year; });
  /* four themes; virtual staining is part of computational microscopy and stays available as a sub-filter */
  var TOPICS = [["all", "All"], ["micro", "Computational microscopy"], ["vs", "Virtual staining"], ["lensless", "Lensless cameras"], ["speckle", "Dynamic speckle imaging"], ["hbi", "Interactive biology"], ["other", "Other"]];
  function topicsOf(p) {
    var t = [];
    (p.topics || []).forEach(function (x) {
      var ks = (x === "fp" || x === "microscopy") ? ["micro"] : x === "vs" ? ["micro", "vs"] : [x];
      ks.forEach(function (k) { if (t.indexOf(k) < 0) t.push(k); });
    });
    return t.length ? t : ["other"];
  }
  var TNAME = {}; TOPICS.forEach(function (t) { TNAME[t[0]] = t[1]; });
  /* figure per highlighted paper (from the research figure library) */
  var R = "assets/research2/";
  var FIG = {
    byun2026physicsguided: R + "speckle/physics-guided-speckle-network.png",
    bae2026integrated: R + "lensless/ifin-network-blocks.png",
    kang2026geometryaware: R + "lensless/gapc-asm-psf-fidelity-study.jpg",
    chae2026pupil: R + "fp/starch-birefringence-jones.jpg",
    lee2026semisupervised: R + "vs/learned-illumination-raw.jpg",
    yoon2025singleshot: R + "fp/single-shot-fp-75fps.jpg",
    chae2024restoring: R + "vs/faded-color-phase-restained-panel.jpg",
    lee2024anisotropic: R + "fp/tv-regularized-fp.jpg",
    lee2024highresolution: R + "fp/display-screen-fp-render.png",
    lee2024rolling: R + "speckle/rsspg-fingertip-render.png",
    yi2024improvements: R + "speckle/flow-phantom-channel.jpg",
    kim2023apertureencoded: R + "lensless/hyperspectral-channels-400-760nm.jpg",
    lee2023design: R + "lensless/custom-psfs-raw-and-reconstructions.jpg",
    yi2022singleshot: R + "speckle/rssi-principle.jpg",
    baek2022lensless: R + "lensless/polarization-camera-exploded-render.png",
    lee2022fabrication: R + "lensless/uv-imprint-process-and-device-structure.png", /* figure of the paper; the camera photo is on the Lensless Cameras page */
    yi2021remember: R + "hbi/remember-pipeline.png",
    lee2021smartphonebased: "assets/research/fp/smartphone-fp-blood-smear-amplitude-phase.jpg"
  };

  var PHOTO = { lee2022euglpollock: true };
  /* arXiv versions recorded in the research data (data/research_lensless.js, IFIN refs) */
  var ARXIV = { bae2026integrated: "2607.04608" };
  function authors(s) { return esc(s).replace(/Lee, S\.A\.(\*?)/g, "<strong>Lee, S.A.$1</strong>"); }

  /* 2019 and later by year; everything before 2019 in one "Pre-group" block (PI request 2026-10-15) */
  var PRE = 2019;
  var years = [], all = [];
  pubs.forEach(function (p) { if (all.indexOf(p.year) < 0) all.push(p.year); if (p.year >= PRE && years.indexOf(p.year) < 0) years.push(p.year); });
  var pre = pubs.filter(function (p) { return p.year < PRE; });
  var preRange = pre.length ? pre[pre.length - 1].year + "–" + pre[0].year : "";
  document.getElementById("p-total").textContent = pubs.length + " publications, " + all[all.length - 1] + "–" + all[0];

  var groups = years.map(function (y) { return { id: "y" + y, h: "<span>" + y + "</span>", items: pubs.filter(function (p) { return p.year === y; }) }; });
  if (pre.length) groups.push({ id: "pre-group", pre: true, h: '<span>Pre-group<span class="yr-sub">publications (' + preRange + ")</span></span>", items: pre });
  document.getElementById("pubs").innerHTML = groups.map(function (g) {
    var items = g.items;
    return '<section class="yr' + (g.pre ? " yr-pre" : "") + '" aria-labelledby="' + g.id + '"><h2 class="yr-h" id="' + g.id + '">' + g.h + '<span class="yr-n">' + items.length + '</span></h2><ol class="yr-list">' +
      items.map(function (p) {
        var href = p.url || (p.doi ? "https://doi.org/" + p.doi : "");
        var t = href ? '<a class="pub-t" href="' + esc(href) + '" target="_blank" rel="noopener"><span class="ul-t">' + esc(p.title) + '</span> <span class="ext" aria-hidden="true">&#8599;</span></a>' : '<span class="pub-t">' + esc(p.title) + "</span>";
        var text = [p.title, p.authors, p.venue, p.venueShort, p.year, p.doi].join(" ").toLowerCase();
        var tp = topicsOf(p);
        var fig = FIG[p.id], thumb = "";
        if (fig) {
          var f = H.findFig(fig) || {};
          var png = /\.png$/.test(fig);
          thumb = '<a class="pub-fig media zoom' + (png ? " contain mat-white" : "") + (PHOTO[p.id] ? " photo" : " wash") + '" href="' + esc(href) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
            H.img(H.thumb(fig, 400), f.alt || "", { wh: H.dims(H.thumb(fig, 400)) || H.dims(fig) }) + "</a>";
        }
        var tag = p.type === "conference" ? "Conference" : p.type === "review" ? "Review" : p.type === "commentary" ? "Commentary" : "";
        return '<li class="pub' + (fig ? " hl" : "") + '" data-rv data-topics="' + tp.join(" ") + '" data-text="' + esc(text) + '">' + thumb +
          '<div class="pub-main">' + t +
          (p.plain ? '<p class="pub-plain">' + esc(p.plain) + "</p>" : "") +
          '<p class="pub-a">' + authors(p.authors) + "</p>" +
          '<p class="pub-v"><span><em>' + esc(p.venue) + "</em>" + (p.details ? ", " + esc(p.details) : "") + (p.year < PRE ? " (" + p.year + ")" : "") + "</span>" +
          (p.doi ? '<a class="pub-id" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + "</a>" : "") +
          (ARXIV[p.id] ? '<a class="pub-id" href="https://arxiv.org/abs/' + ARXIV[p.id] + '" target="_blank" rel="noopener">arXiv:' + ARXIV[p.id] + "</a>" : "") +
          tp.filter(function (k) { return k !== "other"; }).map(function (k) { return '<span class="tag" data-th="' + (k === "micro" ? "fp" : k) + '">' + esc(TNAME[k]) + "</span>"; }).join("") +
          (tag ? '<span class="tag blush">' + tag + "</span>" : "") + (p.era === "pre" ? '<span class="tag plain">Before IIL</span>' : "") + "</p></div></li>";
      }).join("") + "</ol></section>";
  }).join("");

  var pt = IIL.patents || [];
  document.getElementById("pt-count").textContent = pt.length + " patents";
  document.getElementById("patents").innerHTML = pt.map(function (p) {
    var inv = esc(p.inventors || "").replace(/SA Lee/g, "<strong>SA Lee</strong>");
    var st = p.status === "granted" ? "Granted" : (p.status === "application" ? "Application" : esc(p.status || ""));
    return '<li data-rv><a class="pat" href="' + esc(p.url) + '" target="_blank" rel="noopener"><span class="pat-t"><span class="ul-t">' + esc(p.title) + "</span></span>" +
      '<span class="pat-i">' + inv + '</span><span class="pat-m">' + esc(p.number) + " &middot; " + st + " " + esc(p.year) + "</span></a></li>";
  }).join("");

  var chips = document.getElementById("chips"), state = { t: "all", q: "" };
  chips.innerHTML = TOPICS.map(function (t) {
    var n = t[0] === "all" ? pubs.length : pubs.filter(function (p) { return topicsOf(p).indexOf(t[0]) >= 0; }).length;
    return '<button type="button" class="chip" data-t="' + t[0] + '" data-th="' + (t[0] === "micro" ? "fp" : t[0]) + '" aria-pressed="' + (t[0] === "all") + '">' + t[1] + ' <span class="n">' + n + "</span></button>";
  }).join("");

  var q = document.getElementById("q"), count = document.getElementById("count"), none = document.getElementById("none");
  var lis = Array.prototype.slice.call(document.querySelectorAll(".pub")), secs = Array.prototype.slice.call(document.querySelectorAll(".yr"));
  function apply() {
    var terms = state.q ? state.q.split(/\s+/) : [], shown = 0;
    lis.forEach(function (li) {
      var t = li.getAttribute("data-text");
      var ok = (state.t === "all" || (" " + li.getAttribute("data-topics") + " ").indexOf(" " + state.t + " ") >= 0) && terms.every(function (w) { return t.indexOf(w) >= 0; });
      li.hidden = !ok; if (ok) { shown++; if (!H.prerender) li.classList.add("rv-in"); }
    });
    secs.forEach(function (s) { var n = s.querySelectorAll(".pub:not([hidden])").length; s.hidden = !n; s.querySelector(".yr-n").textContent = n; });
    var filtered = state.q || state.t !== "all";
    count.textContent = filtered ? shown + " of " + pubs.length + " shown" : "";
    none.hidden = shown > 0;
  }
  function update() {
    if (document.startViewTransition && !H.reduce && !document.hidden) {
      var vt = document.startViewTransition(apply);
      [vt.ready, vt.finished, vt.updateCallbackDone].forEach(function (p) { if (p && p.catch) p.catch(function () {}); });
    } else apply();
  }
  var tmr = 0;
  q.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(function () { state.q = q.value.trim().toLowerCase(); update(); }, 140); });
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    state.t = b.getAttribute("data-t");
    chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    update();
  });
  var tb = document.getElementById("toolbar");
  if (!H.prerender && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div"); sentinel.style.height = "1px"; tb.parentNode.insertBefore(sentinel, tb);
    new IntersectionObserver(function (es) { tb.classList.toggle("stuck", !es[0].isIntersecting); }).observe(sentinel);
  }
  apply();
  H.reveal();
})();
