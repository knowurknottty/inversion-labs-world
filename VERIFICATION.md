# Verification Protocol

Every release report, audit, benchmark, and deployment note for Inversion Labs
must classify evidence using the categories below. This is enforced by the
agent's reporting discipline and is part of the product's honesty guarantee.

## Evidence Classes

| Class | Meaning | Example |
|---|---|---|
| **Verified This Session** | Fresh evidence gathered now (tool output, test run, curl, browser check) | `node --check: PASS`, workflow `success`, curl returns SHA |
| **Previously Verified** | Evidence from earlier verified work, not re-confirmed this session | "Phase III browser test passed on 2026-07-20" |
| **Inferred** | Reasonable conclusion, unverified | "Mobile touch likely improved by Systems-view default" |
| **Needs Confirmation** | Outstanding uncertainty, blocker, or missing data | "Per-system repo URLs point to org, not specific repos" |
| **Known Limitations** | Current constraints explicitly stated | "Early access; claims measured not certified" |
| **Human Validation** | Evidence from user interaction / explicit user statement | User confirmed token, user approved CTA copy |
| **Technical Validation** | Evidence from tests, tooling, build output | `prepare_deploy.py` exit 0, JSON schema valid |
| **Release Confidence** | Concise readiness assessment derived from the above | "DEPLOYED — all checks green, one inferred gap (mobile touch)" |

## Rules

1. Never present Inferred as Verified.
2. Unknown is preferable to incorrect.
3. Stale data must be labeled, not silently carried forward.
4. Every deployment report ends with: Verified / Previously Verified / Inferred / Needs Confirmation / Known Limitations / Release Confidence.
5. The registry (`registry.json`) is the canonical source for "what exists today" — never duplicate it in prose.

## Application

- Deployment reports: use all classes above.
- Release notes: Verified This Session + Known Limitations + Release Confidence.
- Audits: Technical Validation + Human Validation + Needs Confirmation.
- Benchmarks: Verified This Session + Known Limitations (state test conditions).
