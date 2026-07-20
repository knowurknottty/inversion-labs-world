# Migration Notes — Phase V (Living Ecosystem)

## Before (Phase III/IV)

- Project metadata hardcoded in `index.html` as a `const S=[...]` array.
- Adding a project required editing UI logic + the array + the constellation positions.
- No search, no progressive disclosure, no single source of truth.

## After (Phase V)

- `registry.json` is the single source of truth (P1, P2).
- `index.html` contains `<script type="application/json" id="registry"><!--REGISTRY--></script>`.
- `prepare_deploy.py` validates `registry.json` (JSON parse + required fields) and injects it into the placeholder at build time.
- UI renders from `REG.projects` — no hardcoded array.
- Search (`searchEco`) queries registry with semantic hints (P6).
- Progressive disclosure (`applyMode`) filters by experience level (P7).
- Docs: `VERIFICATION.md`, `METRICS.md`, `GOVERNANCE.md` (P4, P5, P10).

## How to Add a Project

1. Add an entry to `registry.json` with all required fields.
2. Run `python3 scripts/prepare_deploy.py` (validates + builds `dist/`).
3. Commit + push `main` → GitHub Actions deploys.
4. No HTML/JS edit required. Constellation position comes from `position` field.

## How to Update Proof/Stage

1. Edit the field in `registry.json`.
2. Update `lastValidated` date.
3. Rebuild + deploy.

## Breaking Changes

- `S` array removed. Any external script referencing `window.S` must use `REG.projects`.
- `idx()` now uses `sysCard()` helper (shared by index + mode filter).
- `pr()` unchanged in signature; reads from mapped `S` (same shape as before).

## Verification

- `node --check` on extracted script: PASS.
- `prepare_deploy.py`: validates registry, injects, exits 0.
- Production: registry present in DOM, search + mode filter functional.

## Known Limitations

- Search is client-side keyword + curated semantic map, not NLP.
- Live data (releases, repo activity) not fetched — `source: curated` in registry.
- Telemetry schema defined but not implemented (see METRICS.md).
- Per-system repo URLs still point to org where no specific repo confirmed.
