# Wave-valid generator probe

이 probe는 native 2200×1400 mask를 직접 만들고 `offset90` gray→height + LFmodel-equivalent ASM으로 rejection한 결과다.
Acceptance/figure label은 목표 focus band(기본 1–5 mm)의 best를 사용하고, 8–20 mm leakage는 별도로 기록한다.

| sample | family | target z | objective best z | objective score | global z | global score | far leak | max gray | note |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| gen_mla_00_seed1527498704 | mla | 3.36 | 5.00 | 0.895 | 20.00 | 1.242 | 1.39 | 143 | parabolic lenslet sag from target focal distance |
| gen_mla_01_seed1619027140 | mla | 2.02 | 2.00 | 0.370 | 12.00 | 1.174 | 3.18 | 149 | parabolic lenslet sag from target focal distance |
| gen_voronoi_00_seed675881623 | voronoi | 2.35 | 5.00 | 0.462 | 20.00 | 0.759 | 1.64 | 201 | smooth second-nearest distance ridge + weak interior curvature |
| gen_voronoi_01_seed1693928010 | voronoi | 2.41 | 5.00 | 0.523 | 20.00 | 1.273 | 2.43 | 213 | smooth second-nearest distance ridge + weak interior curvature |
| gen_turing_00_seed1884212711 | turing | 3.98 | 4.00 | 0.126 | 4.00 | 0.126 | 0.36 | 200 | band-limited smooth maze ridge |
| gen_turing_01_seed169073735 | turing | 2.96 | 5.00 | 0.323 | 5.00 | 0.323 | 0.81 | 193 | band-limited smooth maze ridge |
| gen_perlin_00_seed651094433 | perlin | 2.25 | 5.00 | 0.029 | 5.00 | 0.029 | 0.63 | 240 | smooth multi-octave field + weak ridge anchor |
| gen_perlin_01_seed1959437570 | perlin | 6.92 | 2.00 | 0.029 | 2.00 | 0.029 | 0.36 | 230 | smooth multi-octave field + weak ridge anchor |
