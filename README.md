# Inversion Labs World

The evidence-first public field guide to Inversion Labs products, research, protocols, field practices, and human-governed intelligence architecture.

The experience is intentionally built with native HTML, SVG, and CSS on top of React and TypeScript. The ecosystem atlas renders the governed metadata under `projects/`; the deeper memory graph remains a deterministic illustrative fixture and does not claim to show production data, deployed agents, customer activity, or live telemetry.

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
npm run test:registry
npm run build
```

## Structure

- `src/data/architecture.ts` — typed illustrative entities, relationships, depth definitions, and guided stops.
- `src/data/ecosystem.ts` — typed projection of all 13 governed project metadata records.
- `src/components/ArchitectureExplorer.tsx` — depth, selection, focus, inspection, governance controls, export, and guided observation state.
- `src/components/EvidenceLedger.tsx` — verified public surfaces and explicit proof boundaries.
- `src/components/EcosystemAtlas.tsx` — searchable maturity map, project cards, evidence states, relationships, and detail records.
- `src/components/SynSyncProduct.tsx` — the SynSync product story, lineage, safety boundaries, and public launch path.
- `src/components/LensSection.tsx` — the two-state Inversion Lens.
- `src/components/Hero.tsx`, `Principles.tsx`, and `FinalCta.tsx` — the product narrative.
- `src/styles.css` — centralized visual tokens, core composition, focus states, and reduced-motion behavior.
- `src/ecosystem.css` — evidence-ledger and atlas composition built on the shared tokens.

## Interaction model

- **Architecture entry** starts with a three-step explanation, then offers a guided or manual path before revealing advanced controls.
- **Depth** changes the information layer from system overview through governance after the explorer is opened.
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

## Custom domain

The intended custom domain is `inversionexcursion.online`, branded as the Inversion Excursion field guide to Inversion Labs. It is not treated as canonical until it is attached and resolving. See [`DOMAIN_SETUP.md`](DOMAIN_SETUP.md) for the verified current state, the Cloudflare/Spaceship handoff, and the post-activation checks.
