# Mustafizur Rahman — Residual Signal

An experimental personal portfolio built around **Order ↔ Chaos**. The visual metaphor is two almost-aligned printing plates: readable content stays intact while a procedural echo briefly drifts under interaction, then recovers.

The influence from *Clair Obscur: Expedition 33* is limited to the abstract principle of contrast and selective light. No game characters, objects, environments, typography, UI, soundtrack, or official assets are used. The portfolio's own visual language is signal interference, damaged print registration, and procedural type.

## Run locally

    npm install
    npm run dev

## Build

    npm run build
    npm run preview

Astro builds a static site into dist/. No server-side Worker is required for the core experience.

## Deploy to Cloudflare Pages

- Framework preset: Astro
- Build command: npm run build
- Build output directory: dist/

Only add a Worker if a real server-side feature needs one. Pointer tracking, scroll response, audio, and session-only effects can run client-side.

## Interaction principles

- Real project content and links remain readable without JavaScript.
- Behavior raises a bounded pressure value; it does not replace the original content.
- A driven logistic map provides visual irregularity, while pressure decides how much can be seen.
- The visual system returns toward order when the visitor stops interacting.
- Mobile, Save-Data, and reduced-motion profiles are constrained.
- The accessible copy and all functional links remain canonical; the alien layer is decorative.
- Sound is not yet implemented; no inactive sound control is shown.

See planning/README.md for the current planning pack and planning/ART-DIRECTION.md for the originality guardrails.