# Inversion Ecosystem Specification (IES)

**Version:** 1.0
**Status:** Canonical contract
**Date:** 2026-07-20
**Owner:** Inversion Labs

IES is the single coherent specification that governs how Inversion Labs
projects describe themselves, prove their state, relate to each other, and
evolve. It replaces ad-hoc per-tool schemas with one shared foundation that
the website, CI, CAPT, Knowledge Bubbles, and release tooling all consume.

---

## 1. Metadata Schema

Every project is a `projects/<id>/metadata.json` file.

### Required fields
`id`, `slug`, `name`, `type`, `stage`, `thesis`, `description`, `links`, `proof`

### Core fields
| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique, stable |
| `slug` | string | URL/path-safe |
| `name` | string | Display name |
| `subtitle` | string | One-line role |
| `role` | string | Function in ecosystem |
| `category` | enum | Architecture / Protocol / Product / Research program / Field practice |
| `type` | string | Free-form type label |
| `stage` | enum | Live / Active development / Open research / Living practice / Concept / Archived |
| `visibility` | enum | public / experimental / internal / archived |
| `verification_level` | enum | verified / inferred / curated / needs-confirmation |
| `audience` | string[] | human / builder / researcher |
| `color` | string | Hex (visual only) |
| `position` | {x,y,z} | Constellation coords (visual only) |
| `thesis` | string | One-line purpose |
| `description` | string | Expanded |
| `before` / `after` | string | Transformation framing |
| `inv` | {human,builder,researcher} | Path copy |
| `links` | string[] | IDs of related projects |
| `proof` | object | See §3 |
| `display_order` | int | Index sort |

### Extended fields
`dependencies` (deprecated → use relationship types below),
`maintainers`, `license`, `tags`, `keywords`,
`documentation_status`, `demo_status`, `test_status`,
`release_channel`, `risk`, `stability`, `compatibility`,
`updated_from`, `generated`, `source_of_truth`.

---

## 2. Relationship Ontology

Relationships are knowledge-graph edges, not website concepts.

| Type | Acyclicity | Meaning |
|---|---|---|
| `depends_on` | **acyclic** | Build/init/runtime dependency |
| `extends` | **acyclic** | Inheritance/specialization |
| `supersedes` | **acyclic** | Replacement of prior system |
| `derived_from` | **acyclic** | Lineage/source |
| `integrates_with` | cycles allowed | Bidirectional capability |
| `provides` | cycles allowed | Capability exposed |
| `consumes` | cycles allowed | Capability consumed |
| `related_to` | cycles allowed | Informational/thematic |
| `inspired_by` | cycles allowed | Historical influence |
| `optional_with` | cycles allowed | Enhancement-only |
| `conflicts_with` | symmetric | Mutually exclusive (must be reciprocated) |

Only `depends_on`, `extends`, `supersedes`, `derived_from` are acyclic-enforced.
All others may form strongly connected components — this is correct ecosystem
modeling, not a defect.

---

## 3. Proof & URL Classification

`proof` object:
```
{
  "exists": string,      // what exists
  "for": string,         // who it's for
  "open": string|null,   // public URL
  "limit": string|null,  // honest constraint
  "url_class": enum,     // see below
  "url_tier": enum,      // project-specific | org-root
  "url_reachability": enum, // unverified | reachable | broken
  "url_last_checked": date
}
```

### URL classes
`canonical` | `project_repo` | `documentation` | `demo` | `release` |
`ci` | `roadmap` | `organization` | `archive` | `external_reference`

A valid org URL (`github.com/org`) is NOT equivalent to a project repo
(`github.com/org/repo`). `url_tier: project-specific` requires `url_class`
in (canonical, project_repo, documentation, demo).

---

## 4. Provenance Schema (field-level trust)

Every provenance entry:
```
{
  "source": string,        // where the value came from
  "confidence": enum,      // verified | inferred | curated | needs-confirmation
  "verified_at": date,
  "verified_by": string,
  "refresh_policy": string,// per-release | quarterly | on-push | on-deploy | ...
  "authority": string      // who owns the source
}
```

This lets CAPT reason about trust: a field with `confidence: needs-confirmation`
from `curated` source is treated differently than `verified` from `registry-governance`.

---

## 5. Maturity Model

Stages map to maturity:
- **Concept** → idea, no implementation
- **Active development** → building, unstable API
- **Live** → shipped, used
- **Open research** → public inquiry
- **Living practice** → ongoing field activity
- **Archived** → retired, kept for history

Visibility controls who sees it: `public` (all), `experimental` (opt-in),
`internal` (team), `archived` (historical).

---

## 6. Release Protocol

1. Edit `projects/<id>/metadata.json`.
2. Run `python3 scripts/prepare_deploy.py` — assembles + semantically validates.
3. `_registry.json` regenerated automatically (do not hand-edit).
4. Commit + push `main` → GitHub Actions deploys `dist/` to Cloudflare Pages.
5. `verification.json` emitted as machine-readable evidence.

---

## 7. Trust Model

- Unknown is preferable to incorrect.
- `source: curated` means manually maintained, not live-fetched.
- Live synchronization (GitHub API → registry fields) is a future integration
  with explicit provenance + freshness policies.
- Confidence scores propagate: a project's overall trust = min(confidence) of
  its provenance entries.

---

## 8. Governance Rules

- `projects/_registry.json` is generated output. CI regenerates + diffs it.
  Build fails if committed aggregate is stale.
- `generated_at` derives from `SOURCE_DATE_EPOCH` or commit timestamp — never
  `datetime.now()` (reproducible artifacts).
- Schema major version rejection: consumers refuse `schema_version` major > supported.
- `minimum_reader` / `minimum_writer` declared separately (reader/writer compat
  are different concerns).

---

## 9. Compatibility Policy

- `schema_version: MAJOR.MINOR.PATCH`
- MAJOR: breaking change → migration required, old consumers reject.
- MINOR: backward-compatible addition.
- PATCH: correction, no schema change.
- `minimum_reader`: lowest version that can read this registry.
- `minimum_writer`: lowest version that can write a valid registry.
- Migrations are defined per MAJOR bump; unsupported future versions are
  rejected with an explicit "define migration" message.

---

## 10. Machine-Readable Verification

`verification.json` (schema `ies-verification/1.0`) is emitted on every build:
```
{
  "schema": "ies-verification/1.0",
  "checks": { "syntax":"pass", "schema":"pass", "relationships":"pass", ... },
  "project_count": N,
  "confidence": 0.0-1.0,
  "notes": [...]
}
```
CI, CAPT, KB, and release tooling consume this — not markdown reports.

---

## Evolution

IES is versioned, not perfect. Ship it, migrate it, let real ecosystems drive
the next field. The existence of a migration path is more valuable than
predicting every future need today.
