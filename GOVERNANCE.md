# Governance

Ownership, update responsibility, fallback behavior, validation, and error
handling for the Inversion Labs ecosystem interface.

## Metadata Field Ownership

| Field | Owner | Update Trigger |
|---|---|---|
| `name`, `subtitle`, `role` | Project lead | Renaming or repositioning |
| `type`, `stage` | Project lead + review | Release or maturity change |
| `thesis`, `description`, `before`, `after` | Project lead | Copy refinement (quarterly) |
| `links` | Architecture owner | New connection established |
| `proof.exists`, `proof.for` | Project lead | Release |
| `proof.open` | Project lead | Repo/demo URL change |
| `proof.limit` | Project lead | Honest constraint noted |
| `inv.*` | Experience owner | Path copy review |
| `color`, `position` | Experience owner | Visual layout only |
| `audience` | Project lead | Target shift |
| `lastValidated` (registry root) | Release engineer | Every deploy |

## Update Responsibilities

- `registry.json` is edited directly. No HTML change needed.
- After edit, run `python3 scripts/prepare_deploy.py` — it validates schema and injects.
- Deploy via GitHub Actions (push to `main`).

## Fallback Behavior

- If `registry.json` fails to parse: page shows arrival + static fallback, logs error to console, boot guard releases.
- If a project's `proof.open` is missing: drawer shows "No public link yet" instead of empty.
- If `links` reference an unknown id: connection line is skipped, no crash.
- Unknown is preferable to incorrect — missing data shows as "Not specified", never fabricated.

## Validation Rules

- `prepare_deploy.py` enforces: valid JSON, required fields present, registry injected.
- Build fails (non-zero exit) if schema invalid → no deploy.
- `lastValidated` date must be updated on every registry edit.

## Error Handling

- Registry parse error → console.error + safe mode (boot releases, arrival visible).
- Missing field → build refuses (SystemExit with field name).
- Deploy failure → GitHub Actions shows red; last good `dist/` remains live (Cloudflare keeps prior production deploy).

## Stale-Data Handling

- `lastValidated` in registry root is the freshness signal.
- If a deploy occurs without updating `lastValidated`, the build warns (not blocks).
- Interface shows `source: curated` in registry root — never implies live fetch unless integrated.

## Single Deployment Authority

`main` → `dist/` (built by `prepare_deploy.py`) → Cloudflare Pages (`wrangler pages deploy dist --project-name inversion-labs-world --branch main`).
No other deploy method is active.
