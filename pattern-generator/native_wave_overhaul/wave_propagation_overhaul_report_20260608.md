# Wave propagation overhaul report (2026-06-08)

## 1. 왜 갈아엎었는가

이전 `fig_wave_aware_generated_examples.png`는 pattern coverage가 넓어 보이는 것과 별개로, propagated result가 대부분 speckle/noise처럼 보였다. 원인은 크게 네 가지였다.

1. **Propagation preview가 128 px proxy 기반**이었다.  
   실제 조건은 2200×1400 active FOV, pixel pitch 2.7 µm인데 candidate bank/HTML 쪽은 128 grid를 물리 크기에 맞춰 proxy propagation했다. 이 proxy는 PCA 탐색용으로는 빠르지만, focus validity 판단에는 부적절하다.
2. **reference 이름이 일부 뒤집혀 있었다.**  
   - `mask_turing/justflatfielding...` / `mask_turing/binary/voronoi_dense...` → 실제 morphology는 Voronoi/cell-like.
   - `mask_voro/justflatfielding...` / `mask_voro/binary/turing_4_resized.png` → 실제 morphology는 Turing/maze-like.
3. **gray→height 해석이 focus 위치를 크게 바꿨다.**  
   current train wave branch처럼 `height=gray/255*15µm`로 보면 Voronoi/Turing focus가 8mm 쪽으로 길어진다. projector inverse에 가까운 `offset90` (`GL=90`을 0 height로 두고 active max gray가 `15µm*max_gray/255`가 되게 mapping)로 보면 MLA/Voronoi/Turing reference가 3–4mm 주변으로 들어온다.
4. **best focus metric이 far-field/speckle를 과대평가했다.**  
   global max score만 보면 12–20mm의 far-field contrast가 1–5mm focus를 이긴다. 따라서 selection은 `1–5mm near best`와 `8–20mm far leakage ratio`를 분리해야 한다.

## 2. 원본 wave propagation 확인

원본 구현은 `learned-fab/LFmodel.py::MO_forward_batch` thin-phase branch와 동일하게 재구현했다.

- `field = exp(i*k0*(n_mat-n_air)*height)`
- 2× zero padding
- centered FFT / inverse FFT
- transfer: `exp(+i*z*kz.real)`
- output: intensity squared가 아니라 **amplitude abs**, 이후 center crop, max normalize

새 audit script:

```bash
python3 reports/domain_distribution_audit/final_figures_20260601/native_wave_propagation_audit.py \
  --z 1 2 3 4 5 8 12 20 \
  --height-modes direct255 offset90
```

산출물:

- `native_wave_overhaul/fig_native_reference_wave_sweep_offset90.png`
- `native_wave_overhaul/fig_native_reference_wave_sweep_direct255.png`
- `native_wave_overhaul/native_reference_wave_metrics.csv`
- `native_wave_overhaul/native_reference_wave_summary.json`

## 3. Reference audit 핵심 결과

`offset90` 기준에서 실제 gray reference는 다음처럼 focus가 1–5mm로 내려온다.

| reference | family | mode | best z [mm] | note |
|---|---:|---:|---:|---|
| reference_mla_3mm | MLA | offset90 | 3 | physical MLA NPZ scale 보존 시 정상 |
| reference_voronoi_gray | Voronoi/cell | offset90 | 4 | `mask_turing` 쪽 gray |
| reference_turing_gray | Turing/maze | offset90 | 4 | `mask_voro` 쪽 gray |
| reference_perlin_generated | Perlin | offset90 | 8 | 현재 Perlin reference는 generated sample이라 focus anchor로 약함 |

직접 `gray/255*15µm` 해석에서는 Voronoi/Turing이 8mm 쪽으로 밀렸다. 따라서 generator/HTML에서 physical wave preview를 할 때는 `offset90`을 기본으로 써야 한다.

## 4. 새 generator 기준

새로 추가한 script:

- `wave_valid_pattern_generator.py`  
  Pure NumPy native procedural generator. MLA / Voronoi / Turing / Perlin branch를 만들고, `offset90` + native ASM으로 검증한다.
- `reference_calibrated_wave_bank.py`  
  원본 MLA/Voronoi/Turing/Perlin reference를 elastic warp + photometric perturbation해서 **wave-valid anchor envelope**를 만든다. Procedural branch는 이 envelope 안으로 들어오도록 rejection해야 한다.

새 selection 기준:

- `near_best_z_mm`: 1–5mm 안에서 가장 좋은 coherent focus z.
- `near_best_score`: 1–5mm 안 focus score.
- `global_best_z_mm`: 전체 z sweep에서 가장 좋은 score.
- `far_leakage_ratio = best_score(z>5mm) / near_best_score`.

즉, global best가 20mm여도 near focus가 충분하고 leakage가 작으면 통과 가능하지만, Voronoi/Turing처럼 12–20mm leakage가 near보다 훨씬 크면 reject한다.

