/* Code, datasets and lab resources. Repositories verified via the GitHub API (github.com/IIL-SNU) on 2026-10-02.
   Datasets checked 2026-10-02 (repo READMEs/trees, iilab.io, paper data-availability statements, Zenodo/figshare/Hugging Face); every URL resolved publicly. */
window.IIL = window.IIL || {};
IIL.code = [
  { name: "IFIN", url: "https://github.com/IIL-SNU/IFIN", desc: "Official implementation and project page for IFIN (Integrated Forward–Inverse Network for lensless image reconstruction), ECCV 2026.", topic: "lensless", paper: "Bae et al., ECCV 2026", page: "https://iilab.io/IFIN/" },
  { name: "GAPC-ASM", url: "https://github.com/IIL-SNU/GAPC-ASM", desc: "Demo code of geometry-aware phase-compensation based angular spectrum method.", topic: "lensless", paper: "Kang et al., Optics Express 2026" },
  { name: "FPVS", url: "https://github.com/IIL-SNU/FPVS", desc: "Fourier ptychographic virtual staining.", topic: "vs", paper: "K. C. Lee et al., J. Phys. Photonics 2026" },
  { name: "RSSI", url: "https://github.com/IIL-SNU/RSSI", desc: "Single-shot temporal speckle correlation imaging using rolling shutter image sensors.", topic: "speckle", paper: "Yi et al., Optica 2022" },
  { name: "FP_ADMM", url: "https://github.com/IIL-SNU/FP_ADMM", desc: "Regularized (ADMM) Fourier ptychography reconstruction.", topic: "fp", paper: "K. C. Lee et al., Optics Express 2024" },
  { name: "Smartphone_FPM", url: "https://github.com/IIL-SNU/Smartphone_FPM", desc: "A smartphone-based Fourier ptychographic microscope using the display screen for illumination.", topic: "fp", paper: "K. C. Lee et al., ACS Photonics 2021" }
];
IIL.datasets = [
  { name: "WiderCam", url: "https://iilab.io/WiderCam", desc: "Wide field-of-view lensless camera dataset: 25,000 paired display-capture measurements (24,000 train, 1,000 test) from a compact phase-mask camera (Sony IMX708 sensor) imaging MIRFlickr images shown on an OLED display. Raw captures are 4608 x 2592, resized to 480 x 270 for training. Released with IFIN.", topic: "lensless", paper: "Bae et al., ECCV 2026", size: "6.57 GB (WiderCam.zip, Google Drive)", format: "ZIP of paired lensless measurements and aligned ground-truth images", page: "https://iilab.io/IFIN/" },
  { name: "Smartphone FPM example images", url: "https://drive.google.com/drive/folders/1tvjrqGT0v9ROgk3SlGM1GNMT-ugx-2vw", desc: "Raw image stacks captured with the smartphone Fourier ptychographic microscope (display-screen illumination) for a blood smear, a phase target and a USAF resolution target, with the Android app (APK) used to acquire them.", topic: "fp", paper: "K. C. Lee et al., ACS Photonics 2021", format: "Monochrome JPG image sequences (about 1-2 MB each), APK", code: "https://github.com/IIL-SNU/Smartphone_FPM" },
  { name: "RSSI in vivo mouse brain speckle images", url: "https://github.com/IIL-SNU/RSSI/tree/main/data", desc: "Raw single-shot rolling-shutter speckle images of mouse cerebral blood flow (two imaging sessions) used in the RSSI paper, the data cited in its data availability statement.", topic: "speckle", paper: "Yi et al., Optica 2022", size: "2 files, 18 MB each", format: "TIFF (Basler acA4024-29um)", code: "https://github.com/IIL-SNU/RSSI" },
  { name: "FPVS example FPM data", url: "https://github.com/IIL-SNU/FPVS/tree/main/data", desc: "Example full-field-of-view Fourier ptychographic microscopy inputs and reconstructions for the virtual staining code.", topic: "vs", paper: "K. C. Lee et al., J. Phys. Photonics 2026", size: "2 files, about 7 MB each", format: "MATLAB .mat", code: "https://github.com/IIL-SNU/FPVS" },
  { name: "Digital staining literature database", url: "https://doi.org/10.1186/s43074-023-00113-4", desc: "Table of all articles covered in the digital staining review with their categorizations, published as the review's supplementary files.", topic: "vs", paper: "Kreiss et al., PhotoniX 2023", format: "Supplementary ZIP files (Springer)" }
];
IIL.tools = [
  { name: "3d-models", url: "https://github.com/IIL-SNU/3d-models", desc: "3D printer models used in the lab's optical setups." },
  { name: "raspberrypi-cam", url: "https://github.com/IIL-SNU/raspberrypi-cam", desc: "Raspberry Pi camera code." },
  { name: "LED-matrix", url: "https://github.com/IIL-SNU/LED-matrix", desc: "Adafruit RGB matrix panel controller using Arduino (LED illumination)." }
];
IIL.repoOrg = "https://github.com/IIL-SNU";
