# Candidate bank rebuild report (2026-06-10)

## 판단

완전 physics-first generator만으로 PCA bank를 다시 만들면 현재 real MLA/Voronoi/Perlin PCA plane을 충분히 덮지 못했다. 128 proxy에서 생성된 physics-mode 후보는 PC1이 주로 양수 영역에 몰려 real MLA/Voronoi cluster를 놓쳤다. 따라서 브라우저의 PCA click-to-pattern bank는 당분간 **PCA coverage proxy bank**로 유지하고, native wave-valid 판단은 별도 z sweep으로 분리하는 것이 맞다.

## 새 rebuild 방식

- 기존 deployed candidate bank를 seed pool로 사용했다. 이 pool은 real PCA cluster 근처 coverage가 이미 좋다.
- 부족한 family(`hard_voronoi_like`, `perlin_like`, `mixed`)는 추가 랜덤 draw로 보강했다.
- 최종 selection은 objective score 상위 정렬이 아니라 **family별 1000개 quota + 24×24 PCA-grid round-robin**으로 뽑았다.
- 각 candidate code에는 `physics_calibrated=0`을 넣어 PCA coordinate와 브라우저 재생성이 서로 맞도록 했다. 즉 이 bank는 native wave-valid bank가 아니라 PCA 탐색용 proxy bank다.

## 결과

- 총 후보: 6000
- family count: 각 1000개
  - `mla_like`, `soft_voronoi_like`, `hard_voronoi_like`, `turing_like`, `perlin_like`, `mixed`
- PCA grid occupancy: 271 / 576 bins
- real dataset nearest normalized PCA distance:
  - mean 0.0248
  - median 0.0202
  - p90 0.0537
  - max 0.0878
- 추가 생성량:
  - `perlin_like`: 235
  - `hard_voronoi_like`: 378
  - `mixed`: 399

## 산출물

- `pca_dataset/generated_candidate_bank.json`
- `pca_dataset/generated_candidate_bank_summary.json`
- `pca_dataset/fig_balanced_candidate_bank_audit.png`

## 해석

이제 bank count 기준으로는 MLA 쪽 또는 spectral 쪽으로 collapse하지 않는다. 다만 dominant weight는 여전히 `caustic_weight`/`spectral_weight`가 많다. 이는 기존 PCA plane에서 real cluster를 잘 덮는 proxy family들이 해당 component를 많이 쓰기 때문이다. 따라서 이 bank를 바로 wave-valid training distribution으로 해석하면 안 되고, 브라우저에서 PCA target을 찍어 candidate를 얻은 뒤 native wave sweep으로 검증해야 한다.
