/* Research: four parallel themes (no sequence numbers, no arrows or connectors between them; PI 2026-10-15),
   one compact section per theme (short summary, project list, lead figure and two key images), compare slider
   as the Virtual Staining lead, project sheet dialog (deep link research.html#<project-slug>) with one short paragraph,
   up to two figures and references. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;

  var PLAIN = {
    fp: "Fourier ptychography illuminates a sample from many angles and combines the low-resolution images into one wide-field, high-resolution image that also contains quantitative phase. We build smartphone, single-shot and polarization-resolved versions of the method, and use them for virtual staining of tissue slides.",
    vs: "We image unstained tissue slides with Fourier ptychographic microscopes and train neural networks to turn the measured phase into the appearance of chemically stained slides. Work with pathologists at Severance Hospital covers faded-slide restoration, faster scanning and stains other than H&E.",
    lensless: "A lensless camera replaces the lens with a thin phase mask above the image sensor and recovers the image computationally. We design and fabricate the masks and develop reconstruction networks for polarization, hyperspectral, eye-tracking and privacy-preserving imaging.",
    speckle: "Rolling-shutter speckle imaging measures blood flow from a single camera frame by using the row-by-row readout of a standard CMOS sensor. Applications include cerebral blood-flow mapping, pulse waveforms at the fingertip and real-time analysis with neural networks.",
    hbi: "Microscopes and projectors coupled so that people can interact in real time with living, light-responsive microorganisms, used in museum exhibits, installations, games and artworks. This is a past area of work."
  };
  /* lead figure per theme (Virtual Staining uses the compare slider instead) and two key images.
     PI 2026-10-15: the leads of the instrument themes show the lab's own hardware (smartphone FP microscope rendering, compact
     lensless camera modules); the Tilia smartphone-FP result moved to the 2021 ACS Photonics news card. */
  var LEAD = {
    fp: { f: "smartphone-fp-render.png", ratio: "1010 / 770" },
    lensless: { f: "lensless-modules-next-to-paper-clip.jpg", ratio: "4 / 3", loupe: 2.2 },
    speckle: { f: "rssi-raw-to-flow-map-wipe-poster.jpg", video: "assets/research2/video/rssi-raw-to-flow-map.mp4", ratio: "16 / 9" },
    hbi: { f: "remember-installation.jpg", ratio: "4 / 3", photo: true }
  };
  Object.keys(LEAD).forEach(function (k) { LEAD[k].fig = H.mrGet(LEAD[k].f); });
  var KEYS = {
    fp: ["live-cells-brightfield-vs-phase.jpg", "tissue-phase-3d-surface.jpg"],
    vs: ["virtual-he-whole-slide.jpg", "virtual-ihc-vs-chemical-ihc.jpg"],
    lensless: ["phase-mask-and-camera-prototype-strip.jpg"],
    speckle: ["rssi-physics-network-comparison.jpg", "speckle-eye-movement-setup.png"],
    hbi: []
  };
  /* index thumbnails: a different figure from the lead, so nothing repeats on the page */
  /* hbi has no index thumbnail: its only Euglena photograph is the Home tile, and its lead is the ReMember installation */
  var IDX = { fp: "lily-root-birefringence-detail-b.jpg", lensless: "measured-psf-voronoi.jpg", speckle: "rssi-mouse-setup-speckle-whitelight.jpg" };
  H.claimElsewhere();
  /* four themes; sub-areas (Virtual Staining under Computational Microscopy, H.PARENT in site.js) render inside their theme */
  var themes = H.themes();
  var all = [];
  themes.forEach(function (t) {
    (t.projects || []).forEach(function (p) { all.push({ p: p, t: t }); });
    H.subthemes(t.key).forEach(function (s) { (s.projects || []).forEach(function (p) { all.push({ p: p, t: s }); }); });
  });
  function withSubs(t) { return [t].concat(H.subthemes(t.key)); }
  function sheetTitle(t) { return H.PARENT[t.key] ? H.themeTitle(t.key) + ": " + H.SUBTITLE[t.key] : t.title; }

  function span(t, own) {
    var ys = [], ps = [];
    (own ? [t] : withSubs(t)).forEach(function (x) { ps = ps.concat(x.projects || []); });
    ps.forEach(function (p) { (String(p.years).match(/\d{4}/g) || []).forEach(function (y) { ys.push(+y); }); });
    if (!ys.length) return "";
    var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    var open = ps.some(function (p) { return /[–-]\s*$/.test(p.years); });
    return open ? lo + "–" : (lo === hi ? String(lo) : lo + "–" + hi);
  }
  function cap(f) {
    return '<figcaption class="caption">' + esc(f.caption || "") + (f.credit ? ' <span class="credit">' + esc(f.credit) + "</span>" : "") + "</figcaption>";
  }
  var LOUPE_TIP = '<span class="loupe-tip" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6"/></svg>Magnify</span>';

  var PAIRS = [
    { k: "re", tab: "Faded slide re-staining", fa: "well-stained-reference-roi.jpg", fb: "virtual-restained-roi.jpg", la: "Well-stained reference", lb: "Virtual re-stain", ar: "1184 / 852" },
    { k: "ph", tab: "Phase to H&E", fa: "phase-roi-glands.jpg", fb: "virtual-he-roi-glands.jpg", la: "Quantitative phase", lb: "Virtual H&E", ar: "1600 / 1310" }
  ];
  PAIRS.forEach(function (p) {
    var A = H.mrGet(p.fa), B = H.mrGet(p.fb);
    p.a = A.src; p.b = B.src; p.aa = A.alt; p.ab = B.alt; p.cap = A.caption + " " + B.caption; p.credit = B.credit;
    H.claim(p.a); H.claim(p.b);
  });
  /* figures shown as paper figures in the news on the Home page are not repeated in project sheets */
  var NEWSFIG = {};
  (IIL.newsPaperFigs || []).forEach(function (n) { NEWSFIG[H.key(n.src)] = 1; });
  /* provenance: only images produced by the lab. Collaborator (Duke) and pre-lab (Caltech, Stanford) figures, and figures that show
     third-party dataset images, are not shown. */
  var NOT_LAB = /tensorial-tomographic-fp|starcam|fp-hardware-family|chipscale-|faded-slide-virtual-restaining-concept|unet-lensless-reconstruction-comparison|parallel-dcs|\/hbi\/microaquarium-installation/;
  function projFigs(p) {
    var m = H.mr({ project: p.slug, sort: true });
    return m.length ? m : (p.figures || []).filter(function (f) { return !NOT_LAB.test(f.src); });
  }

  document.getElementById("r-count").textContent = themes.length + " themes, " + all.length + " projects";
  document.getElementById("r-index").innerHTML = themes.map(function (t, i) {
    var f = H.mrGet(IDX[t.key] || "") || {}, src = f.src;
    if (src) H.claim(src);
    return '<li data-rv><a class="ix hover-host" data-th="' + esc(t.key) + '" href="#' + esc(t.key) + '"><span class="media zoom ix-img' + (src ? "" : " ix-none") + '">' + (src ? H.img(H.thumb(src, 400), "", {}) : "") + "</span>" +
      '<span class="ix-t"><span class="ix-dot" aria-hidden="true"></span><span class="ix-n">' + esc(t.title) + "</span></span></a></li>";
  }).join("");

  var KEYLIST = {};
  function keyFigs(t) {
    var list = (KEYS[t.key] || []).map(function (n) { return H.mrGet(n); }).filter(function (f) { return f && H.claim(f.src); });
    if (!list.length) return "";
    KEYLIST[t.key] = list;
    return '<ul class="t-keys">' + list.map(function (f, i) {
      var contain = /\.png$/.test(f.src), wide = f.w && f.h && f.w / f.h > 2.2;
      return '<li' + (wide ? ' class="k-wide"' : "") + '><button type="button" class="k-it hover-host" data-k="' + esc(t.key) + '" data-i="' + i + '" aria-label="View figure: ' + esc(f.caption) + '">' +
        '<span class="media zoom' + (contain ? " contain mat-white" : "") + '"' + (wide ? ' style="aspect-ratio:' + f.w + " / " + f.h + '"' : "") + ">" + H.img(wide ? f.src : H.thumb(f.src, 800), f.alt, { sizes: wide ? "(max-width: 900px) 100vw, 780px" : "(max-width: 900px) 50vw, 380px" }) + "</span></button>" +
        '<p class="k-cap">' + esc(f.caption) + ' <span class="credit">' + esc(f.credit) + "</span></p></li>";
    }).join("") + "</ul>";
  }
  function leadFig(t) {
    if (t.key === "vs") return cmpBlock();
    var L = LEAD[t.key] || { ratio: "3 / 2" }, f = L.fig || t.keyFigure;
    H.claim(f.src); if (L.video) H.claim(L.video);
    var lead = L.video ? H.video(L.video, f.src, f.alt) : H.img(f.src, f.alt, { sizes: "(max-width: 900px) 100vw, 800px" });
    return '<figure class="t-fig"><div class="media' + (L.video ? " has-vid" : "") + (/\.png$/.test(f.src) ? " contain mat-white" : "") + '" data-clip' + (L.loupe ? ' data-loupe="' + L.loupe + '"' : "") +
      ' style="aspect-ratio:' + L.ratio + '">' + lead + (L.loupe ? LOUPE_TIP : "") + "</div>" + cap(f) + "</figure>";
  }
  function projRows(t) {
    return (t.projects || []).map(function (p) {
      return '<li data-rv><button class="p-row hover-host" type="button" data-slug="' + esc(p.slug) + '" aria-haspopup="dialog">' +
        '<span class="p-t"><span class="ul-t">' + esc(p.title) + "</span>" + (p.oneLiner ? '<span class="p-one">' + esc(p.oneLiner) + "</span>" : "") + "</span>" +
        '<span class="p-y">' + esc(p.years) + (p.status === "ongoing" ? ", ongoing" : "") + "</span>" +
        '<span class="p-go" aria-hidden="true">&#8594;</span></button></li>';
    }).join("");
  }
  /* sub-area block inside a theme section (anchor = its data key, e.g. research.html#vs) */
  function subBlock(s) {
    var name = H.SUBTITLE[s.key] || s.title, page = H.themePage[s.key];
    return '<div class="t-subsec" id="' + esc(s.key) + '" aria-labelledby="h-' + esc(s.key) + '">' +
      '<header class="t-subh"><h3 class="h2" id="h-' + esc(s.key) + '" data-rv>' + esc(name) + '</h3><span class="meta t-y" data-rv>' + span(s, true) + "</span></header>" +
      '<div class="t-grid"><div class="t-text"><p class="lede" data-rv>' + esc(PLAIN[s.key] || s.summary) + "</p>" +
      '<h4 class="meta t-ph" data-rv>Projects <span class="n">' + (s.projects || []).length + '</span></h4><ul class="p-list" data-stagger>' + projRows(s) + "</ul>" +
      (page ? '<p class="t-page" data-rv><a class="btn" href="' + page + '">' + esc(name) + ": papers, code and projects " + H.arrow + "</a></p>" : "") + "</div>" +
      '<div class="t-media">' + leadFig(s) + keyFigs(s) + "</div></div></div>";
  }
  document.getElementById("themes").innerHTML = themes.map(function (t, i) {
    var media = leadFig(t) + keyFigs(t);
    var projects = projRows(t);
    return '<section class="theme' + (t.key === "hbi" ? " past" : "") + '" data-th="' + esc(t.key) + '" id="' + esc(t.key) + '" aria-labelledby="h-' + esc(t.key) + '"><div class="wrap">' +
      '<header class="t-head"><span class="t-n" aria-hidden="true" data-rv></span><h2 class="h1" id="h-' + esc(t.key) + '" data-rv>' + esc(t.title) + '</h2><span class="meta t-y" data-rv>' + span(t) + (t.key === "hbi" ? ", past work" : "") + "</span></header>" +
      '<div class="t-grid"><div class="t-text"><p class="lede" data-rv>' + esc(PLAIN[t.key] || t.summary) + "</p>" +
      '<h3 class="meta t-ph" data-rv>Projects <span class="n">' + (t.projects || []).length + '</span></h3><ul class="p-list" data-stagger>' + projects + "</ul>" +
      (H.themePage[t.key] ? '<p class="t-page" data-rv><a class="btn" href="' + H.themePage[t.key] + '">' + esc(t.title) + ": papers, code and projects " + H.arrow + "</a></p>" : "") + "</div>" +
      '<div class="t-media">' + media + "</div></div>" + H.subthemes(t.key).map(subBlock).join("") + "</div></section>";
  }).join("");

  /* key images open the lightbox */
  document.getElementById("themes").addEventListener("click", function (e) {
    var b = e.target.closest(".k-it"); if (!b) return;
    H.lightbox(KEYLIST[b.getAttribute("data-k")], +b.getAttribute("data-i"), b);
  });

  /* ---------------- compare slider (Virtual Staining lead) ---------------- */
  function cmpInner(p) {
    return H.img(p.a, p.aa, { cls: "cmp-a", sizes: "(max-width: 900px) 100vw, 800px" }) +
      '<div class="cmp-b">' + H.img(p.b, p.ab, { sizes: "(max-width: 900px) 100vw, 800px" }) + "</div>";
  }
  function cmpBlock() {
    var p = PAIRS[0];
    return '<figure class="t-fig cmp-fig"><div class="cmp" id="cmp" style="--x:50%;aspect-ratio:' + p.ar + '"><div class="cmp-imgs">' + cmpInner(p) + "</div>" +
      '<span class="cmp-line" aria-hidden="true"><span class="cmp-knob"><svg viewBox="0 0 20 12"><path d="M6 1L1 6l5 5M14 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></span>' +
      '<span class="cmp-lab l" aria-hidden="true">' + esc(p.la) + '</span><span class="cmp-lab r" aria-hidden="true">' + esc(p.lb) + "</span>" +
      '<input class="cmp-range" type="range" min="0" max="100" value="50" step="0.5" aria-label="Compare the two images">' +
      "</div>" +
      '<div class="chips cmp-tabs" role="group" aria-label="Comparison">' + PAIRS.map(function (q, i) {
        return '<button class="chip" type="button" data-pair="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(q.tab) + "</button>";
      }).join("") + "</div>" +
      '<figcaption class="caption" id="cmp-cap">' + esc(p.cap) + ' Drag the handle to compare. <span class="credit">' + esc(p.credit) + "</span></figcaption></figure>";
  }
  var cmp = document.getElementById("cmp");
  if (cmp) {
    var range = cmp.querySelector(".cmp-range"), drag = false, raf = 0, want = 50;
    var setX = function (v) { want = Math.max(0, Math.min(100, v)); if (!raf) raf = requestAnimationFrame(function () { raf = 0; cmp.style.setProperty("--x", want + "%"); range.value = want; }); };
    var fromEvent = function (e) { var r = cmp.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
    cmp.addEventListener("pointerdown", function (e) { drag = true; cmp.classList.add("drag"); cmp.setPointerCapture(e.pointerId); setX(fromEvent(e)); });
    cmp.addEventListener("pointermove", function (e) { if (drag) setX(fromEvent(e)); });
    cmp.addEventListener("pointerup", function () { drag = false; cmp.classList.remove("drag"); });
    cmp.addEventListener("pointercancel", function () { drag = false; cmp.classList.remove("drag"); });
    range.addEventListener("input", function () { setX(+range.value); });
    /* a short sweep on first view hints that the image can be compared */
    if (!H.reduce && "IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; cio.disconnect();
        var t0 = 0;
        (function sweep(t) {
          if (drag) return; if (!t0) t0 = t;
          var k = Math.min((t - t0) / 1800, 1), v = 50 + Math.sin(k * Math.PI * 2) * 18 * (1 - k);
          cmp.style.setProperty("--x", v + "%"); range.value = v;
          if (k < 1) requestAnimationFrame(sweep);
        })(performance.now());
      }, { threshold: .6 });
      cio.observe(cmp);
    }
    var tabs = document.querySelector(".cmp-tabs");
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pair]"); if (!b) return;
      var p = PAIRS[+b.getAttribute("data-pair")];
      tabs.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      cmp.querySelector(".cmp-imgs").innerHTML = cmpInner(p);
      cmp.style.aspectRatio = p.ar;
      cmp.querySelector(".cmp-lab.l").textContent = p.la; cmp.querySelector(".cmp-lab.r").textContent = p.lb;
      document.getElementById("cmp-cap").innerHTML = esc(p.cap) + ' Drag the handle to compare. <span class="credit">' + esc(p.credit) + "</span>";
      var live = document.getElementById("live"); if (live) live.textContent = "Showing " + p.tab;
    });
  }

  /* ---------------- project sheet ---------------- */
  /* one short paragraph: the first sentences of the project text, about 250 to 440 characters */
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
    var ss = sentences((p.body || [])[0]).concat(sentences((p.body || [])[1])), t = "";
    for (var i = 0; i < ss.length; i++) {
      if (t && (t.length >= 250 || t.length + ss[i].length > 440)) break;
      t += (t ? " " : "") + ss[i];
    }
    return t || p.oneLiner || "";
  }
  /* up to two figures that are not already shown on this page or in the news */
  function sheetFigs(p) {
    var c = projFigs(p).filter(function (f) { return f.kind !== "animation" && !H.isUsed(f.src); });
    var fresh = c.filter(function (f) { return !NEWSFIG[H.key(f.src)]; });
    return (fresh.length ? fresh : c).slice(0, 2);
  }
  var dlg = document.getElementById("proj"), art = document.getElementById("p-art"), lastTrigger = null, current = null;
  function figure(f, eager) {
    var png = /\.png$/.test(f.src);
    return '<figure class="pv-fig"><div class="media natural' + (png ? " mat-white" : "") + '"' + (png ? "" : ' data-loupe="2.2"') + ">" + H.img(f.src, f.alt, { eager: !!eager, sizes: "(max-width: 1040px) 100vw, 480px" }) + "</div>" + (f.caption ? cap(f) : "") + "</figure>";
  }
  function render(i) {
    var e = all[i], p = e.p, t = e.t, figs = sheetFigs(p);
    document.getElementById("p-theme").textContent = sheetTitle(t);
    var prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
    var refs = (p.refs || []).map(function (r) {
      return "<li>" + (r.url ? '<a class="ul" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + "</a>" : esc(r.label)) + "</li>";
    }).join("");
    art.innerHTML =
      '<header class="pv-head"><p class="meta">' + esc(p.years) + (p.status === "ongoing" ? ", ongoing" : "") + '</p><h2 class="h1 pv-title" id="p-title">' + esc(p.title) + "</h2></header>" +
      '<p class="pv-p">' + esc(para(p)) + "</p>" +
      (figs.length ? '<div class="pv-figs n' + figs.length + '">' + figs.map(function (f, k) { return figure(f, k === 0); }).join("") + "</div>" : "") +
      (refs ? '<div class="pv-meta"><h3 class="meta">References</h3><ul>' + refs + "</ul></div>" : "") +
      '<nav class="pv-nav" aria-label="Projects"><button type="button" data-go="' + esc(prev.p.slug) + '"><span class="meta">Previous</span><span class="ul-t">' + esc(prev.p.title) + "</span></button>" +
      '<button type="button" class="r" data-go="' + esc(next.p.slug) + '"><span class="meta">Next</span><span class="ul-t">' + esc(next.p.title) + "</span></button></nav>";
    H.loupe(art);
  }
  function indexOf(slug) { for (var i = 0; i < all.length; i++) if (all[i].p.slug === slug) return i; return -1; }
  function open(slug, push) {
    var i = indexOf(slug); if (i < 0) return false;
    render(i); current = slug;
    if (!dlg.open) { dlg.showModal(); document.documentElement.classList.add("lock"); }
    dlg.scrollTop = 0;
    art.classList.remove("swap"); void art.offsetWidth; art.classList.add("swap");
    if (push && location.hash !== "#" + slug) history.pushState({ p: slug }, "", "#" + slug);
    dlg.querySelector(".close").focus({ preventScroll: true });
    return true;
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("lock");
    if (current) { var s = current; current = null; history.replaceState(null, "", "#" + all[indexOf(s)].t.key); }
    var trg = lastTrigger || document.querySelector('[data-slug="' + location.hash.slice(1) + '"]');
    if (trg) trg.focus({ preventScroll: true });
  });
  dlg.querySelector(".close").addEventListener("click", close);
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) { close(); return; }
    var go = e.target.closest("[data-go]");
    if (go) open(go.getAttribute("data-go"), true);
  });
  H.trap(dlg);
  document.getElementById("themes").addEventListener("click", function (e) {
    var b = e.target.closest("[data-slug]"); if (!b) return;
    lastTrigger = b; open(b.getAttribute("data-slug"), true);
  });
  window.addEventListener("popstate", function () {
    var h = decodeURIComponent(location.hash.slice(1));
    if (indexOf(h) >= 0) open(h, false);
    else if (dlg.open) { current = null; dlg.close(); }
  });

  H.reveal(); H.loupe(); H.videos();
  var h0 = decodeURIComponent(location.hash.slice(1));
  if (h0) {
    if (indexOf(h0) >= 0) {
      lastTrigger = document.querySelector('[data-slug="' + h0 + '"]');
      var sec = document.getElementById(all[indexOf(h0)].t.key);
      if (sec) sec.scrollIntoView();
      open(h0, false);
    } else {
      var el = document.getElementById(h0);
      if (el) requestAnimationFrame(function () { el.scrollIntoView(); });
    }
  }
})();
