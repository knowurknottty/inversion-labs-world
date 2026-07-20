# Verification Report Template

Copy this template for every CAPT module release, PR, benchmark, deployment,
or review. Fill all sections. Do not omit — write "none" if empty.

---

**Subject:** <module / release / PR / deploy / benchmark>

## Evidence

**Verified This Session**
- <fresh tool output, test run, curl, browser check>

**Previously Verified**
- <evidence from earlier verified work, not re-confirmed now>

**Inferred**
- <reasonable conclusion, unverified>

**Needs Confirmation**
- <outstanding uncertainty or blocker>

**Known Limitations**
- <current constraints, stated honestly>

**Human Validation**
- <evidence from user interaction or explicit statement>

**Technical Validation**
- <tests, tooling, build output>

## Release Confidence

<DEPLOYED | PARTIAL | BLOCKED | PENDING> — <one-line readiness assessment>

---

## Rules

- Never present Inferred as Verified.
- Unknown is preferable to incorrect.
- Stale data must be labeled, not carried forward silently.
- The registry (`projects/*/metadata.json`) is canonical for "what exists today".