## 5. Reference-calibrated anchor 결과

실행:

```bash
python3 reports/domain_distribution_audit/final_figures_20260601/reference_calibrated_wave_bank.py \
  --clean --per-family 1 --z 1 2 3 4 5 8 12 20
```

산출물:

- `native_wave_overhaul/reference_calibrated_bank/fig_reference_calibrated_anchors.png`
- `native_wave_overhaul/reference_calibrated_bank/reference_calibrated_summary.json`

결과:

| anchor | family | near best z [mm] | global best z [mm] | far leakage | 판단 |
|---|---:|---:|---:|---:|---|
| anchor_mla_00 | MLA | 3 | 3 | 0.12 | good |
| anchor_voronoi_00 | Voronoi | 3 | 3 | 0.33 | good |
| anchor_turing_00 | Turing | 3 | 12 | 3.08 | near focus는 있으나 leakage borderline |
| anchor_perlin_00 | Perlin | 4 | 4 | 0.29 | good |

이 anchor set은 이전 generated examples처럼 wave output이 speckle로 붕괴하지 않고, 원본 reference와 유사하게 z sweep에서 구조가 유지된다.

## 6. 2026-06-08 추가 수정: dense spectral branch 판정

사용자가 지적한 촘촘한 spectral / ripple-dominant 패턴은 native propagation probe로 확인된 wave-valid family가 아니다. 이 분기는 PCA coverage를 넓히기 위해 남아 있던 legacy/proxy candidate-bank 성격이 강하고, 실제 ASM sweep에서는 1--5 mm focus라기보다 speckle/noise-like far-field texture로 보인다.

따라서 HTML main random generator에서 다음을 수정했다.

- high-centroid spectral tail profile의 sampling mass를 0으로 둬 기본 랜덤 생성에서 제외했다.
- stale state가 해당 branch를 강제로 호출하더라도 smooth Perlin-like low/mid-frequency fallback으로 전환한다.
- Turing-like branch는 reference와 맞게 낮은 spectral centroid, broader maze ridge, ripple weight 0으로 재조정했다.
- 해당 branch는 더 이상 “wave prop으로 확인된 패턴”으로 표시하지 않고, legacy/noise-like coverage로 명시했다.

현재 wave-valid로 취급할 수 있는 것은 native reference sweep과 `wave_valid_generator` probe에서 objective-band best / far leakage가 기록된 MLA, Voronoi, Turing, Perlin anchor뿐이다. 특히 Perlin/spectral 계열은 점수 자체가 약하므로 morphology anchor로만 쓰고, 단독 dense spectral texture는 training pattern으로 쓰지 않는 쪽이 맞다.

## 6. 현재 판단

- **이전 r4 generator/release는 wave-valid 기준으로 폐기해야 한다.** PCA coverage만으로는 부족하다.
- 새 기준은 `reference-calibrated anchors`를 먼저 만든 뒤, procedural samples가 그 anchor들의 wave-response envelope를 통과할 때만 bank에 넣는 방식이다.
- Procedural generator v1은 MLA/Perlin은 near focus를 만들 수 있지만, Voronoi/Turing은 far leakage tuning이 아직 필요하다.
- 따라서 HTML/Pages에는 아직 새 procedural bank를 release하지 말고, 먼저 native rejection으로 accepted bank를 만든 뒤 반영해야 한다.

## 7. 다음 코드 변경 필요 사항

1. `interactive_generator_waveprop.html`의 wave preview 기본값을 `offset90` gray→height로 변경한다. direct `gray/255*15µm`는 debug option으로만 둔다.
2. candidate bank 생성 시 128 proxy propagation score를 폐기/강등한다.  
   빠른 prefilter는 허용하되 최종 accept는 native 또는 최소 550×350 physical preview + native-calibrated leakage metric으로 해야 한다.
3. training code의 `wave_unet` branch도 물리 의미를 보려면 `gray*opd_max` 대신 projector inverse mapping option을 가져야 한다. 현재 `train_LF.py::WaveThenUNetModel.forward()`는 direct255 해석이다.
4. Turing family는 reference-calibrated anchor를 우선 사용하고, procedural Turing은 low-frequency maze spacing + leakage constraint를 더 보정해야 한다.

## 8. 2026-06-08 추가 반영: HTML/manifest 재정리

사용자 지적처럼 `fig_wave_aware_generated_examples.png`류의 결과는 propagation이 제대로 된 예시로 볼 수 없으므로, HTML에서도 더 이상 “native wave-valid generated”라고 부르지 않는다.

반영 사항:

1. `interactive_generator_waveprop.html`의 reference dropdown을 원본 기준으로 재구성했다.
   - Original MLA / Voronoi / Turing / Perlin
   - Reference-calibrated anchor MLA / Voronoi / Turing / Perlin
