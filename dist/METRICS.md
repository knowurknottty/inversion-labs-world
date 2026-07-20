# Human Metrics Schema

Privacy-preserving, optional, no PII. Defined for future implementation.
No telemetry is collected today — this schema is the contract for when it is.

## Principles

- No personally identifying information (no names, emails, IPs, device IDs).
- All metrics are aggregate, anonymous, and opt-out capable.
- Document exactly what is measured, why, and how to opt out.

## Schema

| Metric | Definition | Why | Opt-out |
|---|---|---|---|
| `time_to_understand` | Seconds from arrival to path selection or first drawer open | Measures if org definition lands in 10s | Always anonymous; disable via `?nometrics=1` |
| `time_to_first_interaction` | Seconds from arrival to any click | Perceived responsiveness | Same |
| `path_selected` | Which path (human/builder/researcher/skip) | Most useful entry point | Same |
| `systems_explored` | Count of distinct drawers opened per session | Engagement depth | Same |
| `return_nav_frequency` | Times user re-opens index/drawer | Orientation success | Same |
| `cta_primary_rate` | Clicks on "Explore the ecosystem" / total sessions | Primary CTA effectiveness | Same |
| `drawer_completion_rate` | Drawers opened to bottom / drawers opened | Content usefulness | Same |

## Storage

- Event counts only, no payloads.
- 7-day rolling aggregate, no raw logs retained.
- Public dashboard shows only aggregate percentages.

## Status

**NOT IMPLEMENTED.** Schema defined per Phase V P5. No data exists.
If telemetry is added later, it must use this schema and the opt-out above.
