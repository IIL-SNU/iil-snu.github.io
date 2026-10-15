(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var SHOW = 4;
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var TXT = {
    en: { lab: "Laboratory (2018–)", before: "Earlier work by Seung Ah Lee", beforeNote: "Seoul National University, Caltech and Stanford, before the laboratory",
      jHead: "Journal covers and highlights", art: function (n) { return n === 1 ? "1 article" : n + " articles"; },
      more: function (n) { return "Show " + n + " more"; }, less: "Show fewer" },
    ko: { lab: "연구실 (2018–)", before: "이승아 교수의 이전 연구", beforeNote: "연구실을 시작하기 전 서울대학교, 칼텍, 스탠퍼드 시절",
      jHead: "학술지 표지와 하이라이트", art: function (n) { return "기사 " + n + "건"; },
      more: function (n) { return n + "건 더 보기"; }, less: "접기" }
  };
  function month(d, lang) {
    var p = String(d).split("-"), y = p[0], m = +p[1];
    if (!m) return y;
    return lang === "ko" ? y + "년 " + m + "월" : MON[m - 1] + " " + y;
  }
  function day(d, lang) {
    if (lang === "ko") return String(d).replace(/-/g, ".");
    var p = String(d).split("-"), m = +p[1], dd = +p[2];
    if (!m) return p[0];
    return MON[m - 1] + (dd ? " " + dd + "," : "") + " " + p[0];
  }
  function item(it, lang) {
    return '<li><a class="pr-a" href="' + esc(it.url) + '" target="_blank" rel="noopener"' + (it.lang ? ' lang="' + esc(it.lang) + '"' : "") + ">" +
      '<span class="pr-o">' + esc(it.outlet) + "</span>" +
      '<span class="pr-it">' + esc(it.title) + "</span>" +
      '<span class="pr-id">' + esc(day(it.date, lang)) + "</span></a></li>";
  }
  function group(g, lang, T, k) {
    var c = g[lang] || g.en, its = g.items || [];
    var first = its.slice(0, SHOW), rest = its.slice(SHOW);
    return '<li class="pr-g" data-rv data-k="' + (k % 4) + '">' +
      '<p class="pr-d">' + esc(month(g.date, lang)) + '<span class="pr-n">' + esc(T.art(its.length)) + "</span></p>" +
      '<div class="pr-b"><h4 class="pr-t">' + esc(c.t) + "</h4>" +
      '<p class="pr-x">' + esc(c.d) + "</p>" +
      (g.paper ? '<p class="pr-p"><a class="ul" href="' + esc(g.paper.url) + '" target="_blank" rel="noopener" lang="en">' + esc(g.paper.label) + "</a></p>" : "") +
      '<ul class="pr-items">' + first.map(function (it) { return item(it, lang); }).join("") + "</ul>" +
      (rest.length ? '<details class="pr-more"><summary data-more="' + esc(T.more(rest.length)) + '" data-less="' + esc(T.less) + '"><span>' + esc(T.more(rest.length)) + '</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></summary>' +
        '<ul class="pr-items">' + rest.map(function (it) { return item(it, lang); }).join("") + "</ul></details>" : "") +
      "</div></li>";
  }
  function journal(list, lang) {
    return '<ul class="pr-j" data-stagger>' + list.map(function (j, i) {
      return '<li data-rv data-k="' + (i % 4) + '"><a class="pr-jc" href="' + esc(j.url) + '" target="_blank" rel="noopener">' +
        '<span class="pr-jd">' + esc(month(j.date, lang)) + "</span>" +
        '<span class="pr-jt">' + esc(lang === "ko" ? j.ko : j.en) + "</span>" +
        '<span class="pr-jp" lang="en">' + esc(j.paper) + "</span></a></li>";
    }).join("") + "</ul>";
  }
  H.press = function (el, lang) {
    if (!el) return;
    var T = TXT[lang] || TXT.en, P = (IIL.press || []).slice(), JF = IIL.journalFeatures || { lab: [], before: [] };
    P.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    function era(key, head, note) {
      var gs = P.filter(function (g) { return g.era === key; });
      return '<div class="pr-era">' +
        '<div class="pr-eh"><h3 class="meta" data-rv>' + esc(head) + "</h3>" + (note ? '<p class="small" data-rv>' + esc(note) + "</p>" : "") + "</div>" +
        '<ol class="pr-list" data-stagger>' + gs.map(function (g, i) { return group(g, lang, T, i); }).join("") + "</ol>" +
        ((JF[key] || []).length ? '<h4 class="pr-jh" data-rv>' + esc(T.jHead) + "</h4>" + journal(JF[key], lang) : "") +
        "</div>";
    }
    el.innerHTML = era("lab", T.lab) + era("before", T.before, T.beforeNote);
    el.querySelectorAll(".pr-more").forEach(function (d) {
      d.addEventListener("toggle", function () {
        var s = d.querySelector("summary"), sp = s.querySelector("span");
        sp.textContent = d.open ? s.getAttribute("data-less") : s.getAttribute("data-more");
      });
    });
  };
})();
