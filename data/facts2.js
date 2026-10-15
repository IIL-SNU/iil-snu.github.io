// Proposed replacement fact boxes (2026-10-02). Published results only.
// "ref" names the paper; where a number comes from the lab's talk decks rather than the abstract, the deck is named too.
window.IIL = window.IIL || {};
IIL.facts2 = {
  fp: [
    {
      value: "2.5×",
      label: "resolution beyond the objective's diffraction limit from a single snapshot, with phase video at 75 frames per second",
      ref: "H. Yoon et al., Appl. Phys. Lett. 126, 123702 (2025), abstract"
    },
    {
      value: "18 MP",
      label: "space-bandwidth product of a smartphone FP microscope (870 nm half-pitch over 2.1 × 1.6 mm²), more than a regular benchtop microscope",
      ref: "K. C. Lee et al., ACS Photonics 8, 1307 (2021); abstract gives 870 nm over 2.1 × 1.6 mm² and 'exceeding benchtop microscopes'; 18 MP is the figure stated in the lab's FP talk decks (e.g. FPM 2022, POSTECH 2025)"
    },
    {
      value: "4×",
      label: "space-bandwidth product of conventional LED-array FP, using a phone OLED display under the slide as the light source (synthetic NA ≈ 0.5)",
      ref: "Kyungwon Lee et al., Opt. Lasers Eng. 177, 108121 (2024); SBP 1.79 × 10⁷ px and NA ≈ 0.5 as reported in the lab's talk decks (KSPE Nov 2025, Fraunhofer/BISC 2024)"
    },
    {
      value: "6 gigapixels",
      label: "all-in-focus images with 3D height maps over more than 110 cm², from a 54-camera computational microscope (collaboration with Duke)",
      ref: "K. C. Zhou et al., J. Big Data 11, 62 (2024)"
    }
  ],
  fp_alternates: [
    {
      value: "620 nm",
      label: "resolved features (USAF group 9 element 5) in full Jones-matrix birefringence imaging with one monochrome camera and a polarizer film in the pupil",
      ref: "H. Chae et al., Laser Photonics Rev. 20, e02183 (2026); 620 nm value from the OBC 2026 / KSPE 2025 decks"
    },
    {
      value: "40%",
      label: "Fourier-space overlap still sufficient for artifact-free FP at SNR below 10 dB, with anisotropic TV regularization",
      ref: "K. C. Lee et al., Opt. Express 32, 25343 (2024); values from the 'Seeing the Invisible' and KSPE decks"
    }
  ],
  vs: [
    {
      value: "16 vs 200",
      label: "learned multiplexed LED patterns replace 200 single-LED captures: acquisition drops from over 300 s to under 10 s per field",
      ref: "K. C. Lee et al., J. Phys. Photonics 8, 015025 (2026); numbers from the OBC 2026 and LGES/Open Lab 2026 decks"
    },
    {
      value: "SSIM 0.80",
      label: "structural similarity of virtually re-stained faded H&E slides to well-stained references (color normalization: 0.26)",
      ref: "H. Chae et al., APL Photonics 9, 106112 (2024); PSNR 18.65 ± 3.87 dB, SSIM 0.80 and the comparison table as shown in the OBC/OPC 2026 decks"
    },
    {
      value: "~10 years",
      label: "of fading reversed: archived bladder slides from 2017 digitally re-stained from near-infrared phase, without touching the glass",
      ref: "H. Chae et al., APL Photonics 9, 106112 (2024)"
    }
  ],
  lensless: [
    {
      value: "1 exposure",
      label: "to fabricate a custom phase mask with any designed point-spread function by grayscale lithography",
      ref: "K. C. Lee et al., Optica 10, 72 (2023)"
    },
    {
      value: "4 Stokes",
      label: "parameters (full polarization state) recovered from one snapshot of a lensless camera, at video rate",
      ref: "N. Baek et al., APL Photonics 7, 116107 (2022)"
    },
    {
      value: "410–800 nm",
      label: "hyperspectral image stack from a single monochrome lensless snapshot",
      ref: "T. Kim et al., APL Photonics 8, 066109 (2023)"
    },
    {
      value: "25,000",
      label: "paired lensless/ground-truth images in the open WiderCam benchmark",
      ref: "D. Bae et al., ECCV 2026"
    }
  ],
  speckle: [
    {
      value: "1 frame",
      label: "blood-flow (decorrelation-time) map from a single rolling-shutter snapshot, with no high-speed camera",
      ref: "C. Yi et al., Optica 9, 1227 (2022)"
    },
    {
      value: "0.14–2.22 cm/s",
      label: "flow speeds measured beneath static tissue layers 0.12–1.56 mm thick in phantom validation",
      ref: "C. Yi et al., Biomed. Opt. Express 15, 1253 (2024)"
    },
    {
      value: "14×",
      label: "more distinct dicrotic notch than photoplethysmography (mean notch ratio 39.3 vs 2.8)",
      ref: "Y. Lee et al., Biomed. Opt. Express 15, 1540 (2024)"
    },
    {
      value: "4 cm",
      label: "source–detector separation for deep-tissue blood flow in human subjects with a 500 × 500 SPAD array",
      ref: "L. Kreiss et al., Neurophotonics (2025)"
    }
  ]
};
