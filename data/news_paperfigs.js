/* Paper figures for paper-related news items (Home > Recent activity; H.newsMedia in js/site.js).
   One figure from the paper named by pubId (data/pubs.js), lab data only. Priority in a news card: lab photo, then this
   paper figure, then a gallery event photo, then a verified logo, then text. A figure is not shown elsewhere on the site,
   except where "source" says REUSE (no unused lab figure of that paper exists).
   Items without an entry (no lab figure of the paper, or the paper is not identifiable): 9 (Advanced Imaging commentary),
   58 (micro-HBI review; its figure montage includes pre-lab Stanford work), 64, 77, 92 (paper awards; the awarded paper is
   not named), 81 (conference presentations, no single paper), 100 and 102 (Riedel-Kruse lab work, not lab-generated). */
window.IIL = window.IIL || {};
IIL.newsPaperFigs = [
 {
  "i": 0,
  "date": "2026-10",
  "match": "SJ's paper on a <a href=\"https://doi.org/10.1088/2515-7647/a",
  "pubId": "byun2026physicsguided",
  "src": "assets/research/speckle/bisnet-single-shot-vs-fitting.jpg",
  "caption": "Static-scattering fraction (ρ) and decorrelation-rate (τc⁻¹) maps of mouse cortex from a single rolling-shutter speckle frame: pixel-wise fitting vs the physics-guided network.",
  "credit": "S. Byun et al., J. Phys. Photonics 2026",
  "fit": "contain",
  "source": "assets/research/speckle (lab figure from the paper)"
 },
 {
  "i": 7,
  "date": "2026-06",
  "match": "DG's IFIN <a href=\"https://iilab.io/IFIN/\">paper</a> is acce",
  "pubId": "bae2026integrated",
  "src": "assets/research/lensless/ifin-widercam-in-the-wild.jpg",
  "caption": "In-the-wild scenes from the wide-field phase-mask camera: raw measurement, IFIN reconstruction and a conventional-camera photo for reference.",
  "credit": "D. Bae et al., ECCV 2026",
  "fit": "contain",
  "source": "research_lensless.js figure (lab figure from the paper)"
 },
 {
  "i": 8,
  "date": "2026-04",
  "match": "YG's GAPC-ASM <a href=\"https://doi.org/10.1364/OE.586512\">pa",
  "pubId": "kang2026geometryaware",
  "src": "assets/research/lensless/gapc-asm-shifted-kernel-and-phase-compensation.png",
  "caption": "(a) Shifting the angular-spectrum kernel for off-axis fields. (b) Global and local phase compensation for a thick refractive element.",
  "credit": "Y. G. Kang et al., Opt. Express 2026",
  "fit": "contain",
  "source": "research_lensless.js figure (lab figure from the paper); already the news figure before v6"
 },
 {
  "i": 13,
  "date": "2025-12",
  "match": "HS and KC's recent papers on FP are accepted.",
  "pubId": "chae2026pupil",
  "src": "assets/research2/fp/lily-root-birefringence-detail-a.jpg",
  "caption": "Birefringence map of lily root-tip cell walls from vectorial FP; color shows fiber orientation and brightness shows retardance.",
  "credit": "H. Chae et al., Laser Photonics Rev. 2026",
  "fit": "cover",
  "source": "media_research.js (KSPE 2025 talk deck, slide 16); one of the two papers in this item (the other is lee2026semisupervised)"
 },
 {
  "i": 23,
  "date": "2025-03",
  "match": "Our single-shot FP <a href=\"https://pubs.aip.org/aip/apl/art",
  "pubId": "yoon2025singleshot",
  "src": "assets/news/paperfigs/single-shot-fp-phase-frame.jpg",
  "caption": "Quantitative phase frame of a swimming microorganism from single-shot FP video recorded at 75 frames per second.",
  "credit": "H. Yoon et al., Appl. Phys. Lett. 2025",
  "fit": "cover",
  "source": "_build/figs2/micro/A3_singleshot_FP_phase_75fps_frame0.png (OBC 2026 talk deck, slide 7, phase video cited to the paper), cropped and contrast-stretched"
 },
 {
  "i": 26,
  "date": "2024-10",
  "match": "HS's <a href=\"https://pubs.aip.org/aip/app/article/9/10/1061",
  "pubId": "chae2024restoring",
  "src": "assets/research2/vs/faded-slide-virtually-restained-wsi.jpg",
  "caption": "Archived urinary-bladder slide with faded H&E, virtually re-stained from its near-infrared phase image.",
  "credit": "H. Chae et al., APL Photonics 2024",
  "fit": "contain",
  "source": "media_research.js (_build/figs/faded_A_overview_restained_bladder_WSI.png); was the Virtual Staining lead on the Research page before v6"
 },
 {
  "i": 29,
  "date": "2024-07",
  "match": "KC's <a href=\"https://opg.optica.org/oe/fulltext.cfm?uri=oe-",
  "pubId": "lee2024anisotropic",
  "src": "assets/news/paperfigs/tv-regularized-fp-tissue-comparison.jpg",
  "caption": "FP reconstruction of a tissue section from sparse, noisy measurements without (left) and with (right) the regularization.",
  "credit": "K. C. Lee et al., Opt. Express 2024",
  "fit": "contain",
  "source": "KSPE 2025 talk deck (~/Downloads/[정밀공학회] ...pptx) slide 11, image77.gif frames 2 and 3, slide cites the paper"
 },
 {
  "i": 38,
  "date": "2024-02",
  "match": "TY's <a href=\"https://www.spiedigitallibrary.org/conference-",
  "pubId": null,
  "src": "assets/research2/lensless/lensless-eye-tracker-prototype-and-test.jpg",
  "caption": "Lensless eye tracker: goggle prototype, imaging module with phase mask and IR LED, and a clinical measurement session.",
  "credit": "T. Kim et al., Proc. SPIE 13076 (2024)",
  "fit": "contain",
  "source": "media_research.js (_build/figs2/other/B3_03); the SPIE proceedings paper is not listed in pubs.js"
 },
 {
  "i": 39,
  "date": "2024-02",
  "match": "KW's <a href=\"https://www.sciencedirect.com/science/article/",
  "pubId": "lee2024highresolution",
  "src": "assets/news/paperfigs/display-screen-fp-usaf-results.jpg",
  "caption": "Phase of a USAF target recovered with display-screen illumination for different numbers of illumination patterns N.",
  "credit": "Kyungwon Lee et al., Opt. Lasers Eng. 2024",
  "fit": "contain",
  "source": "_build/figs2/micro/A5_display_FP_USAF_results.png (OBC 2026 talk deck, slide 6, cited to the paper)"
 },
 {
  "i": 40,
  "date": "2024-02",
  "match": "YJ and SJ's <a href=\"https://opg.optica.org/boe/fulltext.cfm",
  "pubId": "lee2024rolling",
  "src": "assets/research2/speckle/rsspg-setup-waveform.jpg",
  "caption": "RSSPG setup on a fingertip and the resulting pulse waveform.",
  "credit": "Y. Lee et al., Biomed. Opt. Express 2024",
  "fit": "contain",
  "source": "media_research.js (_build/figs2/other/B1_09)"
 },
 {
  "i": 41,
  "date": "2024-02",
  "match": "CY's <a href=\"https://opg.optica.org/boe/fulltext.cfm?uri=bo",
  "pubId": "yi2024improvements",
  "src": "assets/research2/speckle/rolling-shutter-speckle-patterns.jpg",
  "caption": "Rolling-shutter speckle images recorded at different flow rates and tissue-phantom thicknesses.",
  "credit": "C. Yi et al., Biomed. Opt. Express 2024",
  "fit": "contain",
  "source": "media_research.js (ALPS 2025 talk deck, slide 16)"
 },
 {
  "i": 53,
  "date": "2023-07",
  "match": "HS, KC, CY, and YJ gave oral presentations at the Optica Ima",
  "pubId": "lee2024rolling",
  "src": "assets/research2/speckle/rsspg-vs-ppg-dicrotic-notch.jpg",
  "caption": "RSSPG and PPG waveforms side by side; the dicrotic notch is much clearer in RSSPG.",
  "credit": "Y. Lee et al., Biomed. Opt. Express 2024",
  "fit": "contain",
  "source": "media_research.js (_build/figs2/other/B1_10); YJ's 2023 Optica Imaging Congress paper is the conference version of this work"
 },
 {
  "i": 54,
  "date": "2023-06",
  "match": "TY's paper on lensless HSI is published in <a href=\"https://",
  "pubId": "kim2023apertureencoded",
  "src": "assets/research/lensless/hyperspectral-lvf-lensless-camera-render.jpg",
  "caption": "Device concept: a linear variable filter, a phase mask and a monochrome image sensor.",
  "credit": "T. Kim et al., APL Photonics 2023",
  "fit": "cover",
  "source": "research_lensless.js figure (lab figure from the paper); already the news figure before v6"
 },
 {
  "i": 61,
  "date": "2023-01",
  "match": "KC's paper is featured as a cover article for the January is",
  "pubId": "lee2023design",
  "src": "assets/research/lensless/phase-mask-voronoi-psf-cover-art.jpg",
  "caption": "Cover art for the January 2023 issue of Optica: a phase mask with a Voronoi point-spread function.",
  "credit": "K. C. Lee et al., Optica 2023",
  "fit": "cover",
  "source": "existing site file (lab-made cover art); already the news figure before v6"
 },
 {
  "i": 64,
  "date": "2022-11",
  "match": "KC's paper on the design and fabrication of phase masks is a",
  "pubId": "lee2023design",
  "src": "assets/research2/lensless/reconstruction-real-scene-toys.jpg",
  "caption": "Reconstructed image of a real tabletop scene captured with a custom phase-mask lensless camera.",
  "credit": "K. C. Lee et al., Optica 2023",
  "fit": "cover",
  "source": "media_research.js (Nov 2025 lensless seminar deck, slide 14)"
 },
 {
  "i": 70,
  "date": "2022-10",
  "match": "NK's paper on a lensless polarization camera is accepted for",
  "pubId": "baek2022lensless",
  "src": "assets/research2/lensless/full-stokes-results.jpg",
  "caption": "Single-shot full-Stokes results: raw measurement, recovered polarization channels, Stokes parameters S0 to S3, degree and angle of polarization and ellipticity.",
  "credit": "N. Baek et al., APL Photonics 2022",
  "fit": "contain",
  "source": "media_research.js (ETME 2025 talk deck, slide 27)"
 },
 {
  "i": 71,
  "date": "2022-10",
  "match": "CY's paper on rolling shutter speckle imaging is accepted fo",
  "pubId": "yi2022singleshot",
  "src": "assets/research2/speckle/rssi-mouse-cortex-maps.jpg",
  "caption": "Mouse cortex through a cranial window imaged by rolling-shutter speckle imaging: static-scattering fraction, decorrelation time and blood-flow index maps.",
  "credit": "C. Yi et al., Optica 2022",
  "fit": "contain",
  "source": "media_research.js (_build/figs2/other/B1_03; hidden on the Research page)"
 },
 {
  "i": 77,
  "date": "2022-03",
  "match": "YJ and HS's <a href=\"https://ieeexplore.ieee.org/document/97",
  "pubId": "lee2022fabrication",
  "src": "assets/research2/lensless/imprinted-phase-mask-micrograph.jpg",
  "caption": "Micrograph of a phase mask fabricated by UV imprint lithography. Scale bar 0.5 mm.",
  "credit": "Y. Lee, H. Chae et al., IEEE Photonics J. 2022",
  "fit": "contain",
  "source": "media_research.js (ETME 2025 talk deck, slide 5)"
 },
 {
  "i": 86,
  "date": "2021-05",
  "match": "CY and NK's paper is accepted for ACM SIGGRAPH 2021.",
  "pubId": "yi2021remember",
  "src": "assets/research2/hbi/remember-pipeline.png",
  "caption": "ReMember pipeline: recording the heartbeat, turning it into sound and light, sensing visitors' hands and responding to touch.",
  "credit": "C. Yi et al., Proc. ACM CGIT (SIGGRAPH) 2021",
  "fit": "contain",
  "source": "media_research.js; REUSE: also shown on the Publications page (the only other lab figure of this paper is the installation photo on the Home theme tile)"
 },
 {
  "i": 87,
  "date": "2021-04",
  "match": "KC's <a href=\"https://pubs.acs.org/doi/10.1021/acsphotonics.",
  "pubId": "lee2021smartphonebased",
  "src": "assets/research2/fp/smartphone-fp-microscope-photo.jpg",
  "caption": "Smartphone FP microscope: a 3D-printed optics module on a phone whose OLED screen provides the programmable illumination.",
  "credit": "K. C. Lee et al., ACS Photonics 2021",
  "fit": "contain",
  "source": "media_research.js (_build/figs2/micro/A5_smartphone_FP_microscope_photo.png)"
 },
 {
  "i": 99,
  "date": "2020-02",
  "match": "KW and JW's work on interactive biology is accepted for the ",
  "pubId": "lee2020microaquarium",
  "src": "assets/research/hbi/microaquarium-full-body-play.jpg",
  "caption": "Full-body play: visitors' silhouettes share the screen with the cells, and their arm movements send the swimmers in new directions.",
  "credit": "K. Lee et al., CHI EA 2020",
  "fit": "cover",
  "source": "research_*.js hbi figure; REUSE: also the Interactive Biology index thumbnail on the Research page (both lab figures of this paper are used there)"
 }
];
