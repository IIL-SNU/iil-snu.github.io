(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var KEY = document.body.getAttribute("data-theme");
  var t = H.themeData(KEY);
  if (!t) return;
  var subs = H.subthemes(KEY);
  var byId = {};
  (IIL.pubs || []).forEach(function (p) { byId[p.id] = p; });
  function person(a) {
    var m = String(a).replace(/\*/g, "").trim().match(/^([^,]+),\s*(.+)$/);
    if (!m) return a;
    return m[2].replace(/([A-Z])\./g, "$1. ").replace(/\s+/g, " ").trim() + " " + m[1].trim();
  }
  function firstAuthors(s) {
    var list = String(s).replace(/,?\s*&\s*/g, ", ").match(/[^,]+,\s*(?:[A-Z][a-z]?\.(?:-?[A-Z]\.)*\*?)/g) || [];
    if (list.length === 2) return person(list[0]) + " and " + person(list[1]);
    return person(list[0] || s) + (list.length > 2 ? " et al." : "");
  }
  function doiUrl(p) { return p.doi ? "https://doi.org/" + p.doi : p.url; }
  function label(p) { return firstAuthors(p.authors) + ", " + (p.venueShort || p.venue).replace(/\s*\(.*\)$/, "").replace(/\s+\d{4}$/, "") + " " + p.year; }
  function cite(ids) {
    return "(" + ids.map(function (id) {
      var p = byId[id]; if (!p) return "";
      return '<a class="ul" href="' + esc(doiUrl(p)) + '" target="_blank" rel="noopener">' + esc(label(p)) + "</a>";
    }).filter(Boolean).join("; ") + ")";
  }
  function fact(k, fallback) { return esc(FACT[k] || fallback).replace(/\{([^}]+)\}/g, function (m, ids) { return cite(ids.split(";")); }); }
  var FACT = {
    fp: "IIL develops computational microscopes that capture wide-field, high-resolution images with quantitative phase and polarization contrast, and applies them to label-free imaging of cells and tissue.",
    vs: "IIL develops virtual staining for digital pathology, turning the quantitative phase of unstained tissue slides into images of stained slides.",
    lensless: "IIL develops lensless cameras and learned optics: thin phase masks designed and fabricated for each application, and reconstruction algorithms that combine physical models with deep learning.",
    speckle: "IIL develops dynamic speckle imaging, which analyzes speckle from dynamic scattering to measure the dynamics of a sample, such as blood flow, with standard image sensors.",
    hbi: "IIL develops interactive biology systems in which people interact in real time with living, light-responsive microorganisms through a microscope and a projector."
  };
  var FIGS = {
    fp: H.FIG_THEME.fp, vs: H.FIG_THEME.vs,
    lensless: ["uv-imprint-integrated-camera-prototype-clean.jpg", "phase-mask-height-map-3d.jpg", "polarization-camera-pipeline.png"],
    speckle: ["rssi-flow-phantom-linearity.jpg", "rsspg-cold-pressor.jpg"],
    hbi: ["euglpollock-tablet-drawing-poster.jpg", "euglpollock-painting-poster.jpg", "trapit-light-trap-sequence.jpg", "trapit-system-overview.png", "microaquarium-installation.jpg"]
  };
  var TOPICS = { fp: ["fp", "microscopy", "vs"], lensless: ["lensless"], speckle: ["speckle"], hbi: ["hbi"] };
  var PATENTS = { fp: ["US11880965B2"], lensless: ["US12108134B2", "US12062190B2"] };
  var SUBID = { vs: "virtual-staining" };
  var SKIP_FACT = /^Museum-ready$/;
  function $(id) { return document.getElementById(id); }
  function lnk(u, txt) { return '<a class="ul" href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(txt) + "</a>"; }
  function host(u) { return String(u).replace(/^https?:\/\//, "").replace(/\/$/, ""); }
  function resources(k) {
    var code = (IIL.code || []).filter(function (c) { return c.topic === k; });
    var data = (IIL.datasets || []).filter(function (d) { return d.topic === k; });
    var pats = (IIL.patents || []).filter(function (p) { return (PATENTS[k] || []).indexOf(p.number) >= 0; });
    var rows = code.map(function (c) {
      return '<li><span class="th-k">Code</span><span>' + lnk(c.url, host(c.url)) + '<span class="th-d">' + esc(c.desc) + (c.paper ? " " + esc(c.paper) + "." : "") + "</span></span></li>";
    }).concat(data.map(function (d) {
      return '<li><span class="th-k">Data</span><span>' + lnk(d.url, d.name) + '<span class="th-d">' + esc(d.desc) + "</span></span></li>";
    })).concat(pats.map(function (p) {
      return '<li><span class="th-k">Patent</span><span>' + lnk(p.url, p.number) + '<span class="th-d">' + esc(p.title) + " (" + (p.status === "granted" ? "granted" : esc(p.status)) + " " + esc(p.year) + ")</span></span></li>";
    }));
    return rows.length ? '<h3 class="meta th-h">Code, data and patents</h3><ul class="th-res">' + rows.join("") + "</ul>" : "";
  }
  function media(x) {
    var figs = (FIGS[x.key] || []).map(function (n) { return /^assets\//.test(n) ? H.findFig(n) : H.mrGet(n); }).filter(Boolean);
    var facts = (x.facts || []).filter(function (f) { return !SKIP_FACT.test(f.value); });
    return figs.map(function (f) {
      var png = /\.png$/.test(f.src);
      if (f.video) return '<figure class="t-fig th-fig"><div class="media has-vid" style="aspect-ratio:' + (f.w || 16) + " / " + (f.h || 9) + '">' +
        H.video(f.video, f.src, f.alt) + H.vidLabels(f.labels) + "</div>" +
        '<figcaption class="caption">' + esc(f.caption) + ' <span class="credit">' + esc(f.credit) + "</span></figcaption></figure>";
      return '<figure class="t-fig th-fig"><div class="media natural' + (png ? " mat-white" : "") + '"' + (png ? "" : ' data-loupe="2.2"') + ">" +
        H.img(f.src, f.alt, { sizes: "(max-width: 900px) 100vw, 760px" }) + "</div>" +
        '<figcaption class="caption">' + esc(f.caption) + ' <span class="credit">' + esc(f.credit) + "</span></figcaption></figure>";
    }).join("") +
      "";
  }
  function sentences(s) {
    var out = [], cur = "";
    String(s || "").split(/(?<=[.!?])\s+/).forEach(function (x) {
      cur = cur ? cur + " " + x : x;
      if (!/\b(Prof|Dr|al|e\.g|i\.e|vs|Fig|approx)\.$/.test(cur)) { out.push(cur); cur = ""; }
    });
    if (cur) out.push(cur);
    return out;
  }
  function para(p) {
    var ss = sentences((p.body || [])[0]).concat(sentences((p.body || [])[1])), s = "";
    for (var i = 0; i < ss.length; i++) {
      if (s && (s.length >= 250 || s.length + ss[i].length > 440)) break;
      s += (s ? " " : "") + ss[i];
    }
    return s || p.oneLiner || "";
  }
  function projects(x) {
    return (x.projects || []).map(function (p) {
      var refs = (p.refs || []).map(function (r) { return "<li>" + (r.url ? lnk(r.url, r.label) : esc(r.label)) + "</li>"; }).join("");
      return '<article class="th-p" id="' + esc(p.slug) + '" data-rv><header><p class="meta">' + esc(p.years) + (p.status === "ongoing" ? ", ongoing" : "") + "</p>" +
        '<h4 class="h3">' + esc(p.title) + "</h4></header>" +
        '<p class="th-pp">' + esc(para(p)) + "</p>" +
        (refs ? '<ul class="th-refs">' + refs + "</ul>" : "") +
        '<p class="th-more"><a class="ul" href="research.html#' + esc(p.slug) + '">View on the research page</a> ' + H.arrow + "</p></article>";
    }).join("");
  }
  $("th-fact").innerHTML = fact(KEY, t.summary);
  $("th-summary").innerHTML = '<p class="lede">' + esc(t.summary) + "</p>";
  $("th-res").innerHTML = resources(KEY);
  $("th-media").innerHTML = media(t);
  $("th-proj").innerHTML = projects(t);
  $("th-pcount").textContent = (t.projects || []).length + " projects";
  $("th-subs").innerHTML = subs.map(function (s) {
    var id = SUBID[s.key] || s.key, name = H.SUBTITLE[s.key] || s.title;
    return '<section class="theme th-body th-sub" id="' + id + '" data-th="' + esc(KEY) + '" aria-labelledby="h-' + id + '"><div class="wrap">' +
      '<p class="eyebrow" data-rv>' + esc(t.title) + "</p>" +
      '<h2 class="h1" id="h-' + id + '" data-rv>' + esc(name) + "</h2>" +
      '<p class="lede th-fact" data-rv>' + fact(s.key, s.summary) + "</p>" +
      '<div class="t-grid th-subgrid"><div class="t-text"><h3 class="meta th-h" style="margin-top:0">Summary</h3><p class="lede" data-rv>' + esc(s.summary) + "</p>" + resources(s.key) + "</div>" +
      '<div class="t-media">' + media(s) + "</div></div>" +
      '<div class="sec-top th-subp"><h3 class="h2" data-rv>' + esc(name) + ' projects</h3><p class="small">' + (s.projects || []).length + " projects</p></div>" +
      '<div class="th-plist">' + projects(s) + "</div></div></section>";
  }).join("");
  var tp = TOPICS[KEY] || [KEY];
  var pubs = (IIL.pubs || []).filter(function (p) { return (p.topics || []).some(function (x) { return tp.indexOf(x) >= 0; }); })
    .sort(function (a, b) { return b.year - a.year; });
  $("th-pubs").innerHTML = pubs.map(function (p) {
    var href = p.url || doiUrl(p);
    return '<li data-rv><p class="th-pt">' + lnk(href, p.title) + "</p>" +
      '<p class="th-pa">' + esc(p.authors).replace(/Lee, S\.A\.\*?/g, function (m) { return "<strong>" + m + "</strong>"; }) + "</p>" +
      '<p class="th-pv"><em>' + esc(p.venue) + "</em>" + (p.details ? ", " + esc(p.details) : "") + " (" + p.year + ")" +
      (p.doi ? ' <a class="pub-id" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + "</a>" : "") +
      (p.era === "pre" ? ' <span class="tag plain">Before IIL</span>' : "") + "</p></li>";
  }).join("");
  $("th-pubcount").textContent = pubs.length + " publications";
  var fund = (IIL.funding || []).filter(function (f) { return f.th === KEY; });
  var gov = fund.filter(function (f) { return !f.industry; }), ind = fund.filter(function (f) { return f.industry; });
  if (fund.length) $("th-fund").innerHTML = '<div class="sec-top th-fund-top"><h2 class="h2" data-rv>Funding</h2><p class="small" data-rv>' + gov.length + " grants</p></div>" +
    '<ol class="th-publist th-fundlist">' + gov.map(function (f) {
      return '<li data-rv><p class="th-pt">' + esc(f.title) + "</p>" +
        '<p class="th-pa">' + esc(f.funder) + (f.program ? ", " + esc(f.program) : "") + "</p>" +
        '<p class="th-pv">' + esc(f.years) + " &middot; " + esc(f.role) + "</p></li>";
    }).join("") +
    ind.map(function (f) {
      return '<li data-rv><p class="th-pt">Industry-sponsored research</p><p class="th-pa">' +
        f.list.map(function (x) { return esc(x[0]) + " (" + esc(x[1]) + ")"; }).join(", ") + "</p></li>";
    }).join("") + "</ol>";
  H.reveal(); H.loupe(); H.videos();
  var h0 = decodeURIComponent(location.hash.slice(1));
  if (h0) { var el = document.getElementById(h0); if (el) requestAnimationFrame(function () { el.scrollIntoView(); }); }
})();
