# Native wave overhaul artifacts

Authoritative propagation uses `native_wave_propagation_audit.py`, a NumPy/SciPy port of `learned-fab/LFmodel.py::MO_forward_batch` thin-phase ASM with exact native 2200×1400 input and 2× zero padding.

## Key outputs

- `wave_propagation_overhaul_report_20260608.md`: latest Korean overhaul report; explains why the previous PCA/proxy wave generator was deprecated.
- `fig_native_reference_wave_sweep_offset90.png`: original MLA/Voronoi/Turing/Perlin reference z sweep using projector offset gray→height.
- `fig_native_reference_focus_scores.png`: direct255 vs offset90 focus-score comparison.
- `native_reference_wave_metrics.csv`: per-reference/per-z metrics.
- `native_reference_wave_summary.json`: best-z summary and constants.
- `wave_valid_reference_manifest_20260608.json`: compact manifest tying references, anchors, and procedural probe status together.
- `reference_masks_native/`: original LF reference masks used by the audit.
- `reference_calibrated_bank/fig_reference_calibrated_anchors.png`: warped/photometric reference anchors with native wave sweeps.
- `wave_valid_generator/fig_wave_valid_generated_probe.png`: experimental procedural probe only; **not** authoritative for final validity.

## Important correction

- `mask_turing/` contains Voronoi/cell-like references.
- `mask_voro/` contains Turing/maze-like references.
- Previous 128px/generated-candidate wave scores are deprecated for focus-validity decisions.
- Default gray→height for wave preview/validation is now `offset90`: `gray<=90 → 0 height`, active `max_gray → 15µm*max_gray/255`.

## HTML / bundle

- Main interactive preview: `../interactive_generator_waveprop.html`.
- The HTML reference dropdown now includes original LF references and reference-calibrated anchors; loading a reference moves the z slider to the native-audit best focus.
- Browser propagation is an interactive radix-2 padded preview. Final accept/reject should still use the native Python audit.
- Static bundle for sharing: `../pattern_generator_wave_valid_bundle_20260608.zip`.
