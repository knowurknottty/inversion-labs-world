# Migration Notes — Phase V+ (Ecosystem Metadata)

## Before (Phase V initial)

- Single `registry.json` with 13 projects, basic fields.
- `prepare_deploy.py` validated JSON only.
- No versioning, no dependency graph, no semantic validation.

## After (Phase V+ ecosystem metadata)

- `projects/<id>/metadata.json` — one file per project (reduces merge conflicts).
- `projects/_registry.json` — versioning + validation rules (root).
- `prepare_deploy.py` assembles `projects/*` into the injected registry.
- **Semantic validation** (schema compiler): dependency existence, no cycles,
  no duplicate IDs, valid stages/categories/visibility/verification levels,
  no broken links, no broken reverse-dependencies.
- **Versioning**: `registry_version`, `schema_version`, `content_version`,
  `generated_at`, `generated_by`, `verified_at`.
- **Extended schema**: slug, display_order, visibility, dependencies,
  reverse_dependencies, requires, provides, maintainers, license, tags,
  keywords, documentation_status, demo_status, test_status, release_channel,
  risk, stability, compatibility, updated_from, generated, source_of_truth,
  verification_level.
- **Search abstraction**: `Search.query()` provider seam — curated now,
  embedding-ready later. UI code unchanged.
- **`capt-verification/`**: reusable protocol promoted out of the website into
  shared IP (protocol.md, schema.json, report-template.md).

## How to Add a Project

1. Create `projects/<id>/metadata.json` with all required fields.
2. Run `python3 scripts/prepare_deploy.py` — assembles + semantically validates.
3. Commit + push `main` → GitHub Actions deploys.
4. No `index.html`/JS edit needed.

## How to Update Proof/Stage

1. Edit the field in `projects/<id>/metadata.json`.
2. Update `projects/_registry.json` `verified_at` date.
3. Rebuild + deploy.

## Breaking Changes

- `registry.json` removed. Source is now `projects/`.
- Injected registry shape: `{registry_version, schema_version, content_version,
  generated_at, generated_by, verified_at, source, projects:[...]}`.
- `index.html` reads `REG.projects` (unchanged access pattern).
- `searchEco` now delegates to `Search.query()` (provider seam).

## Semantic Validation Catches

- Self/cycle dependencies (e.g. excursion↔field mutual dependency → caught, fixed).
- Broken links, missing required fields, invalid enums.

## Known Limitations

- Live data (releases, repo activity) not fetched — `source: curated`.
- Telemetry schema defined but not implemented (see METRICS.md).
- Per-system repo URLs still point to org where no specific repo confirmed.
- Embedding search not yet implemented; `Search.provider='curated'`.
