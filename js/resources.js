/* Resources: code repositories, datasets, tools and hardware, GitHub organization, courses (SNU current, Yonsei past).
   Everything comes from data/resources.js and data/teaching.js; nothing is added here. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var TOPIC = { lensless: "Lensless cameras", vs: "Virtual staining", speckle: "Speckle imaging", fp: "Fourier ptychography" };
  /* research figure shown on each repository card */
  var R = "assets/research2/";
  var FIG = {
    IFIN: { src: R + "lensless/ifin-mask-height-and-psfs.jpg", contain: true },
    "GAPC-ASM": { src: R + "lensless/gapc-asm-aperture-geometry.jpg", contain: true },
    FPVS: { src: R + "vs/fpvs-reconstructed-amplitude.jpg" },
    RSSI: { src: R + "speckle/rs-speckle-simulation-and-fitting.jpg", contain: true },
    FP_ADMM: { src: R + "fp/fp-superresolved-usaf.jpg" },
    Smartphone_FPM: { src: R + "fp/smartphone-fp-pipeline-app.png", contain: true },
    WiderCam: { src: R + "lensless/ifin-lensless-camera-prototype.jpg" },
    "Smartphone FPM example images": { src: R + "fp/smartphone-fp-color-pap-smear.jpg" },
    "RSSI in vivo mouse brain speckle images": { src: R + "speckle/rssi-raw-frame-dataset-crop.jpg" },
    "FPVS example FPM data": { src: R + "fp/fpvs-raw-led-images-montage.jpg" },
    "Digital staining literature database": { src: R + "vs/nir-phase-to-rgb-training-scheme.jpg", contain: true }
  };

  var CODE_I = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 4L1.8 8l3.7 4M10.5 4l3.7 4-3.7 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  var TOOL_I = {
    "3d-models": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z M4 7.4l8 4.6 8-4.6 M12 12v9.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    "raspberrypi-cam": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6.5" width="18" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8.5 6.5l1.2-2h4.6l1.2 2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    "LED-matrix": '<svg viewBox="0 0 24 24" aria-hidden="true">' + [6, 10, 14, 18].map(function (y) { return [6, 10, 14, 18].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="1.5" fill="currentColor"/>'; }).join(""); }).join("") + "</svg>"
  };

  function media(name, alt) {
    var f = FIG[name]; if (!f) return "";
    var d = H.findFig(f.src) || {};
    return '<span class="media zoom' + (f.contain ? " contain mat-white" : "") + ' r-fig">' + H.img(f.src, f.alt || d.alt || "", { sizes: "(max-width: 640px) 100vw, 480px" }) + "</span>";
  }
  function host(u) { return String(u).replace(/^https?:\/\//, "").replace(/\/$/, ""); }

  var code = IIL.code || [];
  document.getElementById("c-count").textContent = code.length + " repositories";
  document.getElementById("repos").innerHTML = code.map(function (r) {
    return '<li data-rv><article class="repo hover-host" data-th="' + esc(r.topic || "") + '">' + media(r.name) +
      '<div class="r-body"><p class="r-top"><span class="r-ic">' + CODE_I + '</span><span class="tag" data-th="' + esc(r.topic || "") + '">' + esc(TOPIC[r.topic] || r.topic || "") + "</span></p>" +
      '<h3 class="r-name"><a href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="ul-t">' + esc(r.name) + "</span> " + H.ext + "</a></h3>" +
      '<p class="r-desc">' + esc(r.desc) + "</p>" +
      (r.paper ? '<p class="r-paper"><span class="meta">Paper</span>' + esc(r.paper) + "</p>" : "") +
      '<p class="r-links"><a class="ul" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(host(r.url)) + "</a>" +
      (r.page ? '<a class="ul" href="' + esc(r.page) + '" target="_blank" rel="noopener">Project page</a>' : "") + "</p></div></article></li>";
  }).join("");

  /* datasets: first one featured, the rest in a two-column grid; facts table from the data file only */
  function dRow(k, v) { return v ? "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>" : ""; }
  function lnk(u, t) { return '<a class="ul" href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + "</a>"; }
  var ds = IIL.datasets || [];
  document.getElementById("data").innerHTML = '<p class="small d-count">' + ds.length + " datasets</p>" + ds.map(function (d, i) {
    var f = FIG[d.name] || {}, fig = H.findFig(f.src || "") || {};
    return '<article class="dataset hover-host' + (i === 0 ? " feat" : "") + '" data-rv>' + media(d.name) +
      '<div class="d-body"><span class="tag" data-th="' + esc(d.topic || "") + '">' + esc(TOPIC[d.topic] || d.topic || "") + '</span><h3 class="h2 d-name">' + esc(d.name) + "</h3>" +
      '<p class="d-desc">' + esc(d.desc) + "</p>" +
      '<dl class="d-facts">' + dRow("Size", esc(d.size)) + dRow("Format", esc(d.format)) + dRow("Paper", esc(d.paper)) +
        dRow("Code", d.code ? lnk(d.code, host(d.code)) : "") + dRow("Project page", d.page ? lnk(d.page, host(d.page)) : "") + "</dl>" +
      (fig.credit ? '<p class="d-credit">Image: ' + esc(fig.credit) + "</p>" : "") +
      '<p class="d-link"><a class="btn solid" href="' + esc(d.url) + '" target="_blank" rel="noopener">Open dataset ' + H.ext + '</a><span class="d-host">' + esc(host(d.url)) + "</span></p></div></article>";
  }).join("");

  document.getElementById("tool-list").innerHTML = (IIL.tools || []).map(function (t, i) {
    return '<li data-rv><a class="tool k' + (i % 3) + '" href="' + esc(t.url) + '" target="_blank" rel="noopener"><span class="t-ic">' + (TOOL_I[t.name] || CODE_I) + "</span>" +
      '<span class="t-name">' + esc(t.name) + " " + H.ext + '</span><span class="t-desc">' + esc(t.desc) + '</span><span class="t-url">' + esc(host(t.url)) + "</span></a></li>";
  }).join("");

  if (IIL.repoOrg) {
    document.getElementById("org-box").innerHTML =
      '<div><p class="eyebrow">GitHub organization</p><h2 class="h2 o-name">' + esc(host(IIL.repoOrg)) + '</h2><p class="o-text">All public repositories of the laboratory, including code, 3D models and device control software.</p></div>' +
      '<a class="btn light" href="' + esc(IIL.repoOrg) + '" target="_blank" rel="noopener">Open on GitHub ' + H.ext + "</a>";
  }

  /* courses */
  var T = IIL.teaching || {};
  document.getElementById("t-note").textContent = "Courses taught by Prof. Seung Ah Lee at Seoul National University (since 2025) and Yonsei University (2018–2025).";
  function lvl(c) { return c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : ""; }
  document.getElementById("current").innerHTML = (T.current || []).map(function (c, i) {
    return '<li data-rv><article class="course k' + i + '"><div class="c-top"><span class="c-code">' + esc(c.code) + '</span><span class="tag">' + esc(lvl(c)) + "</span></div>" +
      '<h4 class="c-title">' + esc(c.title) + '</h4><p class="c-ko" lang="ko">' + esc(c.titleKo || "") + "</p>" +
      '<p class="c-desc">' + esc(c.description || "") + "</p>" +
      '<p class="c-terms">' + (c.terms || []).map(function (t) { return '<span class="term">' + esc(t) + "</span>"; }).join("") + "</p></article></li>";
  }).join("");
  document.getElementById("past").innerHTML = (T.past || []).map(function (c) {
    return '<li data-rv><span class="p-code">' + esc(c.code) + '</span><span class="p-title">' + esc(c.title) +
      (c.description ? '<span class="p-desc">' + esc(c.description) + "</span>" : "") + '</span><span class="p-terms">' + esc((c.terms || []).join(", ")) + "</span></li>";
  }).join("");

  H.reveal();
})();
