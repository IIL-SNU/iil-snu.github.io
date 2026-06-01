# Wave-propagation-aware pattern generator redesign report

작성일: 2026-06-01  
대상: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab`

## 1. 결론

기존 PCA/coverage 중심 generator는 **graymap 자체의 다양성**은 넓혔지만, wave propagation 후에는 focus/caustic이 1--5 mm에서 안정적으로 생긴다고 보장하지 못했다. 원인은 주파수 분포만 맞추면 되는 문제가 아니라, mask height field의 **국소 곡률(local focal power)** 이 target propagation distance와 맞아야 하기 때문이다.

이번 수정의 핵심은 다음이다.

1. `spectral / rank / Zernike / atoms / ridge / level-set / ripple`은 morphology와 OOD coverage를 담당한다.
2. 새 `wave_caustic` 성분은 smooth parabolic curvature packet을 만들고, 각 packet의 sag를
   `h(r)=h0-r²/(2(n-1)f)` 기준으로 계산한다.
3. gray→height mapping에서 `max_gray/255`가 곱해지는 점을 보정하기 위해 physical curvature anchor를 최종 unit height에 다시 blend한다.
4. finite aperture / discretization 때문에 focal plane이 길게 밀리는 경향이 있어 `caustic_power_boost`를 추가했다. 기본값 1.6, random sweep 1.15--2.6.
5. PCA click-to-generate / 현재 생성 sample PCA marker / reference MLA-Voronoi-Perlin loading 로직은 유지하되, candidate bank를 wave-aware parameter로 다시 생성했다.

## 2. Reference mask propagation 관찰

Audit script는 `LFmodel.MO_forward_batch`와 같은 convention으로 계산했다.

- thin phase mask
- active field 2x zero padding
- angular spectrum propagation
- center crop
- gray→height: `height_norm=(gray-min_gray)/(max_gray-min_gray) * max_gray/255`, `h_max=15µm`

Figure:

![reference z sweep](/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/fig_wave_focus_reference_sweep.png)

Reference 결과 요약:

| mask | best z (audit) | 해석 |
|---|---:|---|
| MLA 3mm ref | 5 mm | 가장 focus-like. 다만 downsample/finite aperture에서 nominal 3mm보다 길게 관찰됨. |
| Perlin ref | 15 mm | smooth하지만 1--5mm focal power가 부족함. Perlin은 low-frequency height variation은 좋지만, 1--5mm에 맞는 곡률 density가 낮다. |
| Voronoi ref | 20 mm | edge/ridge topology는 강하지만 smooth parabolic focusing curvature가 아니어서 propagation 후 focus가 길게 밀리거나 diffraction texture로 남는다. |

중요한 관찰:

- **Perlin**: gradient는 낮고 smooth하지만, Hessian 기반 point-focus fraction(1--5mm)이 낮다. 즉 “매끈함”만으로 focus가 생기지 않는다. target z에 맞는 곡률 scale이 필요하다.
- **Voronoi**: frequency/PCA상으로는 OOD texture를 잘 설명하지만, hard/edge-like ridge는 propagation에서 stable focal plane보다 diffraction/blur를 만들기 쉽다.
- **MLA**: nominal focal length가 geometry에 들어있기 때문에 가장 물리적으로 해석 가능하다. 이 구조를 family로 직접 만들기보다, parabolic local curvature packet으로 일반화하는 쪽이 맞다.

## 3. PCA/coverage와 wave focus가 어긋난 이유

기존 PCA는 다음 feature로 구성되어 있다.

- 128×128 physical-height proxy
- 48-bin radial Fourier log-power
- 24-bin gradient orientation histogram

이 PCA는 MLA / Voronoi / Perlin을 구분하는 데는 유효하다. 하지만 PCA의 PC1/PC2는 대부분 **주파수 대역과 방향성**을 설명한다. wave propagation의 focus 여부는 여기에 더해 다음 조건이 필요하다.

- local Hessian eigenvalue가 둘 다 음수인 영역(point focus)이 충분히 존재하는가
- `z ≈ -1 / ((n-1)λ)`가 1--5 mm에 들어오는가
- gradient가 너무 hard edge가 아니라 smooth curvature로 연결되는가
- aperture가 너무 작거나 sag가 gray range에서 clip되지 않는가

따라서 PCA coverage만 넓히면 Voronoi/Perlin처럼 보이는 mask는 만들 수 있지만, wave propagation 후 focus가 없을 수 있다. 이번 generator는 PCA coverage와 wave-valid curvature를 분리해서 다룬다.

## 4. Wave-focus metric 결과

Figure:

![wave metric boxplot](/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/fig_wave_focus_curvature_summary.png)

주요 median 값:

| domain | best z median | point-focus frac 1--5mm | line-caustic frac 1--5mm | spectral centroid median |
|---|---:|---:|---:|---:|
| MLA dataset | 10.0 mm | 0.228 | 0.530 | 0.205 |
| Perlin dataset+ref | 12.0 mm | 0.004 | 0.093 | 0.087 |
| Voronoi dataset+ref | 15.0 mm | 0.126 | 0.439 | 0.368 |
| Generated bank sample | 17.5 mm | 0.101 | 0.252 | 0.136 |

해석:

- Audit의 absolute best-z는 downsample/grid/score에 영향을 받으므로 training target 그대로의 focal length 숫자로 보기는 어렵다.
- 그래도 domain 간 상대 비교는 명확하다.
  - Perlin은 1--5mm point-focus curvature가 가장 부족하다.
  - MLA/Voronoi는 curvature fraction이 있지만, Voronoi는 edge-like high-frequency 성분이 많아 focus plane이 길게 밀리는 경향이 있다.
  - Generated bank는 wave-aware curvature를 추가해 Perlin보다 1--5mm curvature density가 커졌고, PCA coverage도 유지했다.

## 5. Generator redesign

### 5.1 새 component: `wave_caustic`

구현 파일:

- `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/parameterized_field_generator.py`
- `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/interactive_generator_waveprop.html`
- `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/build_generated_pca_candidate_bank.py`

동작:

1. packet center를 random / jittered regular grid로 배치
2. radius, amplitude, missing probability, density irregularity를 randomize
3. target focal distance를 optical power 기준으로 sample
4. 각 packet sag를 `R²/(2(n-1)f)`로 계산
5. outer 15--28%만 smooth taper해서 hard aperture를 줄이고, core의 constant curvature는 유지
6. final unit height에 physical anchor로 재-blend

### 5.2 왜 physical anchor가 필요한가

기존 generator는 모든 component를 standardize 후 합치고 robust normalize했다. 이 방식은 PCA diversity에는 좋지만, `R²/(2(n-1)f)`로 계산한 absolute sag를 깨뜨린다. 그래서 wave_caustic 성분을 넣어도 최종 graymap에서 target focal power가 사라질 수 있다.

이번에는 최종 tone/fabrication filter 후:

```text
caustic_anchor = caustic_sag_norm * 255 / max_gray
unit = (1-alpha) * morphology_unit + alpha * caustic_anchor
```

으로 다시 blend한다. `max_gray/255` 보정은 사용자가 말한 gray→height convention과 맞춘 것이다.

### 5.3 `caustic_power_boost`

단일 parabolic packet test와 reference MLA audit에서 nominal focal length보다 observed focus가 길게 나왔다. 원인은 finite aperture, discretization, score definition, blur/taper 때문이다. 그래서 sag를 보정하는 `caustic_power_boost`를 추가했다.

- HTML default: 1.60
- random sweep: 1.15--2.40, caustic-heavy profile은 1.30--2.60
- UI에서 직접 조절 가능

## 6. PCA coverage 결과

Candidate bank를 wave-aware generator로 6000개 재생성했다.

`/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/pca_dataset/generated_candidate_bank_summary.json`

최종 coverage:

| metric | value |
|---|---:|
| generated candidates | 6000 |
| nearest dataset PC distance mean | 0.0307 |
| median | 0.0155 |
| p90 | 0.0818 |
| MLA mean / median / p90 | 0.0244 / 0.0150 / 0.0623 |
| Perlin mean / median / p90 | 0.0082 / 0.0041 / 0.0201 |
| Voronoi mean / median / p90 | 0.0596 / 0.0472 / 0.1434 |
| generated PC1 range | -27.58 to 13.06 |
| generated PC2 range | -4.87 to 6.22 |

즉, wave-aware curvature를 넣으면서도 MLA/Perlin/Voronoi PCA coverage는 유지했다. Voronoi tail은 여전히 가장 어렵기 때문에 high-frequency spectral/ripple profile을 별도 tail anchor로 유지했다.

## 7. HTML 변경 사항

HTML viewer:

- `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/interactive_generator_waveprop.html`

변경:

- `wave caustic` component 추가
- `caustic_weight`, count/radius/focus/spread/regularity/jitter/missing controls 추가
- `caustic_power_boost` control 추가
- gray→height min/max gray 반영 유지
- resolution 선택 유지: 275×175, 550×350, 1100×700, 2200×1400
- propagation distance 0--20mm sweep 유지
- PCA click시 nearest mask load가 아니라 candidate bank에서 근접 parameter를 stochastic 선택해 생성
- Alt/Option click fallback만 nearest dataset mask load
- 현재 생성 sample을 PCA plot에 magenta marker로 projection
- random generator profile에 high-frequency Voronoi tail anchor와 wave-caustic focus branch 포함

## 8. 남은 기술적 주의점

1. Browser propagation은 full 2200×1400에서 매우 무겁다. 기본은 원본으로 두었지만 실제 인터랙션은 550×350 또는 1100×700 확인이 현실적이다.
2. Audit의 best-z 절대값은 downsample/score 영향을 받는다. 실제 판단은 HTML에서 full/near-full resolution z sweep으로 시각 확인하는 것이 맞다.
3. Voronoi-like OOD coverage와 1--5mm focus는 서로 trade-off가 있다. hard Voronoi tail은 PCA coverage용으로 유지하되, 학습용 synthetic은 caustic_weight가 있는 branch 비중을 높이는 것이 낫다.
4. Perlin은 smoothness는 좋지만 focal-power density가 낮다. Perlin-like texture를 쓰려면 단순 fBm height가 아니라 curvature-controlled spectral field 또는 caustic packet modulation이 필요하다.

## 9. 산출물

- Analysis script: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/analyze_wave_focus_features.py`
- Metrics CSV: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/wave_focus_feature_metrics.csv`
- Summary JSON: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/wave_focus_feature_summary.json`
- Reference sweep figure: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/fig_wave_focus_reference_sweep.png`
- Curvature metric figure: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/fig_wave_focus_curvature_summary.png`
- Generated examples figure: `/home/dgbae/mnt/nas/homes/DG/train/lensless/Lensless-Fabrication/learned-fab/reports/domain_distribution_audit/final_figures_20260601/fig_wave_aware_generated_examples.png`
