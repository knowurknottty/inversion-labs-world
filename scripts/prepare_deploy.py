#!/usr/bin/env python3
"""Prepare a verified Cloudflare Pages artifact with a fail-open boot guard."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SOURCE = ROOT / "index.html"
REGISTRY = ROOT / "registry.json"

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

    if not REGISTRY.exists():
        raise SystemExit("registry.json is missing — single source of truth required")

    # Validate registry schema
    try:
        reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"registry.json is invalid JSON: {exc}")

    required_fields = {"id", "name", "type", "stage", "thesis", "description", "links", "proof"}
    for proj in reg.get("projects", []):
        missing = required_fields - proj.keys()
        if missing:
            raise SystemExit(f"Project {proj.get('id','?')} missing fields: {missing}")

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

    # Inject registry as single source of truth
    registry_js = REGISTRY.read_text(encoding="utf-8").strip()
    if "<!--REGISTRY-->" not in index:
        raise SystemExit("Registry placeholder missing in index.html")
    index = index.replace("<!--REGISTRY-->", registry_js, 1)

    (DIST / "index.html").write_text(index, encoding="utf-8")

    required = [
        'id="arrival"',
        'id="enterBtn"',
        'function rev()',
        'new THREE.Scene',
        'id="boot-guard"',
        'id="registry"',
        'function searchEco',
        'function applyMode',
    ]
    missing = [token for token in required if token not in index]
    if missing:
        raise SystemExit(f"Prepared artifact is missing required tokens: {missing}")

    if index.count("<script") != index.count("</script>"):
        raise SystemExit("Prepared artifact has unbalanced script tags")

    # Verify registry parses in built artifact
    import re
    m = re.search(r'<script type="application/json" id="registry">(.*?)</script>', index, re.S)
    if not m or not m.group(1).strip():
        raise SystemExit("Registry not injected into built artifact")

    print(f"Prepared {DIST} ({len(index) / 1024:.1f} KiB index.html, {len(reg['projects'])} registry projects)")


if __name__ == "__main__":
    main()
