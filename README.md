# Inversion Labs World

An interactive architecture demonstration for portable, inspectable, human-governed memory infrastructure.

The experience is intentionally built with native HTML, SVG, and CSS on top of React and TypeScript. The graph uses a deterministic illustrative fixture; it does not claim to show production data, deployed agents, customer activity, or live telemetry.

## Run locally

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Structure

- `src/data/architecture.ts` — typed illustrative entities, relationships, depth definitions, and guided stops.
- `src/components/ArchitectureExplorer.tsx` — depth, selection, focus, inspection, governance controls, export, and guided observation state.
- `src/components/LensSection.tsx` — the two-state Inversion Lens.
- `src/components/Hero.tsx`, `Principles.tsx`, and `FinalCta.tsx` — the product narrative.
- `src/styles.css` — centralized visual tokens, responsive composition, focus states, and reduced-motion behavior.

## Interaction model

- **Depth** changes the information layer from system overview through governance.
- **Focus selection** reduces unrelated entities while retaining immediate context.
- **Guide me** traverses a five-stop architectural narrative and can be interrupted at any time.
- **Inspector** exposes content, provenance, permissions, JSON export, and session-only edit/revoke/delete demonstrations.
- **Escape** exits the active guide or focus layer, then closes the inspector.

All governance mutations are local to the current browser session. Exported JSON is explicitly marked as demonstration data.

## Preserved ecosystem sources

The repository's governed ecosystem metadata remains under `projects/`, with
verification and relationship rules under `capt-verification/`, `registry/`,
and the root governance documents. `npm run build` validates that registry,
emits `registry.json` and `verification.json`, and carries the legacy static
experiences into the generated `dist/` artifact before Cloudflare deployment.
