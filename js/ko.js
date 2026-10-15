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

  var AREAS = [
    { th: "fp", h: "바이오·의료 영상 장비",
      p: "무염색 세포와 조직의 정량 위상과 복굴절을 측정하는 현미경, 염색하지 않은 조직 슬라이드를 염색 영상으로 바꾸는 가상 염색, 일반 카메라 센서로 조직의 혈류를 측정하는 영상 기법을 개발합니다.",
      items: [
        "푸리에 타이코그래피 현미경(Fourier ptychographic microscopy, FPM): 저배율 렌즈와 LED 또는 디스플레이 조명으로 넓은 시야의 고해상도 영상과 정량 위상 영상을 얻습니다. 스마트폰 FPM은 2.1 × 1.6 mm² 영역에서 870 nm 하프피치 해상도를 보였습니다. {lee2021smartphonebased}",
        "단일 촬영 FPM: 편광으로 부호화한 조명을 써서 영상 한 장으로 대물렌즈 회절 한계의 2.5배 해상도를 얻고, 정량 위상 동영상을 75 fps로 기록합니다. {yoon2025singleshot}",
        "편광(벡터) FPM: 동공면을 편광으로 나누어 흑백 카메라 한 대로 복굴절, 광축 방향, 위상을 함께 측정합니다. {chae2026pupil}",
        "가상 염색(디지털 병리): 무염색 조직의 위상 영상을 신경망으로 H&E 염색 영상으로 변환합니다. 약 10년 된 퇴색 슬라이드를 복원했고, 학습된 조명 패턴 16개로 4 mm × 3 mm 영역을 약 5초에 스캔합니다. {chae2024restoring;lee2026semisupervised}",
        "롤링셔터 스페클 혈류 영상(RSSI): 일반 CMOS 이미지 센서의 롤링셔터 판독을 이용해 영상 한 장에서 혈류 지도를 얻습니다. 손끝 맥파 측정(RSSPG)에서는 광용적맥파(PPG)보다 14배 뚜렷한 중복맥 패임(dicrotic notch)을 측정했습니다. {yi2022singleshot;lee2024rolling}"
      ],
      links: [["computational-microscopy.html", "Computational microscopy (영문)"], ["computational-microscopy.html#virtual-staining", "Virtual staining (영문)"], ["speckle-imaging.html", "Speckle imaging (영문)"]] },
    { th: "speckle", h: "반도체·디스플레이 광학 계측·검사",
      p: "넓은 영역을 높은 해상도로 측정하고, 위상·편광·표면 형상을 정량적으로 측정하는 광학 계측 원리와 미세 광학 소자 설계·제작 기술입니다. 아래 내용은 모두 발표된 연구 결과입니다.",
      items: [
        "대면적 고해상도 측정: FPM은 저배율 대물렌즈의 넓은 시야를 유지하면서 합성 개구로 해상도를 높입니다. Duke 대학과의 공동연구에서는 카메라 54대 배열로 110 cm² 이상의 영역에서 60억 화소 전초점 영상과 3차원 높이 지도를 얻었습니다. {zhou2024computational}",
        "디스플레이 조명: 휴대폰 OLED 디스플레이의 화소를 프로그래머블 광원으로 사용하는 FPM입니다. {lee2024highresolution}",
        "편광·복굴절 측정: 흑백 카메라 한 대로 시료의 Jones 행렬 전체를 측정하는 편광 영상 기법입니다. {chae2026pupil}",
        "잡음에 강한 위상 복원: 이방성 정규화로 적고 잡음이 많은 측정에서도 진폭과 위상을 복원합니다. {lee2024anisotropic;@https://github.com/IIL-SNU/FP_ADMM|코드 FP_ADMM}",
        "미세 광학 소자 설계·제작: 그레이스케일 리소그래피 1회 노광으로 원하는 점확산함수(PSF)를 갖는 위상 마스크를 제작하고, 두꺼운 자유곡면 마스크를 위한 파동광학 시뮬레이션(GAPC-ASM)을 개발했습니다. {lee2023design;kang2026geometryaware;@https://github.com/IIL-SNU/GAPC-ASM|코드 GAPC-ASM}"
      ],
      links: [["computational-microscopy.html", "Computational microscopy (영문)"], ["lensless-cameras.html", "Lensless cameras (영문)"]] },
    { th: "lensless", h: "카메라·이미지 센서·렌즈리스 카메라",
      p: "렌즈 대신 얇은 위상 마스크를 이미지 센서 위에 두고 영상을 계산으로 복원하는 렌즈리스 카메라를 설계하고 제작합니다. 마스크 설계, 제작, 센서 일체화, 영상 복원 신경망을 함께 다룹니다.",
      items: [
        "센서 일체형 위상 마스크: UV 임프린트 리소그래피로 위상 마스크를 이미지 센서 위에 직접 복제합니다. {lee2022fabrication;@https://patents.google.com/patent/US12108134B2|미국 특허 US12108134B2}",
        "편광 카메라: 렌즈리스 카메라 영상 한 장에서 Stokes 파라미터 4개(전체 편광 상태)를 측정합니다. {baek2022lensless}",
        "초분광 카메라: 흑백 센서 영상 한 장으로 410–800 nm 초분광 영상을 얻습니다. {kim2023apertureencoded}",
        "안구 운동 측정: 저가 렌즈리스 안구 추적기의 유효 프레임률을 15 Hz에서 480 Hz로 높였습니다. {@https://doi.org/10.1117/12.3017964|T. Kim et al., Proc. SPIE 2024;@https://patents.google.com/patent/US12062190B2|미국 특허 US12062190B2}",
        "영상 복원 신경망과 공개 데이터셋: 카메라 물리 모델을 신경망의 모든 단계에 넣은 복원 네트워크(IFIN)와 25,000쌍의 렌즈리스 영상 데이터셋(WiderCam)을 공개했습니다. {bae2026integrated;@https://github.com/IIL-SNU/IFIN|코드 IFIN;@https://iilab.io/WiderCam|WiderCam}",
        "프라이버시 보호 센서: 위치에 따라 달라지는 PSF로 하드웨어 단계에서 영상 정보를 보호하는 렌즈리스 카메라입니다. {@https://doi.org/10.1364/COSI.2025.CTh1B.4|K. C. Lee et al., COSI 2025}"
      ],
      links: [["lensless-cameras.html", "Lensless cameras (영문)"]] }
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
