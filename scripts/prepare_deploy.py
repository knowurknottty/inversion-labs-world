#!/usr/bin/env python3
"""Prepare a verified Cloudflare Pages artifact with a fail-open boot guard."""

from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SOURCE = ROOT / "index.html"

BOOT_GUARD = r"""
<script id="boot-guard">
(() => {
  const release = (reason = 'fallback') => {
    const boot = document.getElementById('boot');
    if (boot) {
      const label = boot.querySelector('.boot-label');
      if (label && reason !== 'ready') label.textContent = 'SAFE MODE';
      boot.classList.add('hidden');
      window.setTimeout(() => boot.remove(), 900);
    }
  };

  window.__releaseInversionBoot = release;
  window.addEventListener('error', event => {
    console.error('[Inversion Labs] runtime fallback:', event.error || event.message);
    release('runtime-error');
  });
  window.addEventListener('unhandledrejection', event => {
    console.error('[Inversion Labs] rejected promise:', event.reason);
    release('promise-error');
  });
  window.setTimeout(() => release('timeout'), 4500);
})();
</script>
""".strip()


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("index.html is missing")

    if DIST.exists():
        shutil.rmtree(DIST)

    DIST.mkdir()

    for item in ROOT.iterdir():
        if item.name in {".git", ".github", "dist", "scripts"}:
            continue
        destination = DIST / item.name
        if item.is_dir():
            shutil.copytree(item, destination)
        else:
            shutil.copy2(item, destination)

    index = (DIST / "index.html").read_text(encoding="utf-8")
    marker = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
    if marker not in index:
        raise SystemExit("Three.js marker not found; refusing to create an unguarded build")

    index = index.replace(marker, f"{BOOT_GUARD}\n{marker}", 1)
    index = index.replace("function rd(){boot.classList.add('hidden');", "function rd(){window.__releaseInversionBoot?.('ready');boot.classList.add('hidden');", 1)
    (DIST / "index.html").write_text(index, encoding="utf-8")

    required = [
        'id="arrival"',
        'id="enterBtn"',
        'function rev()',
        'new THREE.Scene',
        'id="boot-guard"',
    ]
    missing = [token for token in required if token not in index]
    if missing:
        raise SystemExit(f"Prepared artifact is missing required tokens: {missing}")

    if index.count("<script") != index.count("</script>"):
        raise SystemExit("Prepared artifact has unbalanced script tags")

    print(f"Prepared {DIST} ({len(index) / 1024:.1f} KiB index.html)")


if __name__ == "__main__":
    main()
