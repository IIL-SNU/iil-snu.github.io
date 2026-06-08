# Native wave propagation overhaul audit
## 결론 요약
- 이전 browser/candidate-bank propagation은 128 px proxy grid 기반이라 2200×1400 / 2.7µm 원본 광학 조건을 대표하지 못한다.
- 이번 audit는 `LFmodel.MO_forward_batch` thin-phase branch와 같은 ASM 식을 NumPy/SciPy로 재구현했다: phase mask → 2× zero padding → centered FFT → `exp(+i z k_z)` → amplitude crop/max-normalize.
- reference 이름 오류도 수정했다: `mask_turing` 쪽 gray/binary가 Voronoi/cell-like이고, `mask_voro` 쪽 gray/binary가 Turing/maze-like이다.

## Gray→height mode
- `direct255`: 현재 `train_LF.py`의 wave branch와 동일하게 `height = gray/255 * 15µm`.
- `offset90`: projector GL inverse 가정. `GL=90`을 0 height로 두고, active max gray는 `15µm * max_gray/255`가 되도록 매핑.
- `active_min`: offset inverse지만 zero level을 nonzero active minimum으로 추정. raw projector 파일의 black padding이 있을 때 진단용으로 사용.

## Best z by reference/mode
| reference | family | mode | best z [mm] | score | height max [µm] | min/max GL used | HF ratio | large-comp frac |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| reference_mla_3mm | mla | direct255 | 1.00 | 0.000 | 7.65 | 0/255 | 0.0475 | 0.000 |
| reference_mla_3mm | mla | offset90 | 3.00 | 0.058 | 7.65 | 90/130 | 2.03 | 0.220 |
| reference_perlin_generated | perlin | direct255 | 8.00 | 0.004 | 15.00 | 0/255 | 1.05 | 0.020 |
| reference_perlin_generated | perlin | offset90 | 8.00 | 0.009 | 15.00 | 90/255 | 1.62 | 0.050 |
| reference_turing_binary | turing_binary | direct255 | 20.00 | 0.012 | 12.06 | 0/255 | 1.04 | 0.051 |
| reference_turing_binary | turing_binary | offset90 | 20.00 | 0.012 | 12.06 | 90/205 | 1.04 | 0.051 |
| reference_turing_gray | turing | direct255 | 8.00 | 0.049 | 11.65 | 0/255 | 1.76 | 0.135 |
| reference_turing_gray | turing | offset90 | 4.00 | 0.032 | 11.65 | 90/198 | 1.38 | 0.105 |
| reference_voronoi_binary | voronoi_binary | direct255 | 2.00 | 0.155 | 12.06 | 0/255 | 2.7 | 0.368 |
| reference_voronoi_binary | voronoi_binary | offset90 | 2.00 | 0.155 | 12.06 | 90/205 | 2.7 | 0.368 |
| reference_voronoi_gray | voronoi | direct255 | 8.00 | 0.119 | 12.24 | 0/255 | 1.38 | 0.259 |
| reference_voronoi_gray | voronoi | offset90 | 4.00 | 0.085 | 12.24 | 90/208 | 1.27 | 0.204 |

## 새 metric의 의미
`focus_structure_score`는 밝은 top 0.5% 영역이 단일 픽셀 speckle로 흩어지는지, 아니면 연결된 ridge/dot/caustic 구조를 이루는지를 본다. top component area, large component fraction, local contrast를 올리고, high-frequency speckle ratio를 penalty로 준다. 따라서 기존처럼 랜덤 speckle가 많아 보이는 이미지를 best focus로 고르는 문제가 줄어든다.

## 다음 generator 재설계 원칙
1. 생성 후보는 128 proxy가 아니라 최소 550×350 preview 또는 native-rendered mask에서 propagation-valid rejection을 통과해야 한다.
2. MLA/Voronoi/Turing/Perlin reference 각각의 best-z score 분포를 calibration target으로 사용한다. 단일 morphology family가 아니라 `reference별 wave response envelope`를 맞춘다.
3. browser HTML의 wave preview는 빠른 proxy임을 명시하고, server-side/native audit 결과로 bank를 갱신해야 한다.

## 2026-06-08 generator 반영
- `wave_valid_pattern_generator.py`를 추가해 native 2200×1400 mask를 직접 생성하고 위 ASM으로 objective-band(기본 1--5 mm) best z와 far-z leakage를 함께 기록했다.
- Voronoi/Turing polarity를 reference와 맞췄다. 즉, bright/high-gray ridge가 높은 height이며, 이전처럼 ridge를 어둡게 invert하지 않는다.
- Turing-like 생성은 dense worm texture가 아니라 broad maze stroke가 나오도록 낮은 spectral centroid/bandwidth로 조정했다.
- 최신 probe: `native_wave_overhaul/wave_valid_generator/fig_wave_valid_generated_probe.png`, 표: `native_wave_overhaul/wave_valid_generator/wave_valid_generator_probe_report.md`.
