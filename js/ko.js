/* Korean page (ko.html): research by application area. Published results only (data/pubs.js,
   data/research_*.js facts, data/resources.js); no unpublished numbers and no company projects.
   {id} or {id;id} in the text becomes a citation with a DOI link from data/pubs.js; {@url|label} links to a URL. */
(function () {
  "use strict";
  var H = window.H1, IIL = window.IIL || {}, esc = H.esc;
  var ID = IIL.identity || {}, pi = IIL.pi || {};
  var byId = {};
  (IIL.pubs || []).forEach(function (p) { byId[p.id] = p; });
  function $(id) { return document.getElementById(id); }

  function person(a) {
    var m = String(a).replace(/\*/g, "").trim().match(/^([^,]+),\s*(.+)$/);
    if (!m) return a;
    return m[2].replace(/([A-Z])\./g, "$1. ").replace(/\s+/g, " ").trim() + " " + m[1].trim();
  }
  function firstAuthor(s) {
    var list = String(s).replace(/,?\s*&\s*/g, ", ").match(/[^,]+,\s*(?:[A-Z][a-z]?\.(?:-?[A-Z]\.)*\*?)/g) || [];
    return person(list[0] || s) + (list.length > 1 ? " et al." : "");
  }
  function doiUrl(p) { return p.doi ? "https://doi.org/" + p.doi : p.url; }
  function cite(ids) {
    return '<span class="credit">(' + ids.map(function (id) {
      if (id.charAt(0) === "@") { var u = id.slice(1).split("|"); return '<a class="ul" href="' + esc(u[0]) + '" target="_blank" rel="noopener">' + esc(u[1]) + "</a>"; }
      var p = byId[id]; if (!p) return "";
      return '<a class="ul" href="' + esc(doiUrl(p)) + '" target="_blank" rel="noopener" lang="en">' + esc(firstAuthor(p.authors) + ", " + p.venueShort.replace(/\s+\d{4}$/, "") + " " + p.year) + "</a>";
    }).filter(Boolean).join("; ") + ")</span>";
  }
  function fill(s) { return esc(s).replace(/\{([^}]+)\}/g, function (m, ids) { return cite(ids.split(";")); }); }

  /* Korean copy rewritten 2026-10-15 (PI: plain 합니다체, no list-label colons, no translationese; facts unchanged) */
  var AREAS = [
    { th: "fp", h: "바이오·의료 영상 장비",
      p: "염색하지 않은 세포와 조직에서 정량 위상과 복굴절을 측정하는 현미경을 개발합니다. 무염색 조직 슬라이드를 H&E 염색 영상으로 바꾸는 가상 염색과, 일반 카메라 센서로 혈류를 측정하는 동적 스페클 이미징도 연구합니다.",
      items: [
        "푸리에 타이코그래피 현미경(Fourier ptychographic microscopy, FPM)은 LED나 디스플레이로 시료를 여러 각도에서 비추며 저배율 대물렌즈로 영상을 여러 장 찍습니다. 이 영상들을 합쳐 넓은 시야의 고해상도 영상과 정량 위상 영상을 얻습니다. 스마트폰으로 만든 FPM의 해상도는 2.1 × 1.6 mm² 시야에서 870 nm(half-pitch)입니다. {lee2021smartphonebased}",
        "단일 촬영 FPM은 편광으로 구분한 조명을 동시에 비추어, 영상 한 장으로 대물렌즈 회절 한계의 2.5배 해상도를 얻습니다. 정량 위상 동영상은 초당 75프레임으로 찍을 수 있습니다. {yoon2025singleshot}",
        "편광 FPM은 동공면을 편광 필름으로 나누어, 흑백 카메라 한 대로 복굴절과 광축 방향, 위상을 한 번에 측정합니다. {chae2026pupil}",
        "가상 염색은 염색하지 않은 조직의 위상 영상을 신경망으로 H&E 염색 영상으로 바꾸는 디지털 병리 기술입니다. 10년쯤 지나 색이 바랜 병리 슬라이드를 이 방법으로 복원했습니다. 학습으로 얻은 조명 패턴 16개를 쓰면 4 mm × 3 mm 영역을 약 5초 만에 촬영할 수 있습니다. {chae2024restoring;lee2026semisupervised}",
        "동적 스페클 이미징에서는 롤링셔터 스페클 영상법(rolling-shutter speckle imaging, RSSI)을 개발했습니다. 일반 CMOS 이미지 센서는 영상을 한 줄씩 차례로 읽는데, 이 방식을 이용하면 사진 한 장으로 혈류 지도를 얻을 수 있습니다. 손끝 맥파를 재는 RSSPG는 기존 광용적맥파(PPG)보다 중복맥 패임(dicrotic notch)을 14배 더 뚜렷하게 측정했습니다. {yi2022singleshot;lee2024rolling}"
      ],
      links: [["computational-microscopy.html", "계산 현미경 (영문)"], ["computational-microscopy.html#virtual-staining", "가상 염색 (영문)"], ["speckle-imaging.html", "동적 스페클 이미징 (영문)"]] },
    { th: "speckle", h: "반도체·디스플레이 광학 계측·검사",
      p: "넓은 영역에서 위상과 편광, 표면 형상을 높은 해상도로 정량 측정하는 광학 계측 기술을 연구합니다. 미세 광학 소자의 설계와 제작도 다룹니다.",
      items: [
        "FPM은 저배율 대물렌즈의 넓은 시야를 유지한 채 합성 개구로 해상도를 높입니다. 미국 Duke 대학 연구팀과의 공동연구에서는 카메라 54대를 배열해 110 cm² 이상의 영역에서 초점이 모두 맞은 60억 화소 영상과 3차원 높이 지도를 얻었습니다. {zhou2024computational}",
        "휴대폰 OLED 화면의 화소를 각각 조명으로 쓰는 FPM도 개발했습니다. {lee2024highresolution}",
        "편광 FPM은 흑백 카메라 한 대로 시료의 편광 특성(Jones 행렬)을 모두 측정합니다. {chae2026pupil}",
        "측정 영상이 적고 잡음이 많을 때는 이방성 정규화로 진폭과 위상을 안정적으로 복원합니다. {lee2024anisotropic;@https://github.com/IIL-SNU/FP_ADMM|코드 FP_ADMM}",
        "원하는 점확산함수(PSF)를 내는 위상 마스크를 설계하고, 그레이스케일 리소그래피로 한 번 노광해 제작합니다. 두꺼운 자유곡면 마스크의 빛 전파를 정확하게 계산하는 파동광학 시뮬레이션 방법(GAPC-ASM)도 개발했습니다. {lee2023design;kang2026geometryaware;@https://github.com/IIL-SNU/GAPC-ASM|코드 GAPC-ASM}"
      ],
      links: [["computational-microscopy.html", "계산 현미경 (영문)"], ["lensless-cameras.html", "렌즈리스 카메라 (영문)"]] },
    { th: "lensless", h: "카메라·이미지 센서·렌즈리스 카메라",
      p: "렌즈리스 카메라는 렌즈 대신 얇은 위상 마스크를 이미지 센서 앞에 두고, 센서에 찍힌 영상을 계산으로 복원합니다. 마스크를 설계하고 제작해 센서에 붙이는 일부터 영상 복원 신경망까지 연구실에서 개발합니다.",
      items: [
        "UV 임프린트 리소그래피로 이미지 센서 위에 위상 마스크를 바로 찍어 만듭니다. {lee2022fabrication;@https://patents.google.com/patent/US12108134B2|미국 특허 US12108134B2}",
        "편광 렌즈리스 카메라는 영상 한 장에서 Stokes 파라미터 네 개를 모두 구해 편광 상태 전체를 측정합니다. {baek2022lensless}",
        "초분광 렌즈리스 카메라는 흑백 센서로 찍은 영상 한 장에서 410–800 nm 대역의 초분광 영상을 얻습니다. {kim2023apertureencoded}",
        "안구 운동을 재는 저가 렌즈리스 안구 추적기의 유효 촬영 속도를 15 Hz에서 480 Hz로 높였습니다. {@https://doi.org/10.1117/12.3017964|T. Kim et al., Proc. SPIE 2024;@https://patents.google.com/patent/US12062190B2|미국 특허 US12062190B2}",
        "카메라의 물리 모델을 신경망의 각 단계에 넣은 복원 네트워크 IFIN과, 렌즈리스 영상 25,000쌍으로 된 데이터셋 WiderCam을 공개했습니다. {bae2026integrated;@https://github.com/IIL-SNU/IFIN|코드 IFIN;@https://iilab.io/WiderCam|WiderCam}",
        "위치마다 PSF가 달라지는 마스크를 써서, 영상을 기록하는 단계부터 개인 정보를 보호하는 렌즈리스 카메라도 연구합니다. {@https://doi.org/10.1364/COSI.2025.CTh1B.4|K. C. Lee et al., COSI 2025}"
      ],
      links: [["lensless-cameras.html", "렌즈리스 카메라 (영문)"]] }
  ];

  $("ko-pi").textContent = ID.piIntroKo || "";
  $("ko-areas").innerHTML = AREAS.map(function (a, i) {
    return '<section class="ko-area" data-th="' + a.th + '" aria-labelledby="ko-a' + i + '" data-rv><h3 class="h2" id="ko-a' + i + '">' + esc(a.h) + "</h3>" +
      "<p>" + esc(a.p) + "</p><ul>" + a.items.map(function (s) { return "<li>" + fill(s) + "</li>"; }).join("") + "</ul>" +
      '<p class="ko-links">' + a.links.map(function (l) { return '<a class="ul" href="' + l[0] + '">' + esc(l[1]) + "</a>"; }).join("") + "</p></section>";
  }).join("");

  /* representative papers (data/pubs.js) */
  var SEL = ["chae2026pupil", "lee2026semisupervised", "bae2026integrated", "kang2026geometryaware", "yoon2025singleshot", "chae2024restoring", "lee2024highresolution", "lee2024rolling", "lee2023design", "kim2023apertureencoded", "yi2022singleshot", "baek2022lensless", "lee2022fabrication", "lee2021smartphonebased"];
  $("ko-pubs").innerHTML = SEL.map(function (id) {
    var p = byId[id]; if (!p) return "";
    return '<li lang="en"><p class="th-pt"><a class="ul" href="' + esc(p.url || doiUrl(p)) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></p>" +
      '<p class="th-pa">' + esc(p.authors).replace(/Lee, S\.A\.\*?/g, function (m) { return "<strong>" + m + "</strong>"; }) + "</p>" +
      '<p class="th-pv"><em>' + esc(p.venue) + "</em>" + (p.details ? ", " + esc(p.details) : "") + " (" + p.year + ")" +
      (p.doi ? ' <a class="pub-id" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + "</a>" : "") + "</p></li>";
  }).join("");

  /* patents of the laboratory (data/pubs.js IIL.patents) */
  var PAT = ["US12108134B2", "US12062190B2", "US11880965B2"];
  $("ko-pat").innerHTML = (IIL.patents || []).filter(function (p) { return PAT.indexOf(p.number) >= 0; }).map(function (p) {
    return '<li lang="en"><p class="th-pt"><a class="ul" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></p>" +
      '<p class="th-pa">' + esc(p.inventors).replace(/SA Lee/g, "<strong>SA Lee</strong>") + "</p>" +
      '<p class="th-pv">' + esc(p.number) + ", " + (p.status === "granted" ? "granted" : esc(p.status)) + " " + esc(p.year) + "</p></li>";
  }).join("");

  /* contact */
  var c = pi.contact || {};
  $("ko-mail").innerHTML = '<a class="ul" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a><button class="copy" type="button" data-copy="' + esc(c.email) + '" aria-label="이메일 주소 복사">Copy</button>';
  H.reveal();
})();
