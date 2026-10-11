"""Génère la grille tarifaire Eterna en PNG (1080 × 1920, retina) et en PDF.

Usage : python3 grille-tarifaire/build.py
Sert le dépôt en local pour que Chrome charge les polices de public/fonts.
"""
import functools
import http.server
import pathlib
import subprocess
import threading

ROOT = pathlib.Path(__file__).resolve().parent.parent
HERE = ROOT / "grille-tarifaire"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 4340

DEPLACEMENT = "Le déplacement, offert jusqu'à 40 km"


def render_html():
    html = (HERE / "grille-tarifaire.html").read_text()
    html = html.replace("{{logo}}", (ROOT / "src/assets/eterna-logo.svg").read_text())
    html = html.replace("{{deplacement}}", DEPLACEMENT)
    out = HERE / "build.html"
    out.write_text(html)
    return out


def main():
    render_html()
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{PORT}/grille-tarifaire/build.html"
    common = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=3000"]
    try:
        subprocess.run(common + ["--window-size=1080,1920", "--force-device-scale-factor=2",
                                 f"--screenshot={HERE / 'eterna-tarifs-2026.png'}", url],
                       check=True, capture_output=True)
        subprocess.run(common + ["--no-pdf-header-footer",
                                 f"--print-to-pdf={HERE / 'eterna-tarifs-2026.pdf'}", url],
                       check=True, capture_output=True)
    finally:
        server.shutdown()
    (HERE / "build.html").unlink()
    print("ok:", HERE / "eterna-tarifs-2026.png", HERE / "eterna-tarifs-2026.pdf")


if __name__ == "__main__":
    main()
