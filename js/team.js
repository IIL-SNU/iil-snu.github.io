/* Team page (from concept C, grouped by role only).
   Circular portraits in three role groups (faculty and researchers, graduate students, undergraduate interns).
   Hover or focus a portrait for a caption card beside it (below it on narrow screens), never over the face.
   Each card shows the person's email address (mailto link and Copy button); the page head gives the general contact.
   The PI's portrait links to pi.html. Below: alumni list, photo mosaic with lightbox, open positions band. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var pi = IIL.pi || {}, members = IIL.members || [];
  var reduce = H.reduce;
  var qs = new URLSearchParams(location.search);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- people ---------- */
  /* email address from links.email ("mailto:..."), shown as text with a Copy button in each caption card */
  function mail(l) { return String((l || {}).email || "").replace(/^mailto:/i, "").trim(); }
  var people = [{ id: "pi", isPI: true, name: pi.name, role: pi.role || "Group Leader", group: "pi", photo: pi.photo, interests: pi.interests || [], web: "", email: (pi.contact || {}).email || "" }]
    .concat(members.map(function (m) {
      return { id: m.slug, name: m.name, role: m.role, group: m.group, photo: m.photo, interests: m.interests || [], web: (m.links || {}).web || "", email: mail(m.links) };
    }));
  var byId = {};
  people.forEach(function (p) { byId[p.id] = p; });

  var GROUPS = [
    { k: "lead", name: "Faculty and researchers", test: function (p) { return p.isPI || p.group === "faculty" || p.group === "postdoc"; } },
    { k: "grad", name: "Graduate students", test: function (p) { return p.group === "grad"; } },
    { k: "intern", name: "Undergraduate interns", test: function (p) { return p.group === "intern"; } }
  ];

  var GLOBE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1.5 8h13M8 1.5c2 2.2 2 10.8 0 13M8 1.5c-2 2.2-2 10.8 0 13" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  var PERSON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.4" r="2.9" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M2.6 14.2c.6-2.9 2.8-4.5 5.4-4.5s4.8 1.6 5.4 4.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';

  function emailRow(p) {
    if (!p.email) return "";
    return '<p class="cd-em"><a class="ul" href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a><button class="copy" type="button" data-copy="' + esc(p.email) + '" aria-label="Copy email address of ' + esc(p.name) + '">Copy</button></p>';
  }
  function card(p) {
    if (p.isPI) {
      return '<p class="cd-n">' + esc(p.name) + (pi.nameKo ? ' <span lang="ko">' + esc(pi.nameKo) + "</span>" : "") + "</p>" +
        '<p class="cd-r">' + esc(pi.title) + ", " + esc(pi.dept) + "</p>" +
        (p.interests.length ? '<p class="cd-k">Research interests</p><p class="cd-i">' + p.interests.map(esc).join(", ") + "</p>" : "") +
        emailRow(p) +
        '<p class="cd-lk"><a class="lk" href="pi.html">' + PERSON + "<span>Profile</span></a></p>";
    }
    return '<p class="cd-n">' + esc(p.name) + "</p>" +
      '<p class="cd-r">' + esc(p.role) + "</p>" +
      (p.interests.length ? '<p class="cd-k">Research interests</p><p class="cd-i">' + p.interests.map(esc).join(", ") + "</p>" : "") +
      emailRow(p) +
      (p.web ? '<p class="cd-lk"><a class="lk" href="' + esc(p.web) + '" target="_blank" rel="noopener" aria-label="Homepage of ' + esc(p.name) + '">' + GLOBE + "<span>Homepage</span></a></p>" : "");
  }

  function node(p) {
    var li = document.createElement("li");
    li.className = "nd" + (p.isPI ? " pi" : "");
    li.setAttribute("data-id", p.id);
    var inner = '<span class="nd-ph">' + H.img(H.face(p.photo, true), p.isPI ? "Portrait of Professor " + p.name : p.name, { wh: [480, 600] }) + "</span>" +
      '<span class="nd-n">' + esc(p.name) + "</span>" +
      '<span class="nd-r">' + esc(p.role) + "</span>";
    li.innerHTML = (p.isPI
      ? '<a class="nd-b" href="pi.html" aria-describedby="cd-' + p.id + '">' + inner + "</a>"
      : '<button class="nd-b" type="button" aria-expanded="false" aria-controls="cd-' + p.id + '">' + inner + "</button>") +
      '<div class="cd" id="cd-' + p.id + '" role="group" aria-label="About ' + esc(p.name) + '">' + card(p) + "</div>";
    p.li = li; p.btn = li.querySelector(".nd-b");
    return li;
  }

  /* ---------- render groups ---------- */
  var ros = document.getElementById("roster");
  ros.innerHTML = ""; /* the deployed page holds a prerendered copy; render afresh so handlers attach to live nodes */
  GROUPS.forEach(function (g, gi) {
    var ps = people.filter(g.test);
    if (!ps.length) return;
    var sec = document.createElement("section");
    sec.className = "rg"; sec.setAttribute("data-g", g.k); sec.setAttribute("aria-labelledby", "g-" + g.k);
    sec.innerHTML = '<header class="rg-h" data-rv><h3 class="meta" id="g-' + g.k + '">' + esc(g.name) + '</h3><span class="n">' + ps.length + "</span></header>";
    var ul = document.createElement("ul"); ul.className = "rg-l"; ul.setAttribute("aria-labelledby", "g-" + g.k);
    ps.forEach(function (p, i) { var li = node(p); li.style.setProperty("--d", Math.min(i * 45, 540) + "ms"); ul.appendChild(li); });
    sec.appendChild(ul);
    ros.appendChild(sec);
    g.ul = ul;
  });

  /* ---------- caption cards ---------- */
  var active = null, pinned = null, leaveT = 0;
  function placeCard(p) {
    var li = p.li, cd = li.querySelector(".cd");
    li.classList.remove("cd-r", "cd-l", "cd-b");
    cd.style.removeProperty("--sx");
    var ph = li.querySelector(".nd-ph").getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var cw = cd.offsetWidth, m = 14;
    if (vw >= 700 && ph.right + m + cw <= vw - 12) li.classList.add("cd-r");
    else if (vw >= 700 && ph.left - m - cw >= 12) li.classList.add("cd-l");
    else {
      li.classList.add("cd-b");
      var lr = li.getBoundingClientRect(), mid = lr.left + lr.width / 2;
      var left = clamp(mid - cw / 2, 12, vw - 12 - cw);
      cd.style.setProperty("--sx", (left - (mid - cw / 2)).toFixed(1) + "px");
    }
  }
  function activate(p) {
    clearTimeout(leaveT);
    if (active === p) return;
    deactivate(true);
    active = p;
    placeCard(p);
    p.li.classList.add("on");
    if (!p.isPI) p.btn.setAttribute("aria-expanded", "true");
  }
  function deactivate(force) {
    if (!active) return;
    if (pinned && !force) return;
    active.li.classList.remove("on", "pin");
    if (!active.isPI) active.btn.setAttribute("aria-expanded", "false");
    active = null; pinned = null;
  }
  people.forEach(function (p) {
    var li = p.li;
    li.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse" && !pinned) activate(p); });
    li.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse" || pinned) return;
      leaveT = setTimeout(function () { if (active === p && !li.contains(document.activeElement)) deactivate(false); }, 140);
    });
    li.addEventListener("focusin", function () { if (pinned && pinned !== p) deactivate(true); activate(p); });
    li.addEventListener("focusout", function (e) {
      if (e.relatedTarget && li.contains(e.relatedTarget)) return;
      if (pinned === p) return;
      setTimeout(function () { if (active === p && !li.contains(document.activeElement) && !li.matches(":hover")) deactivate(false); }, 0);
    });
    if (!p.isPI) p.btn.addEventListener("click", function () {
      if (pinned === p) { deactivate(true); return; }
      if (pinned) deactivate(true);
      activate(p); pinned = p; li.classList.add("pin");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && active) { var b = active.btn; deactivate(true); b.focus({ preventScroll: true }); }
  });
  document.addEventListener("pointerdown", function (e) {
    if (pinned && !pinned.li.contains(e.target)) deactivate(true);
  });
  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (active) placeCard(active); }, 120); });

  /* ---------- entrance: each group's portraits fade and settle in turn ---------- */
  document.getElementById("t-count").textContent = people.length + " people";
  if (!reduce && "IntersectionObserver" in window) {
    var lists = GROUPS.map(function (g) { return g.ul; }).filter(Boolean);
    lists.forEach(function (ul) { ul.classList.add("pre"); });
    var eio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ul = e.target; ul.classList.add("in"); eio.unobserve(ul);
        setTimeout(function () { ul.classList.remove("pre", "in"); }, 1500);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    lists.forEach(function (ul) { eio.observe(ul); });
    setTimeout(function () { lists.forEach(function (ul) { ul.classList.remove("pre"); }); }, 4000);
  }
  var demo = qs.get("demo");
  if (demo && byId[demo]) setTimeout(function () { var p = byId[demo]; activate(p); pinned = p; p.li.classList.add("pin"); }, H.still ? 300 : 1200);

  /* ---------- alumni ---------- */
  function homepage(p) { var l = p.links || {}; return l.web || l.webOld || ""; }
  var al = IIL.alumni || [];
  document.getElementById("a-count").textContent = al.length + " alumni";
  document.getElementById("alumni").innerHTML = al.map(function (a) {
    var u = homepage(a);
    var nm = u ? '<a class="al-n" href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + esc(a.name) + ', homepage"><span class="ul-t">' + esc(a.name) + "</span> " + H.ext + "</a>"
      : '<span class="al-n">' + esc(a.name) + "</span>";
    var em = mail(a.links);
    return '<li data-rv>' + nm +
      '<span class="al-r">' + esc([a.role, a.degree].filter(Boolean).join(", ")) + "</span>" +
      '<span class="al-now">' + (a.now ? esc(a.now) : "") + "</span>" +
      (em ? '<a class="al-em" href="mailto:' + esc(em) + '">' + esc(em) + "</a>" : "") + "</li>";
  }).join("");

  /* ---------- gallery mosaic + lightbox ---------- */
  var seen = {}, gal = [];
  H.newsMedia(); var homeKeys = H._nmKeys || {};
  (IIL.gallery || []).concat((IIL.gallery2 || []).filter(function (g) { return g.quality == null || g.quality >= 3; })).forEach(function (g) {
    if (!g || !g.src || g.confidence === "low") return;
    if (homeKeys[H.key(g.src)] || (g.sm && homeKeys[H.key(g.sm)])) return;
    var key = g.src.split("/").pop(), k2 = String(g.date || "").slice(0, 7) + "|" + String(g.caption || "").toLowerCase();
    if (seen[key] || seen[k2]) return; seen[key] = seen[k2] = 1;
    gal.push(g);
  });
  gal.sort(function (a, b) { return String(b.date || "").slice(0, 7).localeCompare(String(a.date || "").slice(0, 7)) || ((b.quality || 3) - (a.quality || 3)); });
  /* the 2025 group photo (assets/lab/lab_group_snu) is shown on the Home page, so it is not repeated here */
  var FIRST = window.matchMedia("(max-width: 640px)").matches ? 10 : 22;
  document.getElementById("g-count").textContent = gal.length + " photos";
  var gEl = document.getElementById("mosaic");
  gEl.innerHTML = gal.map(function (g, i) {
    var s = (g.sm && H.dims(g.sm)) ? g.sm : /^assets\/gallery2\//.test(g.src) ? g.src : g.src.replace("assets/gallery/", "assets/gallery/sm/");
    return '<li class="mo' + (i >= FIRST ? " more" : "") + '" style="--i:' + (i % 11) + ';"><button type="button" class="mo-b" data-i="' + i + '" aria-label="View photo: ' + esc(g.caption) + '">' +
      '<span class="media zoom">' + H.img(s, g.alt || g.caption, { wh: H.dims(s) || [800, 600] }) + "</span>" +
      '<span class="mo-c"><span>' + esc(g.caption) + '</span><span class="mo-d">' + H.date(g.date, true) + "</span></span></button></li>";
  }).join("");
  gEl.classList.add("collapsed");
  var more = document.getElementById("g-more");
  if (gal.length <= FIRST) more.hidden = true;
  more.addEventListener("click", function () {
    var open = gEl.classList.toggle("collapsed") === false;
    more.setAttribute("aria-expanded", String(open));
    more.textContent = open ? "Show fewer photos" : "Show all " + gal.length + " photos";
    if (open) { var b = gEl.querySelectorAll(".mo-b")[FIRST]; if (b) b.focus({ preventScroll: true }); }
  });
  more.textContent = "Show all " + gal.length + " photos";
  gEl.addEventListener("click", function (e) {
    var b = e.target.closest(".mo-b"); if (!b) return;
    H.lightbox(gal, +b.getAttribute("data-i"), b);
  });

  /* ---------- open positions (compact band) ---------- */
  var h = IIL.hiring || {};
  document.getElementById("join-box").innerHTML =
    '<div class="jb-h"><h2 class="h3" id="h-join">' + esc(h.headline || "Open positions") + '</h2><p class="small">Optics, microscopy, computational imaging and related fields. Backgrounds in ME, EE, CS or Physics.</p></div>' +
    '<ul class="jb-l">' + (h.positions || []).map(function (p) {
      return "<li><span class=\"jb-t\">" + esc(p.title) + "</span>" +
        (p.link ? '<a class="jb-a ul" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.linkText || "More") + " " + H.ext + "</a>" : "") + "</li>";
    }).join("") + "</ul>" +
    '<p class="jb-m">Email a resume to <a class="ul" href="mailto:' + esc(h.email) + '">' + esc(h.email) + '</a><button class="copy" type="button" data-copy="' + esc(h.email) + '" aria-label="Copy email address">Copy</button></p>';

  H.reveal();
  if (location.hash === "#join") requestAnimationFrame(function () { var j = document.getElementById("join"); if (j) j.scrollIntoView(); });
})();
