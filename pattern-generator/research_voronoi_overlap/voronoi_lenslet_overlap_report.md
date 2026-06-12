# Voronoi graymap profile audit and lenslet-overlap implication

## Inputs

- Reference graymap: `/home/dgbae/data/iil-snu.github.io/pattern-generator/native_wave_overhaul/reference_masks_native/reference_voronoi_gray.png`
- Reference binary/cell line map: `/home/dgbae/data/iil-snu.github.io/pattern-generator/native_wave_overhaul/reference_masks_native/reference_voronoi_binary.png`
- Active crop detected from non-zero gray region: full image `x=450:1750`, `y=50:1350`, crop size `1300x1300`.

## Measured graymap structure

Within the active crop, Voronoi gray values are not binary. They are a smooth height field:

- gray range: `136..208`
- mean/std: `173.55 ± 9.78`
- internal gradient quantiles: q50 `0.71`, q95 `2.12`, q99 `2.69` gray/px
- strongest-gradient normal profiles show valley-to-peak variation roughly `152..190` gray over tens of pixels, not a one-pixel hard edge.

Interpretation: the useful Voronoi mask is closer to a smooth cell-wise relief with line/valley network than to a hard binary Voronoi edge image. The binary image is useful for topology, but not enough to explain the gray gradient magnitude directly.

## Lenslet overlap rule

If two parabolic/spherical lenslet caps overlap, additive composition is the wrong physical/topological rule for Voronoi-like cells:

- `sum`: overlap region becomes higher / saturated. This creates blobs or ridges and removes clean cell boundaries.
- `max` / upper envelope: each point is assigned to the cap with the larger local height. With equal curvature and apex, the switching set is the perpendicular bisector, i.e. an ordinary Voronoi edge. The cross-section has a V-shaped crease/valley at the cell boundary.
- `smoothmax`: softens the crease over a controllable width while preserving the envelope topology. This is more printable and should reduce unrealistically sharp slope discontinuities.

## Generator implication

For a Voronoi-like lenslet-overlap branch, use an upper-envelope / smoothmax rule, not additive summation.

Recommended implementation direction:

```js
// For each pixel and each lenslet i:
h_i(x,y) = spherical_cap_height_i(x,y)

// hard Voronoi-like envelope
h(x,y) = max_i h_i(x,y)

// printable softened version
h(x,y) = tau * log(sum_i exp(h_i(x,y) / tau))
```

Practical guardrails:

1. For straight ordinary Voronoi cells, use similar focal length / curvature per site.
2. If curvature or apex varies, the boundary becomes a weighted/power diagram; still useful, but less straight.
3. Use `smoothmax` with small `tau`, then mild blur/slope limiting. Too large `tau` washes out cell edges.
4. Avoid adding overlapping caps by `sum`; use `sum` only for intentionally blob-like/non-Voronoi morphologies.
5. Reference Voronoi has smooth gradients, so exact hard binary edges should be treated as topology only, not as target height profile.

## Figures

- `fig_voronoi_internal_profiles.png`: reference graymap crop, profile cuts, gradient map, normal profiles.
- `fig_lenslet_overlap_voronoi_envelope_model.png`: synthetic comparison of additive caps vs max/smoothmax envelope.
