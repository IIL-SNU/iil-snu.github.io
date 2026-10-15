window.IIL = window.IIL || {};
IIL.research = IIL.research || [];
IIL.research.push(
{
  "key": "fp",
  "order": 1,
  "title": "Computational Microscopy",
  "short": "Fourier ptychography",
  "tagline": "Cheap optics plus smart computation: wide-field, high-resolution, label-free phase images from LED arrays, phone screens and single snapshots.",
  "summary": "A conventional microscope forces a trade-off: zoom in for detail and you lose the big picture, and transparent cells barely show up at all. Fourier ptychography sidesteps both limits. We light a sample from many angles with an LED array or a display screen, record a series of low-resolution images through an inexpensive, low-magnification lens, and let an algorithm stitch them together in Fourier space. The result is a wide-field, high-resolution image that also recovers the optical phase, revealing unstained cells and tissue in quantitative detail. We push this idea toward smaller, faster and richer instruments: smartphone microscopes, single-shot video-rate imaging and polarization-resolved maps of birefringence.",
  "keyFigure": {
    "src": "assets/research/fp/lily-root-birefringence-map.jpg",
    "alt": "Rainbow-colored birefringence map of a lily root-tip cross-section; cell walls glow in hues that change with their orientation on a black background.",
    "caption": "Birefringence map of a lily root-tip section recovered with vectorial Fourier ptychography. Hue encodes the orientation of the cell-wall fibers; brightness encodes retardance.",
    "credit": "Chae et al., Laser Photonics Rev. 2026"
  },
  "facts": [
    {
      "value": "75 fps",
      "label": "single-shot quantitative phase video of swimming microorganisms",
      "ref": "Yoon et al., Appl. Phys. Lett. 2025"
    },
    {
      "value": "2.5×",
      "label": "resolution beyond the objective's diffraction limit, from one snapshot",
      "ref": "Yoon et al., Appl. Phys. Lett. 2025"
    },
    {
      "value": "870 nm",
      "label": "half-pitch resolution over 2.1 × 1.6 mm² on a stand-alone smartphone microscope",
      "ref": "K. C. Lee et al., ACS Photonics 2021"
    },
    {
      "value": "1 camera",
      "label": "full Jones-matrix birefringence imaging with one monochrome sensor and no moving parts",
      "ref": "Chae et al., Laser Photonics Rev. 2026"
    }
  ],
  "projects": [
    {
      "slug": "smartphone-fp-microscope",
      "title": "Smartphone Fourier ptychographic microscope",
      "years": "2019–2021",
      "status": "published",
      "oneLiner": "A clip-on optics module turns a phone's camera, screen and processor into a wide-field, high-resolution microscope.",
      "body": [
        "Smartphones already carry an excellent camera, a bright programmable display and a fast processor. We combined all three into a stand-alone Fourier ptychographic microscope. A compact 3D-printed optics module guides light from the phone's own screen through the sample and into its built-in camera, so lighting up individual spots on the display becomes a programmable, angle-scanning illumination source.",
        "A custom Android app captures the image sequence, corrects for the geometry of the screen illumination and runs the reconstruction on the phone itself, returning amplitude, quantitative phase and color images. The device reaches 870 nm half-pitch resolution over a 2.1 × 1.6 mm² field of view, a space-bandwidth product that exceeds that of a regular benchtop microscope.",
        "We demonstrated it on blood smears and Pap smears, with an eye toward point-of-care screening in resource-limited settings. The reconstruction code is open source."
      ],
      "figures": [
        {
          "src": "assets/research/fp/smartphone-fp-microscope.jpg",
          "alt": "White 3D-printed microscope module mounted on a smartphone whose screen shows a stained tissue image.",
          "caption": "The smartphone FP microscope: a 3D-printed optics module on a phone whose display provides the programmable illumination and whose camera records the images.",
          "credit": "K. C. Lee et al., ACS Photonics 2021"
        },
        {
          "src": "assets/research/fp/smartphone-fp-blood-smear-amplitude-phase.jpg",
          "alt": "Full field-of-view blood smear images in amplitude and phase with zoomed insets comparing blurry raw and sharp reconstructed red blood cells.",
          "caption": "Full field-of-view reconstruction of an unstained blood smear: amplitude (a) and phase (d). Insets compare raw images (b1, c1, e1, f1) with the FP reconstructions (b2, c2, e2, f2).",
          "credit": "K. C. Lee et al., ACS Photonics 2021"
        }
      ],
      "people": [
        "Kyung Chul Lee",
        "Kyungwon Lee",
        "Jaewoo Jung",
        "Se Hee Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. C. Lee, K. Lee, J. Jung, S. H. Lee, D. Kim, S. A. Lee, ACS Photonics 8, 1307 (2021)",
          "url": "https://doi.org/10.1021/acsphotonics.1c00350"
        },
        {
          "label": "Code: github.com/IIL-SNU/Smartphone_FPM",
          "url": "https://github.com/IIL-SNU/Smartphone_FPM"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/smartphone-fpm"
    },
    {
      "slug": "live-cell-fp-incubator",
      "title": "Live-cell phase imaging inside the incubator",
      "years": "2020–2022",
      "status": "archived",
      "oneLiner": "A compact LED-array microscope that sits inside a CO₂ incubator and records time-lapse phase images of thousands of unstained cells.",
      "body": [
        "Watching living cells usually means choosing between a wide view and fine detail, and often adding fluorescent labels that can disturb the cells. We built a miniaturized Fourier ptychographic microscope small enough to operate inside a standard CO₂ cell-culture incubator, using a low-magnification 4× objective, a machine-vision camera and an inexpensive LED matrix.",
        "Each time point is a short burst of images under different LED angles. Iterative phase retrieval on a GPU workstation then recovers a quantitative phase image across a field of roughly 4 mm × 3 mm with sub-micron resolution, a space-bandwidth product above 10⁸ pixels. Time-lapse sequences of unstained HeLa cells show individual cells migrating and changing shape without any labels.",
        "The system was designed with label-free drug screening and long-term monitoring of cell cultures in mind."
      ],
      "figures": [
        {
          "src": "assets/research/fp/live-cell-fp-full-fov-phase.jpg",
          "alt": "Wide grayscale phase image showing thousands of small bright cells scattered across a dark background.",
          "caption": "Full field-of-view quantitative phase image of unstained live HeLa cells (about 4 mm across) recovered by the incubator FP microscope.",
          "credit": "Kyungwon Lee et al., IIL lab data"
        },
        {
          "src": "assets/research/fp/live-cell-fp-phase-detail.jpg",
          "alt": "Two zoomed grayscale phase images of spread-out cells with visible nuclei and thin edges.",
          "caption": "Zoomed phase views from a time-lapse of live cells: nuclei, nucleoli and thin cell edges are visible without any stain.",
          "credit": "Kyungwon Lee et al., IIL lab data"
        }
      ],
      "people": [
        "Kyungwon Lee",
        "Kyung Chul Lee",
        "Jaewoo Jung",
        "Seung Ah Lee"
      ],
      "refs": [],
      "legacyUrl": "https://imaging.snu.ac.kr/research/live-cell-fpm"
    },
    {
      "slug": "display-screen-fp",
      "title": "Display screens as programmable FP illumination",
      "years": "2021–2024",
      "status": "published",
      "oneLiner": "Using the tiny, bright pixels of an OLED display as a dense, programmable light source for high-resolution FP.",
      "body": [
        "Fourier ptychography is usually lit by an LED array, whose millimetre-scale LEDs must sit far from the sample to act like clean plane waves. Modern OLED displays offer something better: millions of micrometre-sized emitters that can be switched on in any pattern. We studied how to use a high-resolution display screen, placed just beneath the slide, as the illumination source.",
        "Because each emitter is small enough to be spatially coherent, the display can sit within millimetres of the sample, keeping the system compact while still reaching large illumination angles. We worked out design rules for emitter size, pitch and distance, corrected the position-dependent illumination angles across the field of view, and used multiplexed, randomized illumination patterns to cut the number of captures.",
        "The result is high-resolution amplitude, phase and color imaging lit by an off-the-shelf phone display, a key ingredient for compact and portable computational microscopes."
      ],
      "figures": [
        {
          "src": "assets/research/fp/display-screen-fp-illumination.jpg",
          "alt": "Rendering of a microscope objective above a slide lying on a phone screen with a grid of lit pixels, plus resolution-target images before and after reconstruction.",
          "caption": "A slide placed directly on a phone's OLED display; single sub-pixels (inset: RGB sub-pixel layout) are lit in a spiral scan. Bottom: raw low-resolution image of a resolution target, and the FP-reconstructed amplitude and phase.",
          "credit": "Kyungwon Lee et al., Opt. Lasers Eng. 2024"
        }
      ],
      "people": [
        "Kyungwon Lee",
        "Kyung Chul Lee",
        "Jaewoo Jung",
        "Hyesuk Chae",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. Lee, K. C. Lee, J. Jung, H. Chae, S. A. Lee, Opt. Lasers Eng. 177, 108121 (2024)",
          "url": "https://doi.org/10.1016/j.optlaseng.2024.108121"
        }
      ]
    },
    {
      "slug": "noise-robust-regularized-fp",
      "title": "Noise-robust FP with anisotropic regularization",
      "years": "2021–2024",
      "status": "published",
      "oneLiner": "A regularized reconstruction that recovers clean amplitude and phase from fewer, noisier FP measurements.",
      "body": [
        "Standard FP needs many heavily overlapping images with good signal, which slows acquisition and limits low-cost hardware such as phone-based microscopes. When measurements are sparse or noisy, the inverse problem becomes ill-posed and conventional algorithms produce artifacts.",
        "Together with collaborators at Chung-Ang University and Duke University, we formulated FP reconstruction as a regularized optimization problem. Anisotropic total-variation regularization on the object suppresses noise while preserving edges, and Tikhonov regularization stabilizes the estimated pupil, which describes the microscope's aberrations. The problem is solved efficiently with the alternating direction method of multipliers (ADMM).",
        "On resolution targets, blood smears and stained cytology samples, including data from our smartphone microscope, the method retrieved correct amplitude and phase images even with insufficient sampling and noisy measurements, opening the way to faster and cheaper acquisition."
      ],
      "figures": [
        {
          "src": "assets/research/fp/tv-regularized-fp-before-after.jpg",
          "alt": "Six image tiles: blurry raw resolution target, blood smear and blue-stained cells on top, and sharper regularized reconstructions below.",
          "caption": "Top: raw bright-field images (resolution target, blood smear) and an unregularized reconstruction (stained cytology). Bottom: the same fields reconstructed with TV regularization; the blood-smear result shows quantitative phase.",
          "credit": "K. C. Lee et al., Opt. Express 2024"
        }
      ],
      "people": [
        "Kyung Chul Lee",
        "Hyesuk Chae",
        "Kyungwon Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. C. Lee, H. Chae, S. Xu, K. Lee, R. Horstmeyer, S. A. Lee, B.-W. Hong, Opt. Express 32, 25343 (2024)",
          "url": "https://doi.org/10.1364/OE.529023"
        },
        {
          "label": "Code: github.com/IIL-SNU/FP_ADMM",
          "url": "https://github.com/IIL-SNU/FP_ADMM"
        }
      ]
    },
    {
      "slug": "single-shot-fp",
      "title": "Single-shot Fourier ptychography at video rate",
      "years": "2023–2025",
      "status": "published",
      "oneLiner": "Polarization-encoded illumination packs an FP dataset into one camera frame, enabling quantitative phase video at 75 fps.",
      "body": [
        "FP's need for many sequential images makes it too slow for moving samples. We encode several illumination angles into a single exposure: linear polarizers at four orientations tag different groups of LEDs, and a polarization camera, whose pixels separate the four polarization channels, records them all at once.",
        "A multiplexed reconstruction that uses both bright-field and dark-field information then recovers a high-resolution quantitative phase image from that one frame. On resolution targets and a histological sample, the method achieved 2.5 times the diffraction-limited resolution of the objective lens over a large field of view.",
        "Because only one frame is needed, imaging speed is limited only by the sensor readout. We recorded quantitative phase video of fast-swimming microorganisms at 75 frames per second."
      ],
      "figures": [
        {
          "src": "assets/research/fp/single-shot-fp-75fps.jpg",
          "alt": "Diagram of a microscope with polarized LED illumination and a polarization camera, k-space coverage plots, and a phase image of an elongated swimming microorganism.",
          "caption": "(a) LEDs behind 0°, 45°, 90° and 135° polarizers and a polarization camera; (b–d) one raw frame, the recovered phase of a resolution target and the k-space coverage of each channel. Right: a frame of 75 fps quantitative phase video of a swimming microorganism (inset: raw frame).",
          "credit": "Yoon et al., Appl. Phys. Lett. 2025"
        }
      ],
      "people": [
        "Hansol Yoon",
        "Hyesuk Chae",
        "Kyung Chul Lee",
        "Kyungwon Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "H. Yoon, H. Chae, K. C. Lee, K. Lee, S. A. Lee, Appl. Phys. Lett. 126, 123702 (2025)",
          "url": "https://doi.org/10.1063/5.0248101"
        }
      ]
    },
    {
      "slug": "vectorial-fp-pupil-multiplexing",
      "title": "Vectorial FP via pupil-plane multiplexing",
      "years": "2023–2026",
      "status": "published",
      "oneLiner": "A split polarizer in the pupil plane lets one monochrome camera map birefringence, orientation and phase at high resolution.",
      "body": [
        "Many biological structures, from plant cell walls to starch and crystals, are birefringent: they change the polarization of light in ways ordinary images miss. Measuring this usually requires rotating optics or specialized polarization sensors. Instead, we place a custom pupil-division aperture at the microscope's Fourier plane, made of two semicircular linear polarizers at 0° and 90°, so that each polarization channel passes through its own half of the pupil.",
        "A model-based reconstruction that uses these channel-dependent pupil functions as priors separates the encoded measurements. Combined with Fourier ptychography, it recovers amplitude and quantitative phase for both channels, yielding the full Jones matrix of the specimen with a single monochrome sensor and no mechanical scanning.",
        "We used it to map birefringence orientation and retardance across plant tissue sections, starch grains and malaria-infected red blood cells. The same pupil-multiplexing idea also works with spectral filters, offering a compact route to multichannel microscopy."
      ],
      "figures": [
        {
          "src": "assets/research/fp/vectorial-fp-pupil-multiplexing.jpg",
          "alt": "Optical layout with a scanning LED array, a pupil split into two polarizer halves and a camera, followed by reconstruction panels and a rainbow birefringence map of a star target.",
          "caption": "Scanning-LED FP illumination and a pupil divided into 0° and 90° linear-polarizer halves. The reconstruction recovers amplitude and phase for each channel, the Jones matrix and a 2D birefringence map of a Siemens-star target.",
          "credit": "Chae et al., Laser Photonics Rev. 2026"
        },
        {
          "src": "assets/research/fp/vectorial-fp-malaria-rbc.jpg",
          "alt": "Three panels of malaria-infected red blood cells: a black birefringence map with small colored spots, a gray amplitude map with cyan spots, and a pink color micrograph.",
          "caption": "Malaria-infected red blood cells: birefringent spots (parasite hemozoin) stand out in the birefringence and retardance maps, compared with a conventional color image (40×, 0.6 NA).",
          "credit": "Chae et al., Laser Photonics Rev. 2026"
        }
      ],
      "people": [
        "Hyesuk Chae",
        "Kyungwon Lee",
        "Yong Guk Kang",
        "Hansol Yoon",
        "Kyung Chul Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "H. Chae, K. Lee, Y. G. Kang, H. Yoon, K. C. Lee, S. A. Lee, Laser Photonics Rev. 20, e02183 (2026)",
          "url": "https://doi.org/10.1002/lpor.202502183"
        }
      ]
    },
    {
      "slug": "scaling-computational-microscopy",
      "title": "Scaling up: tomographic, gigapixel and multiscale computational microscopy",
      "years": "2022–2026",
      "status": "published",
      "oneLiner": "Collaborations and perspectives on expanding the space-bandwidth product: 3D polarization tomography, terabyte-scale topography and aperture synthesis.",
      "body": [
        "Every microscope is limited by its space-bandwidth product, the number of resolvable spots it can capture at once. With Roarke Horstmeyer's group at Duke University we have explored how computation can push this limit much further. Tensorial tomographic Fourier ptychography (T²oFu) adds a polarization-sensitive camera to an LED-array microscope and recovers the 3D permittivity tensor of thick samples, revealing refractive index, birefringence and fiber orientation in muscle and diseased heart tissue.",
        "STARCAM, a parallelized 54-camera microscope, captures terabytes of data per sample and uses a self-supervised neural reconstruction to produce 6-gigapixel all-in-focus images and 3D height maps over areas larger than 110 cm², with applications from cultural heritage to industrial inspection.",
        "In a 2026 commentary in Advanced Imaging, we discuss computational space-bandwidth product expansion through multiscale aperture synthesis and wavefront engineering, the common thread that also runs through the lab's own family of FP instruments."
      ],
      "figures": [
        {
          "src": "assets/research/fp/tensorial-tomographic-fp-setup.jpg",
          "alt": "Diagram of an LED-array microscope with a polarization camera, polarized intensity images, and four 3D blocks showing reconstructed permittivity tensor components.",
          "caption": "T²oFu: an LED array, a circular polarizer and a polarization camera record polarized intensity images that are fused into 3D permittivity-tensor reconstructions.",
          "credit": "Xu et al., Adv. Photonics 2024 (CC BY 4.0)"
        },
        {
          "src": "assets/research/fp/starcam-3d-topographic-microscope.jpg",
          "alt": "Camera-array schematic, a grid of data blocks, and a painting of a chair shown as an all-in-focus mosaic and a rainbow height map with zoom-ins.",
          "caption": "STARCAM: a 9 × 6 camera array scans a sample to build a multi-terabyte dataset, reconstructed into a 6-gigapixel all-in-focus mosaic and a 3D height map of a painted surface.",
          "credit": "Zhou et al., J. Big Data 2024 (CC BY 4.0)"
        },
        {
          "src": "assets/research/fp/fp-hardware-family.jpg",
          "alt": "Four renderings of microscope variants: an LED-array microscope, a phone-based microscope, a polarized-illumination microscope and a pupil-division microscope.",
          "caption": "The lab's FP hardware family: LED-array FP, smartphone/display-screen FP, single-shot polarization-multiplexed FP and pupil-division vectorial FP.",
          "credit": "K. C. Lee et al., ACS Photonics 2021; Kyungwon Lee et al., Opt. Lasers Eng. 2024; Yoon et al., Appl. Phys. Lett. 2025; Chae et al., Laser Photonics Rev. 2026"
        }
      ],
      "people": [
        "Kyung Chul Lee",
        "Yong Guk Kang",
        "Hyesuk Chae",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "S. Xu et al., Adv. Photonics 6, 026004 (2024)",
          "url": "https://doi.org/10.1117/1.AP.6.2.026004"
        },
        {
          "label": "K. C. Zhou et al., J. Big Data 11, 62 (2024)",
          "url": "https://doi.org/10.1186/s40537-024-00901-0"
        },
        {
          "label": "Y. G. Kang, H. Chae, S. A. Lee, Advanced Imaging 3, 033001 (2026) [Commentary]",
          "url": "https://doi.org/10.3788/AI.2026.30001"
        }
      ]
    },
    {
      "slug": "chipscale-lensless-microscopy",
      "title": "Chip-scale lensless microscopy (PhD roots at Caltech)",
      "years": "2009–2014",
      "status": "archived",
      "oneLiner": "Microscopes without lenses: cells imaged directly on an image-sensor chip, from flowing blood to sunlit smartphones.",
      "body": [
        "Before the lab existed, Prof. Lee's PhD work at Caltech (in Changhuei Yang's group) asked how small and inexpensive a microscope could be. In chip-scale microscopy the sample sits directly on a CMOS image sensor and casts a shadow onto its pixels; sequences of slightly shifted shadow images are then combined by pixel super-resolution to beat the pixel-size limit.",
        "The optofluidic microscope imaged cells flowing through a microchannel on the sensor, and its color version picked out malaria parasites in stained red blood cells. The ePetri dish turned the sensor into a culture substrate for continuous, wide-field monitoring of growing and motile cells; a silo-filter sensor brought fluorescence imaging to the chip; and a smartphone version used sunlight and the tilting phone itself to reach sub-micron resolution over a field of several square millimetres.",
        "The idea of replacing optics with sensors and computation still runs through the lab's work on Fourier ptychography and lensless cameras."
      ],
      "figures": [
        {
          "src": "assets/research/fp/chipscale-color-ofm-malaria.jpg",
          "alt": "Grid of red, green, blue and combined color images of an infected and a healthy red blood cell.",
          "caption": "Color optofluidic microscope images of a Plasmodium falciparum-infected (schizont stage) and a naive red blood cell, combined from red, green and blue shadow images.",
          "credit": "S. A. Lee et al., PLoS ONE 2011"
        },
        {
          "src": "assets/research/fp/chipscale-smartphone-sunlight-microscope.jpg",
          "alt": "A hand holding a smartphone toward the sun, the phone's exposed image sensor, and the reconstruction from low-resolution shadow images to sharp red blood cells.",
          "caption": "Smartphone chip-scale microscope: shadow images captured under sunlight while tilting the phone are combined by pixel super-resolution into a high-resolution image of red blood cells.",
          "credit": "S. A. Lee & C. Yang, Lab Chip 2014"
        },
        {
          "src": "assets/research/fp/chipscale-epetri-motility.jpg",
          "alt": "Two fields of microorganism tracks and bar charts of cell motility and aspect ratio for two cultures.",
          "caption": "ePetri: tracks of motile microorganisms (Euglena) cultured on an image sensor, with motility and morphology statistics for two cultures.",
          "credit": "S. A. Lee et al., Lab Chip 2012"
        }
      ],
      "people": [
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "G. Zheng*, S. A. Lee*, S. Yang*, C. Yang, Lab Chip 10, 3125 (2010)",
          "url": "https://doi.org/10.1039/c0lc00213e"
        },
        {
          "label": "S. A. Lee et al., PLoS ONE 6, e26127 (2011)",
          "url": "https://doi.org/10.1371/journal.pone.0026127"
        },
        {
          "label": "G. Zheng, S. A. Lee, Y. Antebi, M. B. Elowitz, C. Yang, PNAS 108, 16889 (2011)",
          "url": "https://doi.org/10.1073/pnas.1110681108"
        },
        {
          "label": "S. A. Lee, G. Zheng, N. Mukherjee, C. Yang, Lab Chip 12, 2385 (2012)",
          "url": "https://doi.org/10.1039/c2lc40090a"
        },
        {
          "label": "S. A. Lee, X. Ou, J. E. Lee, C. Yang, Opt. Lett. 38, 1817 (2013)",
          "url": "https://doi.org/10.1364/OL.38.001817"
        },
        {
          "label": "S. A. Lee, C. Yang, Lab Chip 14, 3056 (2014)",
          "url": "https://doi.org/10.1039/c4lc00523f"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/copy-of-chipscale-microscopy"
    }
  ],
  "demoIdea": "\"Synthetic-aperture playground\": a two-pane Canvas/WebGL toy that runs Fourier ptychography live in the browser. A hidden 256 × 256 complex test object (amplitude from a resolution target, phase from a cell-like pattern) sits under a virtual 13 × 13 LED grid. Clicking or sweeping LEDs lights them; each lit LED draws a pupil circle at the matching offset in a Fourier-space panel and shows the blurry low-resolution intensity image it would produce (computed with a small JS FFT). A \"Reconstruct\" button runs a few iterations of the standard FP update in a Web Worker, so visitors watch the synthetic aperture fill in and the hidden phase emerge as a sharp image. Sliders for LED overlap and noise level show when plain reconstruction breaks down and a TV-regularized update rescues it, and a \"single-shot\" toggle groups the LEDs into four polarization colors to illustrate packing one dataset into one frame. Everything is computed client-side, with no server."
},
{
  "key": "vs",
  "order": 2,
  "title": "Virtual Staining",
  "short": "Virtual staining",
  "tagline": "Turning label-free phase images of unstained tissue into familiar histology stains, without chemicals.",
  "summary": "Pathologists read tissue through chemical stains such as hematoxylin and eosin (H&E). Staining is slow, consumes tissue and reagents, varies from lab to lab, and fades over the years. Unstained tissue is nearly transparent, but it still delays light by an amount set by its local density and thickness. Our Fourier ptychographic microscopes measure this optical phase quantitatively across whole slides, and deep neural networks learn to translate it into the colors of a stained slide. We use this to restore faded archival slides digitally, to co-design illumination and networks so that a slide region is scanned in seconds, and to explore stains beyond H&E, working with pathologists at Severance Hospital.",
  "keyFigure": {
    "src": "assets/research/vs/faded-slide-virtual-restaining-concept.jpg",
    "alt": "A hand pulls a glass slide from a hospital slide-archive drawer; the faded H&E slide is nearly colorless, and a neural network turns its gray phase image into a vividly re-stained pink-and-purple tissue image.",
    "caption": "Phase-to-color virtual re-staining: an archived slide whose H&E stain has faded is imaged label-free, and a neural network converts its quantitative phase image into a re-stained H&E image.",
    "credit": "Chae et al., APL Photonics 2024"
  },
  "facts": [
    {
      "value": "~10 yr",
      "label": "old, faded H&E slides from a hospital archive restored by virtual re-staining",
      "ref": "Chae et al., APL Photonics 2024"
    },
    {
      "value": ">15×",
      "label": "faster slide scanning with 16 learned illumination patterns instead of 193 single LEDs",
      "ref": "K. C. Lee et al., J. Phys. Photonics 2026"
    },
    {
      "value": "~5 s",
      "label": "to scan a 4 mm × 3 mm tissue area, with about 20 ms of virtual staining per field of view",
      "ref": "K. C. Lee et al., J. Phys. Photonics 2026"
    }
  ],
  "projects": [
    {
      "slug": "nir-virtual-restaining",
      "title": "Restoring faded slides with NIR phase-to-color virtual staining",
      "years": "2021–2024",
      "status": "published",
      "oneLiner": "Re-staining decade-old, faded H&E slides digitally from near-infrared phase images, without touching the glass.",
      "body": [
        "Hematoxylin and eosin stains fade over time, so archived slides that may be needed again for diagnosis or research slowly lose their information. Physical re-staining is laborious and can damage the tissue, and digital color normalization fails once the stain is nearly gone.",
        "Our phase-to-color virtual re-staining framework sidesteps the dye altogether, because quantitative phase reflects the tissue's intrinsic physical properties. A multi-channel Fourier ptychographic microscope records pixel-aligned phase and color images at high throughput to train a generative adversarial network. Measuring the phase under near-infrared illumination minimizes the influence of absorption differences between stained and faded tissue, so training data can be collected without repeated imaging or physically altering the samples.",
        "The trained network performed comparably to or better than other digital staining methods, and it restored roughly decade-old, naturally faded urinary-bladder slides from hospital storage, in collaboration with the Department of Pathology at Severance Hospital."
      ],
      "figures": [
        {
          "src": "assets/research/vs/faded-bladder-slides-restained.jpg",
          "alt": "Grid of pink-and-purple virtually re-stained tissue sections with faded originals as insets, plus rows comparing faded color, gray phase and re-stained images.",
          "caption": "Virtually re-stained, naturally faded urinary-bladder slides. Top rows: whole-section results (insets: the faded slides as they look today) and zoomed views. Bottom: faded color image, NIR phase image and virtual re-staining for three regions each.",
          "credit": "Chae et al., APL Photonics 2024"
        },
        {
          "src": "assets/research/vs/restained-vs-chemical-he.jpg",
          "alt": "Side-by-side H&E tissue images labelled chemically stained reference and virtually re-stained, each with an enlarged inset.",
          "caption": "Virtual re-staining compared with the chemically stained reference of the same tissue region, with enlarged insets.",
          "credit": "Chae et al., APL Photonics 2024"
        }
      ],
      "people": [
        "Hyesuk Chae",
        "Jongho Kim",
        "Joonsung Jeon",
        "Kyungwon Lee",
        "Kyung Chul Lee",
        "Ji Ung Choi",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "H. Chae et al., APL Photonics 9, 106112 (2024)",
          "url": "https://doi.org/10.1063/5.0226277"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/nir-virtual-re-staining"
    },
    {
      "slug": "learned-illumination-virtual-staining",
      "title": "High-speed virtual staining with learned illumination",
      "years": "2022–2025",
      "status": "published",
      "oneLiner": "Co-designing LED illumination and a semi-supervised network to turn unstained slides into virtual H&E in seconds.",
      "body": [
        "For virtual staining to fit a clinical workflow, two bottlenecks have to go: collecting perfectly paired stained and unstained training images is costly, and capturing hundreds of FP images per field is slow. We tackled both with a hardware-software co-designed system.",
        "An illumination-optimization layer, trained end to end with the network, learns which combinations of the microscope's 193 LEDs carry the most useful information. Sixteen learned multiplexed patterns gave a more than 15-fold speed-up in scanning over using every LED, so a 4 mm × 3 mm tissue area is captured in about 5 s and virtually stained in about 20 ms per field of view. A multi-stage network first recovers phase from the raw images and then colorizes it, avoiding slow iterative phase retrieval at inference.",
        "A contrastive, semi-supervised scheme trains jointly on paired stained data and unpaired unstained slides, encouraging the network to rely on intrinsic tissue structure rather than absorption differences so that it generalizes to truly unstained tissue. The work was carried out with collaborators at Duke University, Yonsei University and Severance Hospital, and the code is on GitHub."
      ],
      "figures": [
        {
          "src": "assets/research/vs/learned-illumination-vs-overview.jpg",
          "alt": "Schematic of an LED-array microscope with learned red illumination patterns, raw gray measurements, a neural network and a large virtually stained tissue image, plus training pipeline diagrams.",
          "caption": "(a) Learned illumination patterns on the LED array produce a few multiplexed raw images that a network turns into virtual H&E across the full field of view. (b) A conventional supervised pipeline needs iterative phase reconstruction, chemical staining and image registration; (c) the semi-supervised scheme trains jointly on stained and unstained slides.",
          "credit": "K. C. Lee et al., J. Phys. Photonics 2026 (CC BY 4.0)"
        },
        {
          "src": "assets/research/vs/learned-illumination-raw-vs-virtual-he.jpg",
          "alt": "Blurry gray raw tissue image on the left and a crisp pink-and-purple virtual H&E image of the same field on the right, each with a 50 micrometre scale bar.",
          "caption": "A raw image captured under optimized illumination (left) and the resulting virtual H&E image of the same field (right).",
          "credit": "K. C. Lee et al., J. Phys. Photonics 2026"
        }
      ],
      "people": [
        "Kyung Chul Lee",
        "Hyesuk Chae",
        "Jongho Kim",
        "Yong Guk Kang",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. C. Lee et al., J. Phys. Photonics 8, 015025 (2026)",
          "url": "https://doi.org/10.1088/2515-7647/ae270f"
        },
        {
          "label": "Code: github.com/IIL-SNU/FPVS",
          "url": "https://github.com/IIL-SNU/FPVS"
        }
      ]
    },
    {
      "slug": "unpaired-ihc-3d-virtual-staining",
      "title": "Beyond H&E: unpaired, immunohistochemical and 3D virtual staining",
      "years": "2024–",
      "status": "ongoing",
      "oneLiner": "Learning virtual stains from unpaired slide collections and extending them to immunostains and 3D refractive-index data.",
      "body": [
        "Supervised virtual staining depends on pixel-matched image pairs, which are hard to obtain for every tissue type and stain. We are developing unsupervised approaches that learn from unpaired collections of label-free phase images and existing whole-slide images of stained tissue.",
        "Unpaired translation networks can hallucinate structures or shift colors, so our models add structural guidance: cycle-consistent training with an auxiliary, self-supervised edge network that keeps the virtual stain faithful to the tissue architecture seen in the phase image. Whole-slide results are being compared with chemical H&E staining of the same tissue.",
        "The same framework is being extended from H&E to immunohistochemical stains such as cytokeratin, smooth muscle actin and CD31, and toward 3D refractive-index tomograms. This work is in progress; our review on digital staining with deep learning surveys the wider field."
      ],
      "figures": [
        {
          "src": "assets/research/vs/phase-to-he-and-ihc-split-panels.jpg",
          "alt": "Four tissue images split diagonally: gray phase on one side and a virtual stain on the other, labelled H&E, cytokeratin, smooth muscle actin and CD31.",
          "caption": "Work in progress: label-free phase images (gray, lower left of each diagonal) translated into virtual H&E and immunohistochemical stains (cytokeratin, smooth muscle actin, CD31).",
          "credit": "Imaging Intelligence Lab, work in progress (shown at Optica Biophotonics Congress 2026)"
        }
      ],
      "people": [
        "Hyesuk Chae",
        "Jongho Kim",
        "Kyung Chul Lee",
        "Kyungwon Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "L. Kreiss et al., PhotoniX 4, 34 (2023) [Review: Digital staining in optical microscopy using deep learning]",
          "url": "https://doi.org/10.1186/s43074-023-00113-4"
        }
      ]
    }
  ],
  "demoIdea": "\"Stain slider\": a full-width WebGL viewer with a draggable divider over one tissue field. On one side, the label-free phase image is rendered as a softly lit 3D height map (phase read as optical thickness, with a draggable light direction); on the other, the virtual H&E of the same field. A toggle swaps between pairs: raw optimized-illumination image vs. virtual H&E, and chemically stained reference vs. virtual re-staining (prepared tiles: assets/research/vs/demo-raw-optimized-illumination.jpg, demo-virtual-he-from-raw.jpg, demo-reference-he-roi.jpg, demo-virtual-restained-roi.jpg). A second strip animates acquisition: a Canvas LED array flashes 193 single LEDs one by one next to 16 learned multiplexed patterns, with two clocks racing to show the published >15× scanning speed-up. All images are precomputed published results; no network runs in the browser."
}
);
