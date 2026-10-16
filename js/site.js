(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var still = /[?&]still\b/.test(location.search);
  if (still) { root.classList.add("still"); reduce = true; }
  var prerender = /[?&]prerender\b/.test(location.search);
  if (prerender) reduce = true;
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var BASE = "";
  var H = (window.H1 = {});
  H.base = BASE; H.reduce = reduce; H.still = still; H.fine = fine; H.prerender = prerender;
  H.esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  H.face = function (src, small) { return String(src || "").replace("assets/people/", small ? "assets/people/norm/sm/" : "assets/people/norm/"); };
  H.dims = function (src) { return (window.IIL_DIMS && window.IIL_DIMS[src]) || null; };
  H.url = function (src) { return /^img\//.test(src) ? src : BASE + src; };
  H.img = function (src, alt, o) {
    o = o || {};
    var d = o.wh || H.dims(src) || [1600, 1000];
    var a = '<img src="' + H.esc(H.url(src)) + '" alt="' + H.esc(alt || "") + '" width="' + d[0] + '" height="' + d[1] + '"';
    var ss = o.srcset || (o.sizes && /^assets\/research2?\/(?!sm\/)/.test(src) ? H.srcset(src, d[0]) : "");
    if (ss) a += ' srcset="' + ss + '"';
    if (o.sizes) a += ' sizes="' + o.sizes + '"';
    if (o.style) a += ' style="' + o.style + '"';
    if (o.cls) a += ' class="' + o.cls + '"';
    a += o.eager ? ' fetchpriority="high"' : (still ? "" : ' loading="lazy"');
    return a + ' decoding="async">';
  };
  H.sm = function (src, w) {
    if (/^assets\/research2\//.test(src)) return src.replace("assets/research2/", "img/sm/research2/" + w + "/").replace(/\.png$/, ".jpg");
    return src.replace("assets/research/", "assets/research/sm/" + w + "/").replace(/\.png$/, ".jpg");
  };
  H.srcset = function (src, full) {
    var out = [];
    [400, 800].forEach(function (w) { var s = H.sm(src, w), d = H.dims(s); if (d && d[0] < full) out.push(H.url(s) + " " + d[0] + "w"); });
    out.push(BASE + src + " " + full + "w");
    return out.join(", ");
  };
  H.thumb = function (src, w) {
    var s = H.sm(src, w <= 400 ? 400 : 800);
    return H.dims(s) ? s : src;
  };
  var MR = ((window.IIL && IIL.mediaResearch) || []).slice();
  var KORD = { hero: 1, hardware: 2, result: 3, figure: 4, diagram: 5, animation: 6 };
  H.mrCap = function (m) {
    var c = String(m.caption || "");
    if (m.status !== "presented") return c;
    return c.replace(/\s*\([^)]*\d[^)]*\)/g, "").replace(/\s*Scale bar[^.]*\./gi, "")
      .replace(/\s+at \d+(?:\.\d+)?\s*(?:nm|fps|µm|mm)\b/g, "").replace(/\bwith groups \d+ to \d+ resolved\b/, "resolved").replace(/\s{2,}/g, " ").trim();
  };
  H.mrCredit = function (m) {
    var c = String(m.credit || "");
    if (m.status !== "presented") return c;
    return c.replace(/\s*\([^)]*\)/g, "").trim() + " (conference presentation)";
  };
  H.mrFig = function (m) {
    return m ? { src: m.src, alt: H.mrCap(m), caption: H.mrCap(m), credit: H.mrCredit(m), kind: m.kind, status: m.status, theme: m.theme, project: m.project, w: m.width, h: m.height, video: m.video, labels: m.labels } : null;
  };
  H.page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
  MR = MR.filter(function (m) { return !m.hidden; });
  H.mr = function (q) {
    q = q || {};
    var out = MR.filter(function (m) {
      if (!q.any && (m.place || "research") !== H.page) return false;
      return (!q.theme || m.theme === q.theme) && (!q.project || m.project === q.project) && (!q.kind || (q.kind.indexOf ? q.kind.indexOf(m.kind) >= 0 : m.kind === q.kind));
    });
    if (q.sort) out.sort(function (a, b) {
      return ((a.status === "published" ? 0 : 1) - (b.status === "published" ? 0 : 1)) || ((KORD[a.kind] || 9) - (KORD[b.kind] || 9));
    });
    return out.map(H.mrFig);
  };
  var USED = {};
  H.key = function (src) { return String(src || "").split("/").pop().replace(/\.(jpe?g|png|webp|gif|svg|mp4)$/i, ""); };
  H.claim = function (src) { var k = H.key(src); if (!k || USED[k]) return false; USED[k] = 1; return true; };
  H.isUsed = function (src) { return !!USED[H.key(src)]; };
  var NEWS_SKIP = /lab_group_snu|lab_interior|assets\/people\/|assets\/news\/people\//;
  H.newsMedia = function () {
    if (H._nm) return H._nm;
    var IIL = window.IIL || {}, news = IIL.news || [], NM = {}, PF = {};
    function ok(n, e) { return n && n.date === e.date && (!e.match || n.html.slice(0, 60) === e.match); }
    (IIL.newsMedia || []).forEach(function (m) { if (ok(news[m.i], { date: m.date })) NM[m.i] = m; });
    (IIL.newsPaperFigs || []).forEach(function (f) { if (ok(news[f.i], f)) PF[f.i] = f; });
    var NL = {};
    (IIL.newsLogos || []).forEach(function (l) { if (ok(news[l.i], l)) NL[l.i] = l; });
    function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); }
    var G2 = (IIL.gallery2 || []).filter(function (g) { return g.eventName && g.confidence !== "low" && (g.quality == null || g.quality >= 3); });
    function eventPhoto(n, text, seen) {
      var best = null, t = norm(text);
      G2.forEach(function (g) {
        if (String(g.date || "").slice(0, 7) !== String(n.date).slice(0, 7)) return;
        if (t.indexOf(norm(g.eventName)) < 0 || seen[H.key(g.src)]) return;
        if (!best || (g.quality || 0) > (best.quality || 0)) best = g;
      });
      return best;
    }
    var seen = {};
    H._nm = news.map(function (n, idx) {
      var text = n.html.replace(/<[^>]+>/g, ""), m = NM[idx], f = PF[idx], media = null;
      if (m && m.kind === "photo" && !NEWS_SKIP.test(m.src) && !seen[H.key(m.src)])
        media = { src: m.src, kind: "photo", alt: m.alt, bg: m.bg };
      if (!media && f && n.tags.indexOf("paper") >= 0 && !seen[H.key(f.src)])
        media = { src: f.src, kind: "figure", alt: f.caption, cap: f.credit, fit: f.fit };
      if (!media) {
        var ep = eventPhoto(n, text, seen);
        if (ep) media = { src: (ep.sm && H.dims(ep.sm)) ? ep.sm : ep.src, orig: ep.src, kind: "photo", alt: ep.caption || ep.eventName, cap: ep.eventName };
      }
      if (media) { seen[H.key(media.src)] = 1; if (media.orig) seen[H.key(media.orig)] = 1; }
      else if (NL[idx]) media = { src: NL[idx].src, kind: "logo", alt: NL[idx].entity + " logo", bg: NL[idx].bg };
      return media;
    });
    H._nmKeys = seen;
    return H._nm;
  };
  H.video = function (src, poster, label, o) {
    o = o || {};
    var d = H.dims(poster) || [1280, 720];
    return '<video class="vid' + (o.cls ? " " + o.cls : "") + '" muted loop playsinline preload="none" poster="' + H.esc(H.url(poster)) + '" width="' + d[0] + '" height="' + d[1] + '" aria-label="' + H.esc(label || "") + '" data-src="' + H.esc(H.url(src)) + '"></video>';
  };
  H.vidLabels = function (l) {
    return l && l.length === 2 ? '<span class="cmp-lab l vid-lab" aria-hidden="true">' + H.esc(l[0]) + '</span><span class="cmp-lab r vid-lab" aria-hidden="true">' + H.esc(l[1]) + "</span>" : "";
  };
  H.videos = function (scope) {
    if (prerender) return;
    var vs = (scope || document).querySelectorAll("video.vid[data-src]:not([data-on])");
    vs.forEach(function (v) {
      v.setAttribute("data-on", "1");
      if (reduce || still || !("IntersectionObserver" in window)) return;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            if (!v.src) { v.src = v.getAttribute("data-src"); }
            var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
          } else if (!v.paused) v.pause();
        });
      }, { threshold: .25 });
      io.observe(v);
    });
  };
  H.mrGet = function (name) {
    for (var i = 0; i < MR.length; i++) if (MR[i].src === name || MR[i].src.split("/").pop() === name) return H.mrFig(MR[i]);
    return null;
  };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  H.date = function (d, short) {
    var m = String(d || "").match(/^(\d{4})(?:-(\d{2}))?/);
    if (!m) return H.esc(d);
    return m[2] ? (short ? MON : MONTHS)[+m[2] - 1] + " " + m[1] : m[1];
  };
  H.PARENT = { vs: "fp" };
  H.SUBTITLE = { vs: "Virtual staining" };
  H.mainKey = function (k) { return H.PARENT[k] || k; };
  function byOrder(a, b) { return a.order - b.order; }
  H.allThemes = function () { return ((window.IIL && IIL.research) || []).slice().sort(byOrder); };
  H.themes = function () { return H.allThemes().filter(function (t) { return !H.PARENT[t.key]; }); };
  H.subthemes = function (k) { return H.allThemes().filter(function (t) { return H.PARENT[t.key] === k; }); };
  H.themeData = function (k) { var a = H.allThemes(); for (var i = 0; i < a.length; i++) if (a[i].key === k) return a[i]; return null; };
  H.themeTitle = function (k) { var t = H.themeData(H.mainKey(k)); return t ? t.title : ""; };
  H.FIG_HOME = { fp: "fp-hardware-family-row.png", lensless: "turing-mask-zoom-poster.jpg",
    speckle: "rssi-in-vivo-time-lapse-poster.jpg", hbi: "microaquarium-hand-gesture-poster.jpg" };
  H.FIG_THEME = { fp: ["fp-forward-model-schematic.png", "fp-high-res-he-glands.jpg"], vs: ["phase-to-he-and-ihc-split.jpg"],
    lensless: ["lensless-raw-to-reconstruction-blocks-poster.jpg", "assets/research/lensless/uv-imprint-integrated-camera-prototype.jpg", "phase-mask-height-map-3d.jpg"] };
  H.FIG_OTHER = ["lensless-camera-schematic.png", "ifin-mask-height-and-psfs.jpg", "live-cells-fp-phase-full-fov.jpg", "uv-imprint-process-and-device-structure.png", "uv-imprint-3d-refocusing.jpg"];
  H.claimElsewhere = function () {
    var all = [];
    Object.keys(H.FIG_HOME).forEach(function (k) { all.push(H.FIG_HOME[k]); });
    Object.keys(H.FIG_THEME).forEach(function (k) { all = all.concat(H.FIG_THEME[k]); });
    all.concat(H.FIG_OTHER).forEach(function (n) { H.claim(n); });
  };
  H.themePage = { fp: "computational-microscopy.html", vs: "computational-microscopy.html#virtual-staining", lensless: "lensless-cameras.html", speckle: "speckle-imaging.html", hbi: "interactive-biology.html" };
  H.pad = function (n) { return (n < 10 ? "0" : "") + n; };
  H.arrow = '<span class="arr" aria-hidden="true">&#8594;</span>';
  H.ext = '<span class="arr" aria-hidden="true">&#8599;</span>';
  H.findFig = function (src) {
    if (/^assets\/research2\//.test(src)) return H.mrGet(src);
    var th = (window.IIL && IIL.research) || [];
    for (var i = 0; i < th.length; i++) {
      if (th[i].keyFigure && th[i].keyFigure.src === src) return th[i].keyFigure;
      var ps = th[i].projects || [];
      for (var j = 0; j < ps.length; j++) {
        var fs = ps[j].figures || [];
        for (var k = 0; k < fs.length; k++) if (fs[k].src === src) return fs[k];
      }
    }
    return null;
  };
  var io = null;
  if (!reduce && "IntersectionObserver" in window) {
    try {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
      root.classList.add("rv-on");
    } catch (err) { io = null; root.classList.remove("rv-on"); }
  }
  H.reveal = function (scope) {
    if (prerender) return;
    scope = scope || document;
    scope.querySelectorAll("[data-stagger]").forEach(function (g) {
      var i = 0;
      Array.prototype.forEach.call(g.children, function (c) {
        if (c.hasAttribute("data-rv") && !c.style.getPropertyValue("--i")) { c.style.setProperty("--i", String(i % 6)); i++; }
      });
    });
    var els = scope.querySelectorAll("[data-rv]:not(.rv-in), [data-clip]:not(.rv-in)");
    if (!io) { els.forEach(function (el) { el.classList.add("rv-in"); }); return; }
    els.forEach(function (el) { io.observe(el); });
  };
  function safety() {
    if (prerender) return;
    var h = window.innerHeight;
    document.querySelectorAll("[data-rv]:not(.rv-in), [data-clip]:not(.rv-in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) el.classList.add("rv-in");
    });
  }
  setTimeout(safety, 1400);
  window.addEventListener("load", function () { setTimeout(safety, 800); });
  setTimeout(function () {
    if (!document.querySelector(".rv-in") && root.classList.contains("rv-on")) root.classList.remove("rv-on");
  }, 4000);
  var header = document.querySelector(".site-header");
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 8);
      if (y > 640 && y > lastY + 4 && !root.classList.contains("lock")) header.classList.add("away");
      else if (y < lastY - 4 || y <= 640) header.classList.remove("away");
    }
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (header) header.addEventListener("focusin", function () { header.classList.remove("away"); });
  H.trap = function (dlg) {
    dlg.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(
        dlg.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null || el === document.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  };
  var menu = document.getElementById("menu"), menuBtn = document.querySelector(".menu-btn");
  if (menu && menuBtn && typeof menu.showModal === "function") {
    menu.querySelectorAll("nav li").forEach(function (li, i) { li.style.setProperty("--i", i); });
    menuBtn.addEventListener("click", function () { menu.showModal(); root.classList.add("lock"); menuBtn.setAttribute("aria-expanded", "true"); });
    menu.addEventListener("close", function () { root.classList.remove("lock"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); });
    menu.querySelector(".close").addEventListener("click", function () { menu.close(); });
    H.trap(menu);
  } else if (menuBtn) menuBtn.hidden = true;
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".copy");
    if (!b) return;
    copyText(b.getAttribute("data-copy")).then(function () {
      b.classList.add("done"); b.textContent = "Copied";
      var live = document.getElementById("live"); if (live) live.textContent = "Email address copied";
      setTimeout(function () { b.classList.remove("done"); b.textContent = "Copy"; }, 1800);
    }, function () { b.textContent = "Select and copy"; });
  });
  H.parallax = function () {
    if (reduce) return;
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]:not([data-px])"));
    if (!els.length) return;
    var vis = new Set(), raf = 0;
    els.forEach(function (el) { el.setAttribute("data-px", ""); });
    if ("IntersectionObserver" in window) {
      var po = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) vis.add(e.target); else vis.delete(e.target); }); tick(); }, { rootMargin: "160px 0px" });
      els.forEach(function (el) { po.observe(el); });
    } else els.forEach(function (el) { vis.add(el); });
    function run() {
      raf = 0;
      var h = window.innerHeight;
      vis.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect();
        var k = +el.getAttribute("data-parallax") || 0.08;
        var d = (r.top + r.height / 2 - h / 2);
        el.style.transform = "translate3d(0," + (-d * k).toFixed(1) + "px,0)";
      });
    }
    function tick() { if (!raf) raf = requestAnimationFrame(run); }
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  };
  H.loupe = function (scope) {
    if (!fine || still || prerender) return;
    (scope || document).querySelectorAll("[data-loupe]:not([data-lp])").forEach(function (host) {
      host.setAttribute("data-lp", "");
      var img = host.querySelector("img"); if (!img) return;
      var zoom = +(host.getAttribute("data-loupe") || 2.4);
      var lens = document.createElement("span"); lens.className = "loupe"; lens.setAttribute("aria-hidden", "true");
      host.appendChild(lens); host.classList.add("loupe-host");
      var raf = 0, px = 0, py = 0, box = null, ir = null, fit = "cover";
      function geom() {
        box = host.getBoundingClientRect();
        var nw = img.naturalWidth || +img.getAttribute("width"), nh = img.naturalHeight || +img.getAttribute("height");
        fit = getComputedStyle(img).objectFit;
        var r = img.getBoundingClientRect(), s;
        if (fit === "contain") s = Math.min(r.width / nw, r.height / nh); else s = Math.max(r.width / nw, r.height / nh);
        var dw = nw * s, dh = nh * s;
        var pos = (getComputedStyle(img).objectPosition || "50% 50%").split(" ");
        var fx = parseFloat(pos[0]) / 100, fy = parseFloat(pos[1] || "50%") / 100;
        if (isNaN(fx)) fx = .5; if (isNaN(fy)) fy = .5;
        ir = { x: r.left - box.left + (r.width - dw) * fx, y: r.top - box.top + (r.height - dh) * fy, w: dw, h: dh };
        lens.style.backgroundImage = 'url("' + img.src + '")';
        lens.style.backgroundSize = (dw * zoom) + "px " + (dh * zoom) + "px";
      }
      function draw() {
        raf = 0;
        var x = px - box.left, y = py - box.top, ls = lens.offsetWidth / 2;
        lens.style.transform = "";
        lens.style.left = x + "px"; lens.style.top = y + "px";
        lens.style.backgroundPosition = (-(x - ir.x) * zoom + ls) + "px " + (-(y - ir.y) * zoom + ls) + "px";
      }
      host.addEventListener("pointerenter", function (e) { if (e.pointerType !== "mouse") return; geom(); px = e.clientX; py = e.clientY; draw(); lens.classList.add("on"); host.classList.add("looking"); });
      host.addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; if (!box) geom(); px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(draw); });
      host.addEventListener("pointerleave", function () { lens.classList.remove("on"); host.classList.remove("looking"); box = null; });
      window.addEventListener("scroll", function () { box = null; }, { passive: true });
    });
  };
  var lb = null, lbItems = [], lbI = 0, lbTrigger = null;
  function lbBuild() {
    lb = document.createElement("dialog"); lb.className = "lb"; lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML = '<div class="lb-top"><span class="lb-n" aria-live="polite"></span><button class="icon-btn lb-close" type="button" aria-label="Close photo viewer"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button></div>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<button class="icon-btn lb-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>' +
      '<button class="icon-btn lb-next" type="button" aria-label="Next photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>' +
      '<div class="lb-cap"><span class="lb-t"></span><span class="lb-d"></span></div>';
    document.body.appendChild(lb);
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { lbShow(lbI - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { lbShow(lbI + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); lbShow(lbI - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); lbShow(lbI + 1); }
    });
    lb.addEventListener("close", function () { root.classList.remove("lock"); if (lbTrigger) lbTrigger.focus({ preventScroll: true }); });
    var st = lb.querySelector(".lb-stage"), x0 = null, y0 = 0;
    st.addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; });
    st.addEventListener("pointerup", function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lbShow(lbI + (dx < 0 ? 1 : -1));
    });
    st.addEventListener("click", function (e) { if (e.target === st) lb.close(); });
    H.trap(lb);
  }
  function lbShow(i) {
    var n = lbItems.length; lbI = (i + n) % n;
    var it = lbItems[lbI], im = lb.querySelector(".lb-stage img");
    function set() {
      var d = H.dims(it.src) || [1600, 1200];
      im.width = d[0]; im.height = d[1];
      im.src = H.url(it.src); im.alt = it.alt || it.caption || "";
      lb.querySelector(".lb-t").textContent = it.caption || "";
      lb.querySelector(".lb-d").textContent = it.credit || [it.date ? H.date(it.date) : "", it.place || ""].filter(Boolean).join(", ");
      lb.querySelector(".lb-n").textContent = (lbI + 1) + " / " + n;
      im.classList.remove("out");
    }
    if (reduce || !lb.open) set();
    else { im.classList.add("out"); setTimeout(set, 180); }
    [lbI + 1, lbI - 1].forEach(function (k) { var p = lbItems[(k + n) % n]; if (p) { var pi = new Image(); pi.src = H.url(p.src); } });
  }
  H.lightbox = function (items, i, trigger) {
    if (!lb) lbBuild();
    lbItems = items; lbTrigger = trigger || null;
    lbShow(i || 0);
    if (!lb.open) { lb.showModal(); root.classList.add("lock"); }
    lb.querySelector(".lb-close").focus({ preventScroll: true });
  };
  document.addEventListener("DOMContentLoaded", function () {
    if (still) document.querySelectorAll("img[loading=lazy]").forEach(function (i) { i.loading = "eager"; });
    H.reveal(); H.parallax(); H.loupe(); H.videos();
  });
})();
