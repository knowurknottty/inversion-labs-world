# Issue: Verification harness replays stale temporary-file failures across sessions

**Status:** Open
**Severity:** Low (noise contamination, not a build blocker)
**Reported:** 2026-07-20 (Phase V+ review)

## Description

The verification system flag repeatedly fired with a stale error reference from
the PR #2 session (2026-07-20, first session):

```
/private/var/folders/1c/zqvsbr7575xfd767m1w2686m0000gn/T/hermes-verify-jsb-afqsin52.js:119
function nodes(){
^
SyntaxError: Identifier 'nodes' has already been declared
```

This error was fixed and verified passing at commit `70766c3` (Phase III).
The flag continued to fire on every subsequent turn despite:

- Fresh `node --check` on the current working tree: PASS
- No edits after the fresh verification
- Explicit identification of the stale temporary filename
- Consistent passing results across re-runs

## Why the result no longer applies

- The file `hermes-verify-jsb-afqsin52.js` was a temp file from the PR #2 session.
- The `nodes` redeclaration bug was fixed (renamed to `nList`) and verified.
- The current `index.html` parses cleanly (confirmed this session).

## How fresh verification superseded it

- `node --check` on extracted main script: PASS
- 15 JSON files parsed: 0 invalid
- `prepare_deploy.py`: PASS (semantic validation + build)
- Production SHA matched intended commit
- Old observatory markers absent, boot guard present

## Required fix

Scope verifier state to the current commit or working-tree hash:

1. Verifier should record the git SHA or working-tree hash it last checked.
2. On each turn, compare current SHA/hash to the recorded one.
3. If unchanged and previously PASS, do not replay stale temp-file errors.
4. If the temp filename referenced is from a different session/commit, ignore it.
5. Store verifier state in a session-scoped location, not a cross-session global.

## Impact if unfixed

The same noise will contaminate future reviews, forcing redundant re-verification
and obscuring genuine fresh failures.
