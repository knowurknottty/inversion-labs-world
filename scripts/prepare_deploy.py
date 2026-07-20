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

    # Schema version policy: reject unsupported future major versions.
    SUPPORTED_MAJOR = 2
    sv = root.get("schema_version", "0.0.0")
    try:
        major = int(sv.split(".")[0])
    except (ValueError, AttributeError):
        raise SystemExit(f"Invalid schema_version: {sv}")
    if major > SUPPORTED_MAJOR:
        raise SystemExit(
            f"Unsupported schema_version {sv} (max supported major: {SUPPORTED_MAJOR}). "
            f"Define a migration before consuming future schemas."
        )

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
        # Links / relationships must reference existing projects
        for link in p.get("links", []):
            if link not in id_set:
                errors.append(f"{pid}: broken link to '{link}'")
        for dep in p.get("depends_on", []):
            if dep not in id_set:
                errors.append(f"{pid}: broken depends_on '{dep}'")
        for rel in p.get("integrates_with", []):
            if rel not in id_set:
                errors.append(f"{pid}: broken integrates_with '{rel}'")
        for rel in p.get("related_to", []):
            if rel not in id_set:
                errors.append(f"{pid}: broken related_to '{rel}'")
        # Link tier tracking must exist
        if "url_tier" not in p.get("proof", {}):
            errors.append(f"{pid}: proof.url_tier missing (link tier tracking required)")
        # Provenance map must exist
        if "provenance" not in p:
            errors.append(f"{pid}: provenance map missing (field-level source required)")

    # Acyclicity enforced ONLY on depends_on (build/init deps).
    # integrates_with / related_to / provides_to / consumes_from may cycle.
    graph = {p["id"]: p.get("depends_on", []) for p in projects}
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {k: WHITE for k in graph}

    def dfs(node, stack):
        color[node] = GRAY
        for nxt in graph.get(node, []):
            if color.get(nxt) == GRAY:
                errors.append(f"depends_on cycle (must be acyclic): {' -> '.join(stack + [nxt])}")
            elif color.get(nxt) == WHITE:
                dfs(nxt, stack + [node])
        color[node] = BLACK

    for n in graph:
        if color[n] == WHITE:
            dfs(n, [])

    # integrates_with cycles are LEGITIMATE — logged, not failed.
    iw_graph = {p["id"]: p.get("integrates_with", []) for p in projects}
    iw_cycles = []
    icolor = {k: WHITE for k in iw_graph}
    def iw_dfs(node, stack):
        icolor[node] = GRAY
        for nxt in iw_graph.get(node, []):
            if icolor.get(nxt) == GRAY:
                iw_cycles.append(' -> '.join(stack + [nxt]))
            elif icolor.get(nxt) == WHITE:
                iw_dfs(nxt, stack + [node])
        icolor[node] = BLACK
    for n in iw_graph:
        if icolor[n] == WHITE:
            iw_dfs(n, [])

    if errors:
        raise SystemExit("Semantic validation failed:\n  " + "\n  ".join(errors))

    if iw_cycles:
        # Informational only — legitimate bidirectional relationships
        print(f"  note: {len(iw_cycles)} integrates_with cycle(s) allowed (e.g. {iw_cycles[0]})")


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("index.html is missing")

    reg = load_registry()
    validate_semantics(reg)

    # Reproducible timestamp: SOURCE_DATE_EPOCH > git commit timestamp > static
    import os
    import subprocess
    gen_at = reg["root"].get("generated_at")
    if gen_at == "SOURCE_DATE_EPOCH":
        epoch = os.environ.get("SOURCE_DATE_EPOCH")
        if epoch:
            import datetime
            gen_at = datetime.datetime.utcfromtimestamp(int(epoch)).strftime("%Y-%m-%d")
        else:
            try:
                out = subprocess.run(
                    ["git", "log", "-1", "--format=%ci"],
                    capture_output=True, text=True, cwd=ROOT
                )
                gen_at = out.stdout.strip()[:10] if out.returncode == 0 else "2026-07-20"
            except Exception:
                gen_at = "2026-07-20"

    # Build the injected registry object (flat, UI-compatible)
    injected = {
        "registry_version": reg["root"].get("registry_version"),
        "schema_version": reg["root"].get("schema_version"),
        "content_version": reg["root"].get("content_version"),
        "generated_at": gen_at,
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
