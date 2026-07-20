# CAPT Verification Protocol

Reusable evidence-classification protocol for every CAPT module, release, PR,
benchmark, deployment, and review. This is the canonical schema — the website's
`VERIFICATION.md` is a consumer of this protocol, not the source.

## Evidence Classes

| Class | Meaning |
|---|---|
| **Verified This Session** | Fresh evidence gathered now (tool output, test run, curl, browser check) |
| **Previously Verified** | Evidence from earlier verified work, not re-confirmed this session |
| **Inferred** | Reasonable conclusion, unverified |
| **Needs Confirmation** | Outstanding uncertainty, blocker, or missing data |
| **Known Limitations** | Current constraints explicitly stated |
| **Human Validation** | Evidence from user interaction / explicit user statement |
| **Technical Validation** | Evidence from tests, tooling, build output |
| **Release Confidence** | Concise readiness assessment derived from the above |

## Rules

1. Never present Inferred as Verified.
2. Unknown is preferable to incorrect.
3. Stale data must be labeled, not silently carried forward.
4. Every report ends with all eight classes summarized.
5. The registry (`projects/*/metadata.json`) is the canonical source for
   "what exists today" — never duplicate it in prose.

## Consumers

- `inversion-labs-world/VERIFICATION.md` — website deployment reports
- `inversion-labs-world/GOVERNANCE.md` — field ownership + fallback
- Future: CAPT module releases, KHSB audits, CTP benchmarks, bioCAPT studies
