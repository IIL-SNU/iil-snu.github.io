# Pattern Generator

Interactive learned-fab wave-valid pattern generator and native LF propagation audit artifacts.

Main page: https://iilab.io/pattern-generator/

## Internal GPU backend

The public GitHub Pages page runs browser FFT by default. For full-resolution or z-sweep work inside the lab network, serve this directory from the GPU server and enable **Internal GPU backend** in the page.

```bash
cd pattern-generator
python3 pattern_generator_gpu_server.py --host 0.0.0.0 --port 8080 --gpu 0 --static-root .
```

Open `http://<internal-server-ip>:8080/pattern-generator/`, check the backend health, then enable server ASM propagation. The backend uses CuPy/CUDA when available and falls back to NumPy otherwise.
