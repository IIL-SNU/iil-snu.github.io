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
      p: "정량 위상·편광 현미경, 가상 염색, 동적 스페클 이미징 등 바이오·의료 영상 장비 연구.",
      items: [
        "LED나 디스플레이로 시료를 여러 각도에서 비추고, 저배율 대물렌즈로 찍은 영상들을 합성해 넓은 시야의 고해상도 정량 위상 영상을 얻는 푸리에 타이코그래피 현미경(Fourier ptychographic microscopy, FPM) 개발. 스마트폰 FPM으로 2.1 × 1.6 mm² 시야에서 870 nm(half-pitch) 해상도 달성. {lee2021smartphonebased}",
        "편광으로 구분한 조명을 동시에 비춰 영상 한 장으로 대물렌즈 회절 한계의 2.5배 해상도를 얻는 단일 촬영 FPM. 초당 75프레임 정량 위상 동영상 촬영. {yoon2025singleshot}",
        "동공면을 편광 필름으로 나눠 흑백 카메라 한 대로 복굴절, 광축 방향, 위상을 함께 측정하는 편광 FPM. {chae2026pupil}",
        "무염색 조직의 위상 영상을 신경망으로 H&E 염색 영상으로 바꾸는 가상 염색. 약 10년이 지나 색이 바랜 병리 슬라이드 복원, 학습한 조명 패턴 16개로 4 mm × 3 mm 영역을 약 5초에 촬영. {chae2024restoring;lee2026semisupervised}",
        "CMOS 이미지 센서가 영상을 한 줄씩 차례로 읽는 롤링 셔터 방식을 이용해 사진 한 장으로 혈류 지도를 얻는 롤링 셔터 스페클 이미징(rolling-shutter speckle imaging, RSSI). 손끝 맥파 측정(RSSPG)에서 기존 광용적맥파(PPG)보다 중복맥 패임(dicrotic notch)을 14배 더 뚜렷하게 측정. {yi2022singleshot;lee2024rolling}"
      ],
      links: [["computational-microscopy.html", "계산 현미경 (영문)"], ["computational-microscopy.html#virtual-staining", "가상 염색 (영문)"], ["speckle-imaging.html", "동적 스페클 이미징 (영문)"]] },
    { th: "speckle", h: "반도체·디스플레이 광학 계측·검사",
      p: "넓은 영역의 위상, 편광, 표면 형상을 고해상도로 정량 측정하는 광학 계측 기술과 미세 광학 소자 설계·제작.",
      items: [
        "저배율 대물렌즈의 넓은 시야를 유지하면서 합성 개구로 해상도를 높이는 FPM. 미국 Duke 대학 연구팀과 공동연구로 카메라 54대 배열을 이용해 110 cm² 이상 영역에서 전체 초점이 맞은 60억 화소 영상과 3차원 높이 지도 획득. {zhou2024computational}",
        "휴대폰 OLED 화면의 화소를 하나하나 조명으로 쓰는 FPM. {lee2024highresolution}",
        "흑백 카메라 한 대로 시료의 편광 특성(Jones 행렬) 전체를 측정하는 편광 FPM. {chae2026pupil}",
        "측정 영상이 적고 잡음이 많은 조건에서도 이방성 정규화로 진폭과 위상을 안정적으로 복원. {lee2024anisotropic;@https://github.com/IIL-SNU/FP_ADMM|코드 FP_ADMM}",
        "원하는 점확산함수(PSF)를 만드는 위상 마스크 설계와 그레이스케일 리소그래피 단일 노광 제작. 두꺼운 자유곡면 마스크의 빛 전파를 정확하게 계산하는 파동광학 시뮬레이션(GAPC-ASM) 개발. {lee2023design;kang2026geometryaware;@https://github.com/IIL-SNU/GAPC-ASM|코드 GAPC-ASM}"
      ],
      links: [["computational-microscopy.html", "계산 현미경 (영문)"], ["lensless-cameras.html", "렌즈리스 카메라 (영문)"]] },
    { th: "lensless", h: "카메라·이미지 센서·렌즈리스 카메라",
      p: "렌즈 대신 얇은 위상 마스크를 이미지 센서 앞에 두고 영상을 계산으로 복원하는 렌즈리스 카메라. 용도에 맞춘 마스크 설계·제작과 센서 집적, 영상 복원 알고리즘 개발.",
      items: [
        "UV 임프린트 리소그래피로 이미지 센서 위에 위상 마스크를 직접 제작. {lee2022fabrication;@https://patents.google.com/patent/US12108134B2|미국 특허 US12108134B2}",
        "영상 한 장에서 Stokes 파라미터 네 개를 모두 구해 편광 상태 전체를 측정하는 편광 렌즈리스 카메라. {baek2022lensless}",
        "흑백 센서로 찍은 영상 한 장에서 410–800 nm 대역 초분광 영상을 얻는 초분광 렌즈리스 카메라. {kim2023apertureencoded}",
        "저가 렌즈리스 안구 추적기의 유효 촬영 속도를 15 Hz에서 480 Hz로 향상. {@https://doi.org/10.1117/12.3017964|T. Kim et al., Proc. SPIE 2024;@https://patents.google.com/patent/US12062190B2|미국 특허 US12062190B2}",
        "카메라 물리 모델을 신경망의 각 단계에 넣은 복원 네트워크 IFIN과 렌즈리스 영상 25,000쌍 데이터셋 WiderCam 공개. {bae2026integrated;@https://github.com/IIL-SNU/IFIN|코드 IFIN;@https://iilab.io/WiderCam|WiderCam}",
        "위치마다 PSF가 달라지는 마스크로 영상을 기록하는 단계부터 개인 정보를 보호하는 렌즈리스 카메라. {@https://doi.org/10.1364/COSI.2025.CTh1B.4|K. C. Lee et al., COSI 2025}"
      ],
      links: [["lensless-cameras.html", "렌즈리스 카메라 (영문)"]] }
  ];
  var PIK = [
    "서울대학교 기계공학부 부교수 (2025–)",
    "연세대학교 전기전자공학부 조교수·부교수 (2018–2025)",
    "Verily Life Sciences 연구원 (2016–2018), Google X·스탠퍼드대학교 박사후연구원 (2014–2016)",
    "미국 칼텍(Caltech) 전기공학 박사, 서울대학교 전기컴퓨터공학 석사·전기공학 학사",
    "Optics Express, Advanced Imaging 부편집장(Associate Editor)",
    "2026년 과학의 날 부총리 겸 과학기술정보통신부장관 표창"
  ];
  $("ko-pi").innerHTML = PIK.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
  $("ko-areas").innerHTML = AREAS.map(function (a, i) {
    return '<section class="ko-area" data-th="' + a.th + '" aria-labelledby="ko-a' + i + '" data-rv><h3 class="h2" id="ko-a' + i + '">' + esc(a.h) + "</h3>" +
      "<p>" + a.p.split(/(?<=\.)\s+/).map(function (s) { return '<span class="ko-s">' + esc(s) + "</span>"; }).join("") + "</p><ul>" + a.items.map(function (s) { return "<li>" + fill(s) + "</li>"; }).join("") + "</ul>" +
      '<p class="ko-links">' + a.links.map(function (l) { return '<a class="ul" href="' + l[0] + '">' + esc(l[1]) + "</a>"; }).join("") + "</p></section>";
  }).join("");
  var SEL = ["chae2026pupil", "lee2026semisupervised", "bae2026integrated", "kang2026geometryaware", "yoon2025singleshot", "chae2024restoring", "lee2024highresolution", "lee2024rolling", "lee2023design", "kim2023apertureencoded", "yi2022singleshot", "baek2022lensless", "lee2022fabrication", "lee2021smartphonebased"];
  $("ko-pubs").innerHTML = SEL.map(function (id) {
    var p = byId[id]; if (!p) return "";
    return '<li lang="en"><p class="th-pt"><a class="ul" href="' + esc(p.url || doiUrl(p)) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></p>" +
      '<p class="th-pa">' + esc(p.authors).replace(/Lee, S\.A\.\*?/g, function (m) { return "<strong>" + m + "</strong>"; }) + "</p>" +
      '<p class="th-pv"><em>' + esc(p.venue) + "</em>" + (p.details ? ", " + esc(p.details) : "") + " (" + p.year + ")" +
      (p.doi ? ' <a class="pub-id" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + "</a>" : "") + "</p></li>";
  }).join("");
  var PAT = ["US12108134B2", "US12062190B2", "US11880965B2"];
  $("ko-pat").innerHTML = (IIL.patents || []).filter(function (p) { return PAT.indexOf(p.number) >= 0; }).map(function (p) {
    return '<li lang="en"><p class="th-pt"><a class="ul" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></p>" +
      '<p class="th-pa">' + esc(p.inventors).replace(/SA Lee/g, "<strong>SA Lee</strong>") + "</p>" +
      '<p class="th-pv">' + esc(p.number) + ", " + (p.status === "granted" ? "granted" : esc(p.status)) + " " + esc(p.year) + "</p></li>";
  }).join("");
  var c = pi.contact || {};
  $("ko-mail").innerHTML = '<a class="ul" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a><button class="copy" type="button" data-copy="' + esc(c.email) + '" aria-label="이메일 주소 복사">Copy</button>';
  H.press(document.getElementById("press-c"), "ko");
  H.reveal();
})();
