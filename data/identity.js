/* Imaging Intelligence Laboratory: one identity for pages, meta tags and structured data (SEO_GEO_PLAN.md, Priority 2).
   Name form everywhere: "Seung Ah Lee (이승아)"; Korean lab name 지능형 이미징 연구실.
   piIntro / piIntroKo are the standard PI intro texts (field first, department only where formally needed).
   Used by js/home.js, js/pi.js, js/ko.js and _dev/build_deploy.py (JSON-LD, llms.txt). */
window.IIL = window.IIL || {};
IIL.identity = {
  site: "https://iilab.io/",
  lab: "Imaging Intelligence Laboratory",
  labKo: "지능형 이미징 연구실",
  labShort: "IIL",
  formerly: "Optical Imaging Systems Laboratory (OISL), Yonsei University (2018–2025)",
  univ: "Seoul National University",
  univKo: "서울대학교",
  /* lab description (Home hero, ko.html lede, JSON-LD ResearchOrganization.description, llms.txt); rewritten 2026-10-15 at the PI's request
     (Korean texts rewritten again 2026-10-15 in plain 합니다체 after a sentence-by-sentence review for translationese):
     plain and concrete, no slogans. The Home hero (index.html) and ko.html carry the same content in their static HTML, the Home hero in the first person
     because it sits under the lab name. */
  labIntro: "The Imaging Intelligence Laboratory in the Department of Mechanical Engineering at Seoul National University develops optical imaging instruments and the algorithms that reconstruct their images. Current work includes Fourier ptychographic and polarization microscopes that measure quantitative phase and birefringence, virtual staining of unstained tissue slides, lensless cameras with fabricated phase masks, and rolling-shutter speckle imaging of blood flow. The laboratory is led by Prof. Seung Ah Lee.",
  labIntroKo: "서울대학교 기계공학부 지능형 이미징 연구실은 광학 영상 장비와 영상 복원 알고리즘을 개발합니다. 현미경 분야에서는 푸리에 타이코그래피 현미경과 무염색 조직의 가상 염색을 다룹니다. 카메라 분야에서는 위상 마스크를 쓴 렌즈리스 카메라와, 동적 스페클 이미징으로 혈류를 측정하는 기술을 개발합니다. 연구실 책임자는 이승아 교수입니다.",
  pi: "Seung Ah Lee",
  piKo: "이승아",
  piIntro: "Seung Ah Lee is an Associate Professor at Seoul National University working on optical imaging systems and computational imaging: microscopes, cameras and optical metrology and inspection instruments designed jointly with optics and AI-based image reconstruction. She received her B.S. in Electrical Engineering and M.S. in Electrical and Computer Engineering from Seoul National University and her Ph.D. in Electrical Engineering from Caltech, and was a faculty member in Electrical and Electronic Engineering at Yonsei University (2018–2025).",
  piIntroKo: "이승아 교수는 서울대학교에서 광학 이미징 시스템과 계산 이미징(computational imaging)을 연구합니다. 현미경, 카메라, 광학 계측·검사 장비를 개발하면서 광학계와 AI 영상 복원 알고리즘을 동시에 설계합니다. 서울대학교에서 전기공학 학사와 전기컴퓨터공학 석사 학위를, 미국 Caltech에서 전기공학 박사 학위를 받았습니다. 2018년부터 2025년까지 연세대학교 전기전자공학부 교수로 재직했습니다.",
  /* career sentence for the PI page, from data/team.js (IIL.pi.bio, IIL.pi.career) */
  piCareer: "Her Ph.D. work at Caltech (2014) was on chip-scale lensless microscopy. She was a postdoctoral associate at the Department of Bioengineering, Stanford University and at Google X, and a scientist at Verily Life Sciences, before joining Yonsei University in 2018 and Seoul National University in 2025.",
  knowsAbout: [
    "Optical imaging systems", "Imaging instrumentation", "Computational imaging", "Computational microscopy",
    "Fourier ptychography", "Quantitative phase imaging", "Polarization imaging", "Virtual staining", "Digital pathology",
    "Lensless cameras", "Phase masks", "Image sensors", "Optical metrology and inspection", "Laser speckle imaging",
    "Blood flow imaging", "Deep learning for image reconstruction", "Biophotonics"
  ],
  knowsAboutKo: [
    "광학 이미징", "이미징 시스템", "영상 장비", "광학 장비", "현미경", "카메라", "이미지 센서", "광학 계측", "검사 장비",
    "의료 영상 장비", "계산 이미징", "영상 복원", "광학 설계", "편광 이미징"
  ]
};
