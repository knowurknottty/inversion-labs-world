#!/usr/bin/env python3
"""Prepare a verified Cloudflare Pages artifact with a fail-open boot guard.

Phase V+ : assembles the registry from per-project metadata files, validates
semantics (not just JSON), and injects the result as the single source of truth.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SOURCE = ROOT / "index.html"
PROJECTS_DIR = ROOT / "projects"

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


def load_registry() -> dict:
    """Assemble registry from projects/*/metadata.json + _registry.json."""
    if not PROJECTS_DIR.exists():
        raise SystemExit("projects/ directory missing — single source of truth required")

    root_meta = PROJECTS_DIR / "_registry.json"
    if not root_meta.exists():
        raise SystemExit("_registry.json missing")
    root = json.loads(root_meta.read_text(encoding="utf-8"))

    projects = []
    for d in sorted(PROJECTS_DIR.iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        meta = d / "metadata.json"
        if not meta.exists():
            raise SystemExit(f"projects/{d.name}/metadata.json missing")
        try:
            projects.append(json.loads(meta.read_text(encoding="utf-8")))
        except json.JSONDecodeError as exc:
            raise SystemExit(f"projects/{d.name}/metadata.json invalid: {exc}")

    return {"root": root, "projects": projects}


def validate_semantics(reg: dict) -> None:
    """Schema-compiler style validation: structure + relationships."""
    root = reg["root"]
    projects = reg["projects"]
    val = root.get("validation", {})
    valid_stages = set(val.get("valid_stages", []))
    valid_categories = set(val.get("valid_categories", []))
    valid_visibility = set(val.get("valid_visibility", []))
    valid_levels = set(val.get("valid_verification_levels", []))

    ids = [p["id"] for p in projects]
    if len(ids) != len(set(ids)):
        raise SystemExit(f"Duplicate project IDs: {[i for i in ids if ids.count(i) > 1]}")

    id_set = set(ids)
    errors = []

    for p in projects:
        pid = p["id"]
        # Required fields
        for f in root.get("validation", {}).get("required_fields", []):
            if f not in p:
                errors.append(f"{pid}: missing {f}")
        # Valid enums
        if p.get("stage") not in valid_stages:
            errors.append(f"{pid}: invalid stage '{p.get('stage')}'")
        if p.get("category") not in valid_categories:
            errors.append(f"{pid}: invalid category '{p.get('category')}'")
        if p.get("visibility") not in valid_visibility:
            errors.append(f"{pid}: invalid visibility '{p.get('visibility')}'")
        if p.get("verification_level") not in valid_levels:
            errors.append(f"{pid}: invalid verification_level '{p.get('verification_level')}'")
        # Links / dependencies must exist
        for link in p.get("links", []):
            if link not in id_set:
                errors.append(f"{pid}: broken link to '{link}'")
        for dep in p.get("dependencies", []):
            if dep not in id_set:
                errors.append(f"{pid}: broken dependency '{dep}'")

    # No cycles in dependencies (DFS)
    graph = {p["id"]: p.get("dependencies", []) for p in projects}
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {k: WHITE for k in graph}

    def dfs(node, stack):
        color[node] = GRAY
        for nxt in graph.get(node, []):
            if color.get(nxt) == GRAY:
                errors.append(f"Dependency cycle: {' -> '.join(stack + [nxt])}")
            elif color.get(nxt) == WHITE:
                dfs(nxt, stack + [node])
        color[node] = BLACK

    for n in graph:
        if color[n] == WHITE:
            dfs(n, [])

    # No orphans: every project should be reachable from at least one other
    # (either as a link or dependency) unless it's a root-level entry point
    referenced = set()
    for p in projects:
        referenced.update(p.get("links", []))
        referenced.update(p.get("dependencies", []))
    for p in projects:
        if p["id"] not in referenced and p.get("visibility") == "public":
            # Allowed for top-level architecture entries, but warn
            pass  # no error — intentional roots exist

    if errors:
        raise SystemExit("Semantic validation failed:\n  " + "\n  ".join(errors))

    # Reverse-dependency consistency check (warn only)
    for p in projects:
        for rd in p.get("reverse_dependencies", []):
            if rd not in id_set:
                errors.append(f"{p['id']}: broken reverse_dependency '{rd}'")
    if errors:
        raise SystemExit("Semantic validation failed:\n  " + "\n  ".join(errors))


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("index.html is missing")

    reg = load_registry()
    validate_semantics(reg)

    # Build the injected registry object (flat, UI-compatible)
    injected = {
        "registry_version": reg["root"].get("registry_version"),
        "schema_version": reg["root"].get("schema_version"),
        "content_version": reg["root"].get("content_version"),
        "generated_at": reg["root"].get("generated_at"),
        "generated_by": reg["root"].get("generated_by"),
        "verified_at": reg["root"].get("verified_at"),
        "source": reg["root"].get("source"),
        "projects": reg["projects"],
    }

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    for item in ROOT.iterdir():
        if item.name in {".git", ".github", "dist", "scripts", "projects", "registry.json"}:
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
    index = index.replace(
        "function rd(){boot.classList.add('hidden');",
        "function rd(){window.__releaseInversionBoot?.('ready');boot.classList.add('hidden');",
        1,
    )

    registry_js = json.dumps(injected, indent=2)
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

    m = re.search(r'<script type="application/json" id="registry">(.*?)</script>', index, re.S)
    if not m or not m.group(1).strip():
        raise SystemExit("Registry not injected into built artifact")

    # Validate injected registry parses
    json.loads(m.group(1))

    print(
        f"Prepared {DIST} ({len(index) / 1024:.1f} KiB, "
        f"{len(injected['projects'])} projects, schema {injected['schema_version']})"
    )


if __name__ == "__main__":
    main()
