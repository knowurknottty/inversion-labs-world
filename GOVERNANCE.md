# Governance

Ownership, update responsibility, fallback behavior, validation, and error
handling for the Inversion Labs ecosystem interface.

## Metadata Field Ownership

| Field | Owner | Update Trigger |
|---|---|---|
| `name`, `subtitle`, `role` | Project lead | Renaming or repositioning |
| `type`, `stage` | Project lead + review | Release or maturity change |
| `thesis`, `description`, `before`, `after` | Project lead | Copy refinement (quarterly) |
| `depends_on` | Architecture owner | Build/init dependency change (must stay acyclic) |
| `integrates_with` | Architecture owner | Peer integration (cycles allowed) |
| `related_to` | Experience owner | Thematic link |
| `proof.exists`, `proof.for` | Project lead | Release |
| `proof.open` | Project lead | Repo/demo URL change |
| `proof.url_tier` | Release engineer | Link tier audit (org-root vs project-specific) |
| `proof.url_reachability` | CI | Automated link check |
| `provenance.*` | Field-level owner | Per-field source update |
| `inv.*` | Experience owner | Path copy review |
| `color`, `position` | Experience owner | Visual layout only |
| `audience` | Project lead | Target shift |
| `lastValidated` (registry root) | Release engineer | Every deploy |

## Relationship Semantics

Not all links are dependencies. The validator distinguishes:

- **`depends_on`** — build/init-time dependency. **MUST be acyclic.** Enforced.
- **`integrates_with`** — peer integration. Cycles allowed (e.g. excursion ↔ field).
- **`provides_to`** — capability exposed to others. Cycles allowed.
- **`consumes_from`** — capability consumed from others. Cycles allowed.
- **`related_to`** — thematic/contextual link. Cycles allowed.
- **`supersedes`** — replaces a prior system. Acyclic by nature.

A blanket DAG rule on all relationships is incorrect for ecosystem modeling.
Only `depends_on` is acyclic-enforced.

## Link Validation Tiers

URLs are not equivalent. Track per link:

- `syntactically_valid` — parses, allowed scheme
- `reachable` — HTTP 2xx at last check
- `authoritative` — points to the project's own repo/docs/demo, not an org root
- `last_verified` — timestamp of last reachability check
- `expected_content_type` — html/json/markdown per purpose

A valid GitHub org URL (`github.com/org`) is NOT equivalent to a project repo
(`github.com/org/repo`). The registry tracks `url_tier: org-root | project-specific`.

## Provenance (field-level)

A project-wide `source_of_truth` is insufficient. Fields originate from different
sources:

- `stage` → registry governance
- `proof.exists` → curated
- `documentation_status` → docs CI (pending)
- `demo_status` → deployment health (pending)
- `test_status` → CI (pending)

Each project carries a `provenance` map declaring per-field source. Eventually
this becomes source-mapped automation.

## Generated-File Discipline

`projects/_registry.json` declares registry policy and release metadata.
Project records remain in `projects/*/metadata.json`. During `npm run build`,
`prepare_vite_deploy.py` validates both and emits generated
`public/registry.json` and `public/verification.json`. Rules:

- Do not hand-edit the generated files under `public/`.
- Edit `_registry.json` only when schema policy or release metadata changes.
- CI regenerates the public artifacts; builds fail when source metadata is invalid.
- `generated_at` derives from `SOURCE_DATE_EPOCH` or the triggering commit
  timestamp — never `datetime.now()` — for reproducible artifacts.

## Update Responsibilities

- Edit `projects/<id>/metadata.json`.
- Run `npm run build` — validates metadata, builds the Vite application, and
  carries governed legacy assets into the deployment artifact.
- Generated public artifacts are ignored by Git and regenerated automatically.
- Deploy via GitHub Actions (push to `main`).

## Fallback Behavior

- If governed metadata fails to parse or validate, the build stops and the last
  successful Cloudflare deployment remains live.
- The active architecture experience uses an explicitly illustrative fixture;
  governed ecosystem metadata remains available at `/registry.json`.
- If `depends_on` references unknown id: build refuses (SystemExit).
- If `integrates_with` references unknown id: build refuses (broken link).
- Unknown is preferable to incorrect — missing data shows as "Not specified".

## Validation Rules

- `prepare_vite_deploy.py` uses the registry validator to enforce valid JSON per
  file, required fields, valid enums,
  `depends_on` acyclicity, link existence, `url_tier` present, `provenance` present.
- Build fails (non-zero exit) if semantic validation fails → no deploy.
- `schema_version` is checked; future versions rejected until migration defined.

## Error Handling

- Registry parse error → build failure before deployment.
- Missing field → build refuses (SystemExit with field name).
- Deploy failure → GitHub Actions shows red; last good `dist/` remains live.

## Stale-Data Handling

- `verified_at` in registry root is the freshness signal.
- Interface shows `source: curated` in registry root — never implies live fetch
  unless integrated.
- Issues are tracked in `registry/issues/` as structured JSON (e.g.
  `VERIF-001.json`), not a single markdown file. See IES §8–§9 for governance
  and compatibility policy.

## Single Deployment Authority

`main` → registry validation → Vite build → `dist/` → Cloudflare Pages
(`wrangler pages deploy dist --project-name inversion-labs-world --branch main`).
No other deploy method is active.
