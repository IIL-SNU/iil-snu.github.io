/* Research themes: Dynamic Speckle Imaging (order 4; renamed from "Speckle Imaging" 2026-10-15, PI) and Interactive Biology (order 5).
   Generated 2026-10-01. Public-safe: published or publicly presented work only. */
window.IIL = window.IIL || {};
IIL.research = IIL.research || [];
IIL.research.push(
{
  "key": "speckle",
  "order": 4,
  "title": "Dynamic Speckle Imaging",
  "short": "Speckle",
  "tagline": "Reading blood flow from the flicker of laser speckle, captured in a single camera frame.",
  "summary": "When laser light enters living tissue, moving red blood cells make the resulting speckle pattern flicker, and how fast it flickers reveals how fast blood flows. Measuring that directly usually takes cameras running at more than ten thousand frames per second. We turned an ordinary rolling-shutter image sensor, which reads out its rows microseconds apart, into that high-speed camera: with elongated speckles and the right physical model, one snapshot reveals both the flow speed and how much of the tissue is moving. Building on this rolling-shutter speckle imaging (RSSI), we map cerebral blood flow, record pulse waveforms from a fingertip, and use physics-guided neural networks for real-time analysis, a path toward low-cost, contrast-free monitoring of circulation.",
  "keyFigure": {
    "src": "assets/research/speckle/rssi-mouse-cortex-maps.jpg",
    "alt": "Three false-color maps of the same patch of mouse cortex showing branching blood vessels: dynamic scattering fraction, speckle decorrelation time, and blood-flow index.",
    "caption": "Mouse cortex imaged through a cranial window with RSSI: the fraction of moving scatterers (ρ), the speckle decorrelation time (τc), and the blood-flow index 1/τc, which lights up the vessels.",
    "credit": "Yi et al., Optica 2022"
  },
  "facts": [
    {
      "value": "12 µs",
      "label": "row-to-row delay of a standard rolling-shutter sensor, used as a built-in high-speed clock",
      "ref": "Yi et al., Biomed. Opt. Express 2024"
    },
    {
      "value": "0.14–2.22 cm/s",
      "label": "phantom flow-speed range validated beneath static tissue layers 0.12–1.56 mm thick",
      "ref": "Yi et al., Biomed. Opt. Express 2024"
    },
    {
      "value": "14×",
      "label": "more distinct dicrotic notch than photoplethysmography (mean notch ratio 39.3 vs 2.8)",
      "ref": "Lee et al., Biomed. Opt. Express 2024"
    },
    {
      "value": "4 cm",
      "label": "source–detector separation for deep-tissue blood flow with a 500 × 500 SPAD array",
      "ref": "Kreiss et al., Neurophotonics 2025"
    }
  ],
  "projects": [
    {
      "slug": "rolling-shutter-speckle-imaging",
      "title": "Rolling-shutter speckle imaging (RSSI)",
      "years": "2022–2023",
      "status": "published",
      "oneLiner": "An ordinary rolling-shutter camera captures fast speckle dynamics, and thus blood flow, in a single snapshot.",
      "body": [
        "Laser speckle imaging maps blood flow without dyes, but quantitative measurements require following how the speckle decorrelates over microseconds, which normally means costly cameras running above ten thousand frames per second. RSSI sidesteps this by exploiting a quirk of most CMOS sensors: their rows are exposed one after another, microseconds apart.",
        "An elliptical aperture in the Fourier plane stretches each speckle grain vertically so that it spans many rows. Neighboring rows therefore sample the same speckle at slightly different times, and the row-by-row intensity correlation within one frame reveals the local decorrelation time τc. Scanning this analysis across the image yields wide-field flow maps, corrected for light scattered by static tissue.",
        "We derived the theory, validated it with simulations and flow phantoms, and imaged cerebral blood flow in mice through a cranial window together with Prof. Euiheon Chung's group at GIST, a low-cost route to quantitative in vivo flow imaging."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/rssi-principle-optica2022.jpg",
          "alt": "Schematic of rolling shutter speckle imaging: laser diode illuminating a mouse, an elliptical aperture producing an elongated point-spread function, a rolling-shutter camera turning time-varying speckle into one snapshot, a row-correlation curve, and a decorrelation-time map of mouse cortex.",
          "caption": "How RSSI works: an elliptical aperture elongates the speckle, the rolling shutter turns image rows into time samples, and the row-by-row intensity correlation g_r(n) is fitted window by window to produce a τc map of mouse cortex.",
          "credit": "Yi et al., Optica 2022"
        }
      ],
      "people": [
        "Changyoon Yi",
        "Jaewoo Jung",
        "Kyung Chul Lee",
        "Sangjun Byun",
        "Yujin Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "C. Yi et al., Optica 9, 1227 (2022)",
          "url": "https://doi.org/10.1364/OPTICA.465361"
        },
        {
          "label": "C. Yi et al., Proc. SPIE PC11974, Biomedical Applications of Light Scattering XII (2022)",
          "url": "https://doi.org/10.1117/12.2608042"
        },
        {
          "label": "C. Yi et al., Optica Imaging Congress (COSI), CW5B.7 (2023)",
          "url": "https://doi.org/10.1364/COSI.2023.CW5B.7"
        }
      ]
    },
    {
      "slug": "spatiotemporal-speckle-correlation-model",
      "title": "A complete spatiotemporal speckle-correlation model",
      "years": "2023–2024",
      "status": "published",
      "oneLiner": "Physics that accounts for exposure time and static tissue, extending RSSI's accuracy and measurable range.",
      "body": [
        "A single RSSI frame becomes a measurement only once we know how the row-by-row correlation should behave for a given flow, in tissue where moving blood is mixed with static scatterers. Our first model assumed an instantaneous exposure, but real sensors integrate light for longer than the delay between rows.",
        "We derived a complete spatiotemporal intensity-correlation model that includes the detector's finite exposure time together with static scattering, and that holds for every correlation time a rolling shutter can sample. Using all data points correctly improves both the accuracy and the range of the measured decorrelation time and dynamic scattering fraction.",
        "Experiments with tissue-mimicking layers from 0.12 to 1.56 mm thick over blood-mimicking flows of 100 to 1600 mL/hr validated the model and clarified how design choices such as exposure time set the measurable range of speckle dynamics."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/rssi-flow-phantom-validation.png",
          "alt": "Line plot of blood-flow index versus pumped flow rate from 200 to 1200 mL/hr, rising steadily for a bare flow channel and for tissue-mimicking layers 0.18 to 0.92 mm thick.",
          "caption": "Flow-phantom validation: the blood-flow index 1/τc rises steadily with the pumped flow rate, both for a bare channel and beneath static tissue-mimicking layers of different thickness.",
          "credit": "Yi et al., Optica Imaging Congress (COSI) 2023"
        }
      ],
      "people": [
        "Changyoon Yi",
        "Sangjun Byun",
        "Yujin Lee",
        "Kyung Chul Lee",
        "Donggeon Bae",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "C. Yi et al., Biomed. Opt. Express 15, 1253 (2024)",
          "url": "https://doi.org/10.1364/BOE.514497"
        },
        {
          "label": "C. Yi et al., Proc. SPIE PC12853, High-Speed Biomedical Imaging and Spectroscopy IX (2024)",
          "url": "https://doi.org/10.1117/12.3009715"
        }
      ]
    },
    {
      "slug": "rolling-shutter-speckle-plethysmography",
      "title": "Rolling-shutter speckle plethysmography (RSSPG)",
      "years": "2023–2024",
      "status": "published",
      "oneLiner": "Non-contact pulse waveforms from a camera that separate blood-flow speed from blood-volume changes.",
      "body": [
        "Photoplethysmography (PPG), the green light on the back of a smartwatch, tracks how much blood lies under the sensor but not how fast it moves. RSSPG applies rolling-shutter speckle imaging to a sequence of frames of a fingertip and extracts, frame by frame, both the decorrelation time, which follows flow speed, and the dynamic scattering fraction, which follows blood volume.",
        "The result is a pair of clean pulse waveforms from an ordinary camera running at 140 frames per second. The dicrotic notch, a subtle feature linked to arterial stiffness, appears far more distinctly than in a commercial PPG sensor, and the signals track physiological changes such as reduced flow during a cold-pressor test and a faster pulse after exercise. A simplified correlation measure also allows fast, motion-robust analysis without model fitting."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/rsspg-setup-waveform.png",
          "alt": "Rendering of the RSSPG optics (laser diode, objective, elliptical aperture, tube lens, rolling-shutter camera) aimed at a fingertip, with raw speckle frames and the resulting pulse waveform.",
          "caption": "RSSPG setup: a 4f imaging system with an elliptical aperture views a laser-lit fingertip; a moving-window analysis of each raw speckle frame produces a time-series pulse waveform.",
          "credit": "Lee et al., Biomed. Opt. Express 2024"
        },
        {
          "src": "assets/research/speckle/rsspg-vs-ppg-dicrotic-notch.png",
          "alt": "Two waveform plots over five seconds, RSSPG on the left and PPG on the right, each with a zoomed inset of the dicrotic notch; the notch is much deeper in the RSSPG trace.",
          "caption": "The dicrotic notch, magnified in the insets, stands out clearly in RSSPG but is barely visible in conventional PPG recorded at the same time.",
          "credit": "Lee et al., Optica Imaging Congress (COSI) 2023"
        },
        {
          "src": "assets/research/speckle/rsspg-cold-pressor.png",
          "alt": "RSSPG waveforms over seven seconds for a relaxed hand and during an ice cold-pressor test; the ice trace sits markedly lower.",
          "caption": "Under a cold-pressor (ice) challenge, the RSSPG signal drops relative to the relaxed state, reflecting reduced blood flow.",
          "credit": "Lee et al., Optica Imaging Congress (COSI) 2023"
        }
      ],
      "people": [
        "Yujin Lee",
        "Sangjun Byun",
        "Changyoon Yi",
        "Jaewoo Jung",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "Y. Lee et al., Biomed. Opt. Express 15, 1540 (2024)",
          "url": "https://doi.org/10.1364/BOE.511755"
        },
        {
          "label": "Y. Lee et al., Optica Imaging Congress (COSI), CW5B.2 (2023)",
          "url": "https://doi.org/10.1364/COSI.2023.CW5B.2"
        }
      ]
    },
    {
      "slug": "physics-guided-speckle-network",
      "title": "Physics-guided neural networks for real-time speckle imaging",
      "years": "2024–2026",
      "status": "published",
      "oneLiner": "BiSNet fuses deep learning with the RSSI forward model for clean, single-shot, real-time blood-flow maps.",
      "body": [
        "Single-shot RSSI trades statistics for speed: each map is estimated from relatively few speckle grains, so pixel-wise curve fitting is both noisy and slow. Averaging many frames helps, but it gives up the very time resolution that makes RSSI attractive.",
        "Our Bifurcated Speckle Network (BiSNet) analyzes the raw speckle image and its row-by-row correlations in two parallel branches. Its receptive field is deliberately kept local, so it judges flow from speckle fluctuations instead of memorizing the shapes of phantoms, and a physics-guided loss builds the RSSI forward model directly into training. Trained on microfluidic phantoms, it generalizes to in vivo cranial-window data and produces real-time maps of flow and dynamic scattering fraction.",
        "A complementary, optimization-based single-shot reconstruction is in preparation."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/bisnet-single-shot-vs-fitting.jpg",
          "alt": "Two-by-two grid of mouse cortex maps: noisy pixel-wise fitting results on the left and smooth, vessel-resolving network outputs on the right, for dynamic fraction and blood-flow index.",
          "caption": "One snapshot of mouse cortex, two analyses: pixel-wise model fitting (left) versus the physics-guided network (right), for the dynamic fraction ρ (top) and the blood-flow index 1/τc (bottom).",
          "credit": "Byun et al., SPIE Photonics West 2025"
        }
      ],
      "people": [
        "Sangjun Byun",
        "Changyoon Yi",
        "Donggeon Bae",
        "Yong Guk Kang",
        "Jongho Kim",
        "Hojin Chang",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "S. Byun et al., J. Phys. Photonics (2026), accepted manuscript",
          "url": "https://doi.org/10.1088/2515-7647/ae99ba"
        },
        {
          "label": "S. Byun et al., Proc. SPIE PC13333, Computational Optical Imaging and Artificial Intelligence in Biomedical Sciences II (2025)",
          "url": "https://doi.org/10.1117/12.3041720"
        }
      ]
    },
    {
      "slug": "speckle-eye-movement-tracking",
      "title": "Speckle-based eye-movement tracking",
      "years": "2025–",
      "status": "ongoing",
      "oneLiner": "Detecting rapid eye movements from the speckle pattern recorded in a single rolling-shutter frame.",
      "body": [
        "Fast eye movements, from saccades to the tiny microsaccades made while fixating, carry information about attention and neurological health, yet capturing them usually calls for high-speed cameras. We are extending rolling-shutter speckle imaging to the eye: laser light scattered from the white of the eye (the sclera) forms elongated speckles on a rolling-shutter sensor.",
        "When the eye moves, the speckle pattern shifts while the rows are being read out, so the motion is written into the geometry of a single frame. The tilt of the speckle encodes horizontal velocity, and a change in speckle length encodes vertical velocity. A local autocorrelation analysis turns each snapshot into a 2D velocity map with modest computation and inexpensive hardware.",
        "First experiments with an eye phantom on a motorized stage and in vivo were presented at SPIE-ABC 2025, and the work is ongoing."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/speckle-eye-tracking-principle.jpg",
          "alt": "Diagram: rolling-shutter readout timing, elliptical aperture and elongated point-spread function, a snapshot speckle image with slanted speckles, its local autocorrelation with tilt angle θ, velocity formulas, and a 2D vector map.",
          "caption": "Eye motion during readout slants the elongated speckles in a single snapshot; the tilt and length of the local autocorrelation peak give horizontal and vertical velocity, assembled into a 2D vector map.",
          "credit": "Byun et al., SPIE-ABC 2025 (poster)"
        }
      ],
      "people": [
        "Sangjun Byun",
        "Changyoon Yi",
        "Hojin Chang",
        "Yong Guk Kang",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "S. Byun et al., “Rapid eye movement detection via rolling shutter speckle imaging,” SPIE-ABC 2025, Jeju (poster)"
        }
      ]
    },
    {
      "slug": "parallelized-diffuse-correlation-spectroscopy",
      "title": "Deep-tissue blood flow with massively parallel DCS",
      "years": "2025",
      "status": "published",
      "oneLiner": "A collaboration using a 500 × 500 SPAD array to sense adult brain blood flow through scalp and skull.",
      "body": [
        "Speckle fluctuations also reveal blood flow far below the surface. Diffuse correlation spectroscopy (DCS) measures how laser light flickers after diffusing through centimeters of tissue, but in adults the light that reaches the brain, beneath scalp and skull, returns faint and noisy.",
        "In a collaboration led by Prof. Roarke Horstmeyer's group at Duke University, we contributed to a study of parallelized DCS that averages hundreds of thousands of independent measurements from a 500 × 500 single-photon avalanche diode (SPAD) array. The system measured pulsatile cerebral and muscular blood flow at source–detector separations of up to 4 cm, and data from 15 adults showed functional changes in cerebral blood flow during a memory task. The work complements our camera-based speckle methods with a route to deeper tissue."
      ],
      "figures": [
        {
          "src": "assets/research/speckle/parallel-dcs-concept.png",
          "alt": "Illustration of a head cross-section with scalp, skull, CSF and cortex; banana-shaped light paths run from a laser source to a SPAD array camera several centimeters away, with an inset of noisy versus averaged autocorrelation curves.",
          "caption": "Concept of parallelized DCS: diffuse light from the source samples cortical blood flow and returns to a large SPAD array; averaging many pixels turns noisy single-pixel autocorrelations into a usable signal. Illustration, not a figure from the paper.",
          "credit": "IIL illustration after Kreiss et al., Neurophotonics 2025"
        }
      ],
      "people": [
        "Kyung Chul Lee",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "L. Kreiss et al., Neurophotonics 12, 025007 (2025)",
          "url": "https://doi.org/10.1117/1.NPh.12.2.025007"
        }
      ]
    }
  ],
  "demoIdea": "“Be the rolling shutter”: a WebGL canvas synthesizes a live speckle field by passing random phase screens through an elliptical pupil (FFT in a fragment shader or a small JS FFT on a 256 × 256 grid) and evolving them at a decorrelation time set by a flow-speed slider, with a second slider for the static fraction ρ. A toggle switches between a global-shutter view, where fast flow simply blurs, and a rolling-shutter view that reads one row per simulated 12 µs tick, so visitors watch elongated speckles shorten as the flow speeds up. A live plot shows the row-by-row correlation g_r(n) with a fitted τc, and dragging a window across a synthetic vessel network builds up a 1/τc map pixel by pixel. A “pulse” mode modulates the flow with a heartbeat to trace an RSSPG-style waveform, dicrotic notch included."
},
{
  "key": "hbi",
  "order": 5,
  "title": "Interactive Biology",
  "short": "Interactive Bio",
  "tagline": "Playful, hands-on encounters with living microorganisms through microscopes, light and interactive media.",
  "summary": "Microscopic life is all around us, yet almost nobody gets to interact with it. Human-biology interaction (HBI) asks how people might play, create and learn with real living cells rather than simulations. Our systems couple a microscope to a projector: drawings on a touchscreen or hand gestures become patterns of light, and light-sensitive Euglena cells respond in real time. These platforms have become museum exhibits, immersive installations, biotic games and collaborative artworks, and they informed a review that maps the emerging field of micro-HBI. Kept here as a legacy theme, this work grew from the same expertise in optics and microscopy that drives our imaging research, and it continues to shape how we share science with the public.",
  "keyFigure": {
    "src": "assets/research/hbi/microaquarium-installation.jpg",
    "alt": "Two visitors, seen from behind, point at giant green Euglena cells projected on a wall-sized screen.",
    "caption": "MicroAquarium: visitors' hand gestures become light patterns that steer living Euglena, shown live on a wall-sized display.",
    "credit": "Lee et al., CHI EA 2020"
  },
  "facts": [
    {
      "value": "Museum-ready",
      "label": "Trap it! studied as a science-museum exhibit, with and without facilitators",
      "ref": "Lee et al., ACM CHI 2015"
    },
    {
      "value": "n = 18",
      "label": "user study: the Pac-Euglena biotic game was fun, sparked curiosity and taught players about Euglena",
      "ref": "Lam et al., ACM CHI 2020"
    },
    {
      "value": "Outstanding Article",
      "label": "award from Frontiers in Computer Science for the Micro-HBI review",
      "ref": "Lee & Riedel-Kruse, Front. Comput. Sci. 2022"
    }
  ],
  "projects": [
    {
      "slug": "trap-it",
      "title": "Trap it!: tangible interaction with living microorganisms",
      "years": "2015–2019",
      "status": "archived",
      "oneLiner": "Draw on a touchscreen and real Euglena cells under the microscope respond to your light patterns.",
      "body": [
        "Trap it! lets anyone interact with real, living microorganisms. A touchscreen shows a live microscope view of Euglena; whatever a visitor draws is projected back into the microscope as a pattern of light, and the light-sensitive cells respond in real time, so they can be herded, corralled or trapped inside a drawn ring. An eyepiece on the instrument lets visitors confirm with their own eyes that the cells are real.",
        "Developed during Prof. Lee's postdoctoral work with Prof. Ingmar Riedel-Kruse at Stanford, the system was built to be robust enough for unattended use and flexible enough for art, games and simple experiments. Studies in a science museum, with and without facilitators, found a low barrier to entry and lively conversation among visitors.",
        "The same ideas carried over to immersive, full-body museum exhibits that put visitors in direct contact with living microbes, reported in Nature Biotechnology."
      ],
      "figures": [
        {
          "src": "assets/research/hbi/trapit-system-overview.jpg",
          "alt": "Diagram of the Trap it! microscope with camera, eyepiece, microfluidic chamber, projector and touchscreen PC, plus layered projector, physical and UI views and photos of the eyepiece view, a Euglena cell and the touchscreen.",
          "caption": "System overview: a projector, camera, eyepiece and microfluidic chamber are combined so that touchscreen drawings are projected as light onto Euglena, while the composite view returns to the user.",
          "credit": "Lee et al., ACM CHI 2015"
        },
        {
          "src": "assets/research/hbi/trapit-light-trap-sequence.jpg",
          "alt": "Four photos of a touchscreen: a user draws a glowing ring of light around a circled Euglena cell, which is then trapped inside it.",
          "caption": "Trapping a cell: a user draws a ring of light around a swimming Euglena, which stays confined inside.",
          "credit": "Lee et al., ACM CHI 2015"
        }
      ],
      "people": [
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "S. A. Lee et al., Proc. ACM CHI 2015, 2593–2602 (2015)",
          "url": "https://doi.org/10.1145/2702123.2702220"
        },
        {
          "label": "S. A. Lee et al., Proc. ACM TEI 2015, 273–280 (2015)",
          "url": "https://doi.org/10.1145/2677199.2680561"
        },
        {
          "label": "A. T. Lam et al., Nat. Biotechnol. 37, 1238 (2019)",
          "url": "https://doi.org/10.1038/s41587-019-0272-2"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/trapit"
    },
    {
      "slug": "microaquarium",
      "title": "MicroAquarium: an immersive installation with living microorganisms",
      "years": "2020",
      "status": "archived",
      "oneLiner": "Mid-air hand gestures steer real Euglena, displayed at human scale as a living aquarium.",
      "body": [
        "MicroAquarium turns a microscope into a room-sized aquarium of living cells. A custom light-projection microscope holds phototactic Euglena; a gesture sensor tracks visitors' hands, and their mid-air movements are converted into light patterns projected onto the cells. The microscope view fills a large immersive screen, with the visitors' own images overlaid, so people and cells meet at the same scale.",
        "Instead of scripted games, the installation invites free-form, natural play: several people can interact at once with their whole bodies, inventing their own ways to guide the swimmers. Drawing with gestures rather than touching an image of the cells also discourages the urge to poke at living organisms, a deliberate choice that keeps the interaction gentle. The result bridges the vast gap in size and senses between people and microbes and opens up exploratory, inter-species play."
      ],
      "figures": [
        {
          "src": "assets/research/hbi/microaquarium-installation.jpg",
          "alt": "Two visitors, seen from behind, point at giant green Euglena cells projected on a wall-sized screen.",
          "caption": "Visitors explore a wall-sized live view of Euglena and steer the cells with gestures.",
          "credit": "Lee et al., CHI EA 2020"
        },
        {
          "src": "assets/research/hbi/microaquarium-full-body-play.jpg",
          "alt": "Two frames of visitors swinging their arms in front of a projection where their silhouettes appear among swimming cells; arrows mark cells changing direction.",
          "caption": "Full-body play: visitors' silhouettes share the screen with the cells, and their arm movements send the swimmers in new directions (arrows).",
          "credit": "Lee et al., CHI EA 2020"
        }
      ],
      "people": [
        "Kyungwon Lee",
        "Jaewoo Jung",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. Lee et al., CHI 2020 Extended Abstracts, 1–4 (2020)",
          "url": "https://doi.org/10.1145/3334480.3383164"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/microaquarium"
    },
    {
      "slug": "remember",
      "title": "ReMember: recalling companion animals with biosignals",
      "years": "2021",
      "status": "archived",
      "oneLiner": "An installation that brings a late pet's recorded heartbeat to life around its cremation stones.",
      "body": [
        "ReMember is an interactive installation for people who have lost a companion animal. It brings together two kinds of keepsake: the cremation stones that many owners keep, and recordings of their pet's heartbeat. The heartbeat is turned into sound and a pulsing ring of projected light whose color, brightness and size follow its rhythm.",
        "Ultrasonic sensors detect when a visitor's hands approach the stones, and the projected heartbeat responds, as if the touch briefly brings the animal back to life. Visitors said the living signal and the interactivity deepened their reminiscence, suggesting that digitized biosignals can become a new form of legacy that supports continuing bonds after pet loss. The work, created with Prof. Hyun Jean Lee of the Yonsei Graduate School of Communication and Arts, was presented at SIGGRAPH 2021."
      ],
      "figures": [
        {
          "src": "assets/research/hbi/remember-pipeline.jpg",
          "alt": "Four-step diagram with photos: recording a dog's heartbeat with a microphone, audiovisualizing it as a projected ring, installing ultrasonic sensors with a Raspberry Pi under cremation stones, and hands interacting with the glowing ring.",
          "caption": "From heartbeat to installation: recording the physiological signal, turning it into sound and light, sensing visitors' hands, and responding to their touch.",
          "credit": "Yi et al., SIGGRAPH 2021"
        },
        {
          "src": "assets/research/hbi/remember-installation.jpg",
          "alt": "Photos of two pink cremation stones on a white box encircled by a projected ring of light, hands touching the stones as the ring glows, and a wall of printed photographs of dogs and a cat.",
          "caption": "The installation: a ring of light pulses with the recorded heartbeat around the cremation stones and brightens as hands approach; photos of beloved pets line the wall.",
          "credit": "Yi et al., SIGGRAPH 2021"
        }
      ],
      "people": [
        "Changyoon Yi",
        "Nakkyu Baek",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "C. Yi et al., Proc. ACM Comput. Graph. Interact. Tech. 4(2), 1–7 (2021), SIGGRAPH 2021",
          "url": "https://doi.org/10.1145/3465614"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/remember"
    },
    {
      "slug": "euglpollock",
      "title": "EuglPollock: art making through interspecies collaboration",
      "years": "2022",
      "status": "archived",
      "oneLiner": "People and Euglena co-create one-of-a-kind artworks through light-mediated interaction under a microscope.",
      "body": [
        "Can a microorganism be an artist's collaborator? EuglPollock, whose name blends Euglena with Jackson Pollock, is a platform where people and the alga Euglena gracilis make art together. Through a light-projection microscope, a participant's input becomes light that guides the swimming cells, and their movements are rendered as colorful, painterly trails on a large projection.",
        "Because living cells never respond exactly the same way twice, every artwork is unique and unrepeatable, the product of genuine interspecies collaboration rather than a scripted effect. Developed with Prof. Hyun Jean Lee at the Yonsei School of Communication and Arts, the project proposes a new way to make art while sparking curiosity about microorganisms and microbiology. Each session also doubles as a gentle introduction to how single cells sense and respond to light."
      ],
      "figures": [
        {
          "src": "assets/research/hbi/euglpollock-exhibition.jpg",
          "alt": "A visitor stands in a dark gallery beside a microscope setup, facing a large projection filled with tangled, multicolored trails.",
          "caption": "EuglPollock on display: trails left by light-guided Euglena build up into a large, ever-changing artwork.",
          "credit": "Lee et al., ACM Multimedia 2022"
        }
      ],
      "people": [
        "Kyungwon Lee",
        "Jaewoo Jung",
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "K. Lee et al., Proc. ACM Multimedia 2022, 1077–1084 (2022)",
          "url": "https://doi.org/10.1145/3503161.3548151"
        }
      ],
      "legacyUrl": "https://imaging.snu.ac.kr/research/euglpollock"
    },
    {
      "slug": "micro-hbi",
      "title": "Micro-HBI and biotic games",
      "years": "2020–2022",
      "status": "archived",
      "oneLiner": "Mapping a field of real, first-hand interaction with cells and molecules, from biotic games to cloud labs.",
      "body": [
        "Beyond individual installations, we helped define micro-HBI: interactive systems that give people real, first-hand experiences with living cells, viruses and molecules rather than simulations of them. A review written with Prof. Ingmar Riedel-Kruse surveys the systems, organisms, design principles and applications explored so far, from museum exhibits and biotic games to educational cloud labs, citizen-science platforms and do-it-yourself biology, and closes with open questions for the field. It received an Outstanding Article award from Frontiers in Computer Science.",
        "Biotic games are one concrete example. In Pac-Euglena, a collaboration led by the Riedel-Kruse group, players use light to guide live Euglena through a physical microfluidic maze, where the cells meet virtual ghosts and collectibles in a mixed biological and digital reality. A user study found the game fun and curiosity-sparking, and it yielded general guidelines for designing with living, unpredictable organisms."
      ],
      "figures": [
        {
          "src": "assets/research/hbi/micro-hbi-systems-montage.jpg",
          "alt": "Three photos side by side: a touchscreen with a light ring trapping a cell, visitors gesturing in front of a projected cell aquarium, and a visitor facing a projection of colorful cell trails.",
          "caption": "Micro-HBI systems from our group: touchscreen interaction (Trap it!), full-body play (MicroAquarium) and collaborative art (EuglPollock).",
          "credit": "Lee et al., ACM CHI 2015; Lee et al., CHI EA 2020; Lee et al., ACM MM 2022"
        }
      ],
      "people": [
        "Seung Ah Lee"
      ],
      "refs": [
        {
          "label": "S. A. Lee & I. H. Riedel-Kruse, Front. Comput. Sci. 4, 849887 (2022)",
          "url": "https://doi.org/10.3389/fcomp.2022.849887"
        },
        {
          "label": "A. T. Lam et al., Proc. ACM CHI 2020, 1–13 (2020)",
          "url": "https://doi.org/10.1145/3313831.3376378"
        }
      ]
    }
  ],
  "demoIdea": "“Trap a Euglena”: a Canvas 2D simulation of a few hundred virtual Euglena drawn as elongated, flagellated cells that swim along slowly rotating headings with run-and-tumble noise and a simple phototaxis rule (they turn away from bright light above a threshold and drift toward dim light). Visitors paint light with the mouse or a finger, exactly like Trap it!, as glowing strokes that fade over a few seconds; a ring drawn around a cell traps it, and a corridor herds a group. An “art” toggle leaves persistent colored trails behind each cell so the swarm paints an EuglPollock-style picture that can be saved as a PNG, and a “maze” mode adds Pac-Euglena-style walls and collectibles. A clear label notes that the cells are simulated, unlike the real organisms in our installations."
}
);