2. reference/anchor를 로드하면 `offset90` gray→height mapping을 쓰고, native audit에서 찾은 best z로 slider를 자동 이동한다.
3. Procedural preset은 “near-focus experimental”로 강등했다. 즉, 실시간 생성 실험용이지 최종 validity 근거가 아니다.
4. PCA click-to-pattern candidate bank도 legacy/proxy로 표기했다. 해당 bank의 wave score는 128px/축소 proxy에 기반하므로 focus validity 판단에서 제외한다.
5. 새 manifest를 만들었다: `wave_valid_reference_manifest_20260608.json`.
6. 공유 번들은 새 HTML/report/anchor까지 포함하도록 갱신했다: `../pattern_generator_wave_valid_bundle_20260608.zip`.

결론적으로, 다음 generator 재설계는 “coverage를 넓힌 랜덤 field”에서 시작하면 안 되고, 먼저 MLA/Voronoi/Turing/Perlin 원본 각각의 native z-sweep envelope를 맞춘 뒤 그 envelope 안에서 다양성을 늘리는 방향으로 가야 한다.

## 9. 2026-06-09 추가 반영: atom branch를 실제 lenslet 곡률로 교체

기존 `atom_weight` branch는 Gaussian/parabolic blob morphology를 만든 뒤 전체 graymap을 다시 normalize/calibrate했다. 이 방식은 눈으로 보기에는 MLA-like dot/cap처럼 보여도, 각 atom의 aperture와 focal length가 물리적으로 묶여 있지 않아서 wave propagation 후 초점이 맞지 않는 문제가 있었다.

수정 사항:

1. `physics_calibrated=True`일 때 `atom_weight`는 더 이상 normalized morphology atom을 의미하지 않는다. 이제 per-site physical lenslet branch로 동작한다.
2. 각 site마다 focal length `f_i`와 aperture `a_i`를 샘플링하고, 곡률 반경을 `R_curv=(n_mat-n_air)f_i`로 둔다.
3. height profile은 base를 대체하는 zero-base mask가 아니라, base surface 위에 더해지는 spherical-cap sag이다.

```text
cap(r) = sqrt(R_curv^2 - r^2) - sqrt(R_curv^2 - a_i^2),  r <= a_i
cap(r) = 0,                                                   r > a_i
height(r) = base(r) + cap(r)
```

4. 작은 aperture에서는 기존 paraxial 식 `h0 ~= a_i^2 / (2 Δn f_i)`와 같지만, 구현은 spherical-cap exact form을 쓴다.
5. 15 µm height budget을 넘는 경우에는 height를 clip하지 않고 aperture를 줄인다. height clipping은 cap 중심부를 평평하게 만들어 곡률과 focal length를 깨뜨리기 때문이다.
6. non-lenslet base morphology가 있을 경우 lenslet height는 renormalize/scale하지 않고 `base_scaled + lenslet_cap`으로 합성한다. 단, `base_scaled.max + lenslet_cap.max <= 15 µm`가 되도록 base를 전역 attenuate해서 lenslet이 base보다 낮아지거나 cap 중심이 clip되는 상황을 피한다. `atom_weight`는 lenslet 곡률 자체를 줄이는 값이 아니라 base 대비 lenslet branch dominance와 base headroom을 정하는 값이다.
7. lenslet 이외의 spectral / ridge / level-set / Voronoi-like / Turing-like / Perlin-like morphology도 모두 `morph_baseline_q`를 base floor로 둔 뒤 `smoothstep((shape-baseline)/(peak-baseline))`로 non-negative relief로 변환한다. 즉 어떤 family도 base 아래로 내려가는 valley를 만들지 않고, base 접점에서 slope가 0에 가까운 smooth gradient를 갖는다.

검증:

- native 2200×1400 / 2.7 µm / 2× padded ASM으로 단일 lenslet `R=200 µm, f=3.0 mm`를 sweep했을 때 best z가 3.0 mm로 맞는다.
- random array lenslet `R≈110 µm, f≈2.18 mm`는 peak contrast가 2–2.5 mm에서 강하고, 기존 focus-structure metric은 component-size penalty 때문에 3 mm를 best로 잡는다. 즉 metric은 array lenslet 평가에서는 보조 지표로만 쓰고, z sweep image와 peak contrast를 같이 봐야 한다.

산출물:

- `native_wave_overhaul/physical_lenslet_probe/fig_physical_lenslet_native_sweep.png`
- `native_wave_overhaul/physical_lenslet_probe/physical_lenslet_focus_metrics.csv`
- `native_wave_overhaul/physical_lenslet_probe/physical_lenslet_focus_summary.json`

결론: atom/lenslet branch는 이제 단순 dot texture가 아니라 base 위에 올라가는 실제 focal-length-aware curvature primitive다. 다만 Voronoi/Turing/Perlin 일반화 generator는 여전히 reference-calibrated native z-sweep envelope 안에서 rejection해야 한다.
