/* PI profile page (pi.html): Prof. Seung Ah Lee.
   Sources: data/team.js IIL.pi (bio, interests, education, career, contact, links), data/pubs.js, data/teaching.js,
   and the latest CV (Google Doc CV_SeungAhLee, text dump _cv/sources/gdoc_CV_SeungAhLee_2026-09-17.txt) for the full
   service list and recognitions. Where data/team.js and the CV differ, the CV wording and years are used. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var pi = IIL.pi || {}, c = pi.contact || {}, ln = pi.links || {};
  function $(id) { return document.getElementById(id); }

  /* ---------- header buttons ---------- */
  $("pi-btns").innerHTML =
    (ln.cv ? '<a class="btn solid" href="' + esc(ln.cv) + '" target="_blank" rel="noopener">Curriculum vitae ' + H.ext + "</a>" : "") +
    (ln.scholar ? '<a class="btn" href="' + esc(ln.scholar) + '" target="_blank" rel="noopener">Google Scholar ' + H.ext + "</a>" : "") +
    '<a class="btn" href="#contact-pi">Contact</a>';

  /* ---------- biography ---------- */
  /* first paragraph: the standard PI intro (data/identity.js), the same text as on the home page and in the meta data;
     then the career sentence and the research paragraph of data/team.js */
  var ID = IIL.identity || {};
  var bio = ID.piIntro ? [ID.piIntro, ID.piCareer].concat((pi.bio || []).slice(1)) : (pi.bio || []).slice();
  /* third paragraph: professional service, from the CV (Academic and Professional Services; Teaching) and data/teaching.js */
  bio.push("Her professional service includes General Chair of the Computational Optical Sensing and Imaging (COSI) conference at the Optica Imaging Congress (2024, 2025), Conference Co-chair at SPIE Photonics West (2024–2026) and Director of International Affairs of the Optical Society of Korea.");
  $("bio-c").innerHTML = bio.map(function (p, i) { return '<p data-rv style="--i:' + i + '">' + esc(p) + "</p>"; }).join("");

  /* ---------- research interests ---------- */
  $("int-c").innerHTML = '<ul class="ints" data-stagger>' + (pi.interests || []).map(function (s, i) {
    return '<li data-rv data-k="' + (i % 4) + '"><span class="ints-i" aria-hidden="true">' + H.pad(i + 1) + "</span><span>" + esc(s) + "</span></li>";
  }).join("") + "</ul>" +
    '<p class="ps-more" data-rv><a class="ul" href="research.html">Current research in the laboratory</a> ' + H.arrow + "</p>";

  /* ---------- timeline helper ---------- */
  function tl(items) {
    return '<ol class="tl" data-stagger>' + items.map(function (it) {
      return '<li data-rv><span class="tl-y">' + esc(it.y) + '</span><div class="tl-b"><p class="tl-t">' + esc(it.t) + "</p>" +
        (it.o ? '<p class="tl-o">' + esc(it.o) + "</p>" : "") + (it.n ? '<p class="tl-n">' + esc(it.n) + "</p>" : "") + "</div></li>";
    }).join("") + "</ol>";
  }

  /* ---------- education ---------- */
  $("edu-c").innerHTML = tl((pi.education || []).map(function (e) {
    return { y: e.year, t: e.degree, o: e.school, n: e.note };
  }));

  /* ---------- appointments (data/team.js career; Stanford advisor from the CV) ---------- */
  var NOTES = { "Department of Bioengineering, Stanford University": "Advisor: Prof. Ingmar H. Riedel-Kruse" };
  $("app-c").innerHTML = tl((pi.career || []).map(function (e) {
    return { y: e.years, t: e.position, o: e.org, n: NOTES[e.org] };
  }));

  /* ---------- professional service (CV, Academic and Professional Services) ---------- */
  var SERVICE = [
    { h: "Editorial", items: [
      ["Associate Editor", "Optics Express (Optica Publishing Group)", "2024–"],
      ["Associate Editor", "Advanced Imaging", "2024–"],
      ["Lead Guest Editor", "Optics Express and Applied Optics, feature issue on Computational Optical Sensing and Imaging", "2024"],
      ["Guest Editor", "Optics Express and Applied Optics, feature issue on Computational Optical Sensing and Imaging", "2023, 2025"],
      ["Guest Editor", "JOSA A, feature issue on quantitative phase imaging", "2024"]
    ] },
    { h: "Conference organization", items: [
      ["General Chair", "Computational Optical Sensing and Imaging (COSI), Optica Imaging Congress", "2024, 2025"],
      ["Conference Co-chair", "Computational Optical Imaging and Artificial Intelligence in Biomedical Sciences, SPIE Photonics West", "2024–2026"],
      ["Technical Program Chair", "SPIE–OSK Advanced Biophotonics Conference", "2025"],
      ["Subcommittee Chair", "Optical Sensing, Imaging and Display, CLEO Pacific Rim", "2024"],
      ["Program Chair", "Computational Optical Sensing and Imaging (COSI), Optica Imaging Congress", "2023"]
    ] },
    { h: "Societies and advisory roles", items: [
      ["Director of International Affairs", "Optical Society of Korea", "2024–"],
      ["Director of General Affairs", "Optical Society of Korea", "2023"],
      ["Public Relations and Information Committee", "Korean Biochip Society", "2023, 2024"],
      ["Scientific Advisory Board", "Noul Co., Ltd.", "2023–2024"]
    ] }
  ];
  var TPC = ["CLEO 2024", "IEEE International Conference on Computational Photography 2023", "IEEE/IEIE ICEIC 2023, 2024", "OSK Advanced Biophotonics Conference 2022–2024", "IEEE/IEIE ICCE-Asia 2020, 2021"];
  var REVIEW = ["Nature", "Light: Science & Applications", "Advanced Photonics", "Laser & Photonics Reviews", "Optica", "Optics Express", "Biomedical Optics Express", "Optics Letters", "Applied Optics", "Nanophotonics", "Journal of Biomedical Optics", "Lab on a Chip", "Biosensors and Bioelectronics", "ACM CHI", "IEEE ICCP"];
  $("svc-c").innerHTML = SERVICE.map(function (g) {
    return '<div class="sv-g"><h3 class="meta" data-rv>' + esc(g.h) + '</h3><ul class="sv" data-stagger>' + g.items.map(function (it) {
      return '<li data-rv><p class="sv-r">' + esc(it[0]) + '</p><p class="sv-v">' + esc(it[1]) + '</p><p class="sv-y">' + esc(it[2]) + "</p></li>";
    }).join("") + "</ul></div>";
  }).join("") +
    '<div class="sv-g"><h3 class="meta" data-rv>Technical program committees</h3><p class="sv-txt" data-rv>' + TPC.map(esc).join("; ") + "</p></div>" +
    '<div class="sv-g"><h3 class="meta" data-rv>Reviewer</h3><p class="sv-txt" data-rv>' + REVIEW.map(esc).join(", ") + "</p></div>";

  /* ---------- honors (CV, Recognitions; Frontiers award from the CV publication list) ---------- */
  var HONORS = [
    ["2026", "Vice Prime Minister's Commendation for Contributions to Science and Technology"],
    ["2025", "Young Engineer's Award, Korean Society of Precision Engineering"],
    ["2023", "Teaching Excellence Award, Yonsei University"],
    ["2023", "LG Electronics Target Lab"],
    ["2022", "Outstanding Article Award, Frontiers in Computer Science, for “Micro-HBI: Human-Biology Interaction With Living Cells, Viruses, and Molecules”"],
    ["2018", "Microsoft Research Asia Collaborative Research Award"],
    ["2010", "First Place, Idea to Product Global Competition (with Guoan Zheng and Samuel Yang)"],
    ["2009", "Distinguished Dissertation Award (M.S.), Department of Electrical Engineering, Seoul National University"]
  ];
  $("hon-c").innerHTML = '<ol class="hon" data-stagger>' + HONORS.map(function (h) {
    return '<li data-rv><span class="hon-y">' + esc(h[0]) + '</span><span class="hon-t">' + esc(h[1]) + "</span></li>";
  }).join("") + "</ol>";

  /* ---------- contact ---------- */
  $("con-c").innerHTML = '<dl class="ct" data-rv>' +
    '<div><dt>Email</dt><dd><a class="ul" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a><button class="copy" type="button" data-copy="' + esc(c.email) + '" aria-label="Copy email address">Copy</button></dd></div>' +
    (c.phone ? "<div><dt>Phone</dt><dd>" + esc(c.phone) + "</dd></div>" : "") +
    (c.office ? "<div><dt>Office</dt><dd>" + esc(c.office) + "</dd></div>" : "") +
    (c.lab ? "<div><dt>Laboratory</dt><dd>" + esc(c.lab) + "</dd></div>" : "") +
    (c.address ? "<div><dt>Address</dt><dd>" + esc(c.address) + "</dd></div>" : "") +
    "</dl>" +
    '<p class="ps-more ct-btns" data-rv>' +
    (ln.cv ? '<a class="btn solid" href="' + esc(ln.cv) + '" target="_blank" rel="noopener">Curriculum vitae ' + H.ext + "</a>" : "") +
    (ln.scholar ? '<a class="btn" href="' + esc(ln.scholar) + '" target="_blank" rel="noopener">Google Scholar ' + H.ext + "</a>" : "") + "</p>";

  /* ---------- on-this-page navigation: mark the section in view ---------- */
  var toc = $("toc"), links = Array.prototype.slice.call(toc.querySelectorAll("a"));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  function mark() {
    var y = window.innerHeight * 0.32, cur = secs[0];
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= y) cur = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1];
    links.forEach(function (a) { if (a.getAttribute("href") === "#" + cur.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }
  var tk = false;
  window.addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; mark(); }); } }, { passive: true });
  mark();

  H.reveal();
})();
