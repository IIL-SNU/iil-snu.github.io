#!/usr/bin/env python3
"""Internal HTTP server for the pattern generator + optional GPU ASM backend.

Usage:
    cd reports/domain_distribution_audit/final_figures_20260601
    python3 pattern_generator_gpu_server.py --host 0.0.0.0 --port 8080 --gpu 0

Then open:
    http://<server-ip>:8080/pattern-generator/

The server serves the static pattern-generator assets and exposes:
    GET  /api/health
    POST /api/propagate

`/api/propagate` accepts a gray PNG data URL plus gray->height metadata and runs
LFmodel-style angular-spectrum propagation.  CuPy is used when available;
otherwise it falls back to NumPy with the same API.  This keeps the HTML usable
on machines without CUDA while using the internal server GPU when available.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import math
import mimetypes
import os
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

import numpy as np
from PIL import Image

try:  # optional GPU backend
    import cupy as cp  # type: ignore
except Exception:  # pragma: no cover - depends on server env
    cp = None

WAVELENGTH_M_DEFAULT = 0.55e-6
H_MAX_M_DEFAULT = 15e-6
N_MAT_DEFAULT = 1.56
N_AIR_DEFAULT = 1.0
_TRANSFER_CACHE: dict[tuple[str, int, int, float, float, float, float], Any] = {}


def _json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict[str, Any]) -> None:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def _decode_png_data_url(data_url: str) -> np.ndarray:
    if "," in data_url:
        _, b64 = data_url.split(",", 1)
    else:
        b64 = data_url
    raw = base64.b64decode(b64)
    return np.asarray(Image.open(io.BytesIO(raw)).convert("L"), dtype=np.uint8)


def _magma_rgb(view: np.ndarray) -> np.ndarray:
    stops = np.asarray(
        [
            [0.00, 0, 0, 4],
            [0.18, 38, 12, 75],
            [0.36, 101, 21, 110],
            [0.55, 171, 48, 92],
            [0.75, 228, 102, 50],
            [1.00, 252, 253, 191],
        ],
        dtype=np.float32,
    )
    t = np.clip(view.astype(np.float32), 0.0, 1.0)
    rgb = np.empty((*t.shape, 3), dtype=np.float32)
    for i in range(len(stops) - 1):
        a, b = stops[i], stops[i + 1]
        m = (t >= a[0]) & (t <= b[0]) if i < len(stops) - 2 else (t >= a[0]) & (t <= b[0] + 1e-6)
        u = np.clip((t[m] - a[0]) / max(float(b[0] - a[0]), 1e-9), 0.0, 1.0)[:, None]
        rgb[m] = a[1:] * (1.0 - u) + b[1:] * u
    return np.clip(np.rint(rgb), 0, 255).astype(np.uint8)


def _png_b64_rgb(rgb: np.ndarray) -> str:
    buf = io.BytesIO()
    Image.fromarray(rgb, "RGB").save(buf, format="PNG", optimize=False)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def _metrics(view: np.ndarray) -> dict[str, float]:
    v = np.clip(view.astype(np.float32), 0.0, 1.0).reshape(-1)
    mean = float(v.mean())
    std = float(v.std())
    p50 = float(np.quantile(v, 0.50))
    p995 = float(np.quantile(v, 0.995))
    p999 = float(np.quantile(v, 0.999))
    bright = float(np.mean(v > mean + 2.0 * std))
    contrast = min(2.0, max(0.0, (p995 - p50) / max(std, 1e-6)))
    peak_to_median = p999 / max(p50, 1e-4)
    focus_score = contrast * math.tanh(peak_to_median / 12.0)
    return {
        "mean": mean,
        "std": std,
        "p999": p999,
        "peakToMean": float(p999 / max(mean, 1e-12)),
        "brightFrac": bright,
        "focusScore": float(focus_score),
    }


def _height_from_gray(gray: np.ndarray, min_gray: int, max_gray: int, h_max_m: float) -> np.ndarray:
    g = gray.astype(np.float32)
    if max_gray <= min_gray:
        hnorm = np.zeros_like(g, dtype=np.float32)
    else:
        hnorm = np.clip((g - float(min_gray)) / float(max_gray - min_gray), 0.0, 1.0) * (float(max_gray) / 255.0)
    return (hnorm * h_max_m).astype(np.float32)


def _get_transfer(xp: Any, backend: str, hp: int, wp: int, pixel_y_m: float, pixel_x_m: float, wavelength_m: float, z_m: float):
    key = (backend, hp, wp, pixel_y_m, pixel_x_m, wavelength_m, z_m)
    if key in _TRANSFER_CACHE:
        return _TRANSFER_CACHE[key]
    k0 = 2.0 * math.pi / wavelength_m
    fy = xp.fft.fftfreq(hp, d=pixel_y_m).astype(xp.float32)
    fx = xp.fft.fftfreq(wp, d=pixel_x_m).astype(xp.float32)
    ky = (2.0 * math.pi * fy)[:, None]
    kx = (2.0 * math.pi * fx)[None, :]
    kz = xp.sqrt(xp.maximum(k0 * k0 - kx * kx - ky * ky, 0.0)).astype(xp.float32)
    transfer = xp.exp(1j * (z_m * kz)).astype(xp.complex64)
    _TRANSFER_CACHE[key] = transfer
    # Avoid unbounded cache growth when sweeping many z values/shapes.
    if len(_TRANSFER_CACHE) > 32:
        for old in list(_TRANSFER_CACHE.keys())[:8]:
            _TRANSFER_CACHE.pop(old, None)
    return transfer


def propagate_asm(
    gray: np.ndarray,
    *,
    z_mm: float,
    min_gray: int,
    max_gray: int,
    pixel_x_um: float,
    pixel_y_um: float,
    h_max_um: float = 15.0,
    wavelength_nm: float = 550.0,
    n_mat: float = 1.56,
    n_air: float = 1.0,
    gpu: int = 0,
    prefer_gpu: bool = True,
) -> dict[str, Any]:
    h, w = gray.shape
    pad_y, pad_x = h // 2, w // 2
    hp, wp = h * 2, w * 2
    pixel_x_m = float(pixel_x_um) * 1e-6
    pixel_y_m = float(pixel_y_um) * 1e-6
    wavelength_m = float(wavelength_nm) * 1e-9
    h_max_m = float(h_max_um) * 1e-6
    z_m = float(z_mm) * 1e-3
    dn = float(n_mat) - float(n_air)
    k0 = 2.0 * math.pi / wavelength_m

    use_gpu = bool(prefer_gpu and cp is not None)
    backend = "cupy" if use_gpu else "numpy"
    transfer_backend = f"cupy:{int(gpu)}" if use_gpu else "numpy"
    t0 = time.perf_counter()
    height_m = _height_from_gray(gray, int(min_gray), int(max_gray), h_max_m)
    prep_ms = (time.perf_counter() - t0) * 1000.0

    t1 = time.perf_counter()
    if use_gpu:
        with cp.cuda.Device(int(gpu)):
            mask = cp.asarray(height_m, dtype=cp.float32)
            phase = (k0 * dn) * mask
            active = cp.exp(1j * phase).astype(cp.complex64)
            field = cp.zeros((hp, wp), dtype=cp.complex64)
            field[pad_y : pad_y + h, pad_x : pad_x + w] = active
            transfer = _get_transfer(cp, transfer_backend, hp, wp, pixel_y_m, pixel_x_m, wavelength_m, z_m)
            out = cp.fft.ifft2(cp.fft.fft2(field) * transfer)
            amp = cp.abs(out[pad_y : pad_y + h, pad_x : pad_x + w]).astype(cp.float32)
            amp = amp / cp.maximum(cp.max(amp), cp.float32(1e-12))
            view = cp.asnumpy(amp)
            cp.cuda.Stream.null.synchronize()
    else:
        phase = (k0 * dn) * height_m
        active = np.exp(1j * phase).astype(np.complex64)
        field = np.zeros((hp, wp), dtype=np.complex64)
        field[pad_y : pad_y + h, pad_x : pad_x + w] = active
        transfer = _get_transfer(np, backend, hp, wp, pixel_y_m, pixel_x_m, wavelength_m, z_m)
        out = np.fft.ifft2(np.fft.fft2(field) * transfer)
        amp = np.abs(out[pad_y : pad_y + h, pad_x : pad_x + w]).astype(np.float32)
        view = amp / max(float(amp.max()), 1e-12)
    prop_ms = (time.perf_counter() - t1) * 1000.0

    t2 = time.perf_counter()
    met = _metrics(view)
    png_b64 = _png_b64_rgb(_magma_rgb(view))
    encode_ms = (time.perf_counter() - t2) * 1000.0
    return {
        "backend": backend,
        "gpu": int(gpu) if use_gpu else None,
        "width": int(w),
        "height": int(h),
        "z_mm": float(z_mm),
        "pad_width": int(wp),
        "pad_height": int(hp),
        "prep_ms": prep_ms,
        "prop_ms": prop_ms,
        "encode_ms": encode_ms,
        "elapsed_ms": prep_ms + prop_ms + encode_ms,
        "amp_png_b64": png_b64,
        **met,
    }


class PatternHandler(SimpleHTTPRequestHandler):
    server_version = "PatternGeneratorGPU/0.1"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            gpu_count = 0
            cupy_version = None
            if cp is not None:
                try:
                    gpu_count = cp.cuda.runtime.getDeviceCount()
                    cupy_version = cp.__version__
                except Exception:
                    gpu_count = 0
            _json_response(
                self,
                200,
                {
                    "ok": True,
                    "backend": "cupy" if cp is not None and gpu_count > 0 else "numpy",
                    "cupy": cp is not None,
                    "cupy_version": cupy_version,
                    "gpu_count": gpu_count,
                    "static_root": str(self.server.static_root),  # type: ignore[attr-defined]
                },
            )
            return
        # Route /pattern-generator/ to this directory for compatibility with the public URL.
        if parsed.path == "/pattern-generator" or parsed.path == "/pattern-generator/":
            index_name = "index.html" if (Path(self.server.static_root) / "index.html").exists() else "interactive_generator_waveprop.html"  # type: ignore[attr-defined]
            self.path = "/" + index_name
        elif parsed.path.startswith("/pattern-generator/"):
            self.path = "/" + parsed.path[len("/pattern-generator/") :]
        return super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path != "/api/propagate":
            _json_response(self, 404, {"ok": False, "error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length)
            req = json.loads(body.decode("utf-8"))
            gray = _decode_png_data_url(str(req["gray_png"]))
            res = propagate_asm(
                gray,
                z_mm=float(req.get("z_mm", 1.0)),
                min_gray=int(req.get("min_gray", 0)),
                max_gray=int(req.get("max_gray", 255)),
                pixel_x_um=float(req.get("pixel_x_um", 2.7)),
                pixel_y_um=float(req.get("pixel_y_um", 2.7)),
                h_max_um=float(req.get("h_max_um", 15.0)),
                wavelength_nm=float(req.get("wavelength_nm", 550.0)),
                n_mat=float(req.get("n_mat", 1.56)),
                n_air=float(req.get("n_air", 1.0)),
                gpu=int(req.get("gpu", self.server.gpu)),  # type: ignore[attr-defined]
                prefer_gpu=bool(req.get("prefer_gpu", True)),
            )
            _json_response(self, 200, {"ok": True, **res})
        except Exception as exc:
            _json_response(self, 500, {"ok": False, "error": repr(exc)})

    def translate_path(self, path: str) -> str:
        # SimpleHTTPRequestHandler's directory arg is not available in old Python
        # subclass instances in all contexts, so root manually.
        parsed = urlparse(path)
        rel = unquote(parsed.path).lstrip("/")
        if not rel:
            rel = "index.html"
        rel = os.path.normpath(rel)
        if rel.startswith(".."):
            rel = "index.html"
        return str(Path(self.server.static_root) / rel)  # type: ignore[attr-defined]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--gpu", type=int, default=int(os.environ.get("PATTERN_GPU", "0")))
    ap.add_argument("--static-root", default=str(Path(__file__).resolve().parent))
    args = ap.parse_args()
    root = Path(args.static_root).resolve()
    if not (root / "interactive_generator_waveprop.html").exists() and not (root / "index.html").exists():
        raise SystemExit(f"static root does not look like pattern-generator dir: {root}")
    # The public/site file is index.html, repo source may be interactive_generator_waveprop.html.
    if not (root / "index.html").exists() and (root / "interactive_generator_waveprop.html").exists():
        print("[info] index.html missing; serving interactive_generator_waveprop.html for /pattern-generator/")
    mimetypes.add_type("application/json", ".json")
    server = ThreadingHTTPServer((args.host, args.port), PatternHandler)
    server.static_root = root  # type: ignore[attr-defined]
    server.gpu = int(args.gpu)  # type: ignore[attr-defined]
    backend = "cupy" if cp is not None else "numpy"
    print(f"serving {root}")
    print(f"open http://{args.host}:{args.port}/pattern-generator/  backend={backend} gpu={args.gpu}")
    server.serve_forever()


if __name__ == "__main__":
    main()
