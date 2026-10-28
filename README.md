# Mustafizur Rahman — Residual Signal

An experimental personal portfolio built around **Order ↔ Residue**. The readable source layer stays intact while a procedural echo drifts under interaction, then recovers.

## Direction

The new art direction pairs midnight navy with acid lime, saturated periwinkle blue, coral, sea-glass cyan, and warm paper. Motion is part of the information design: kinetic typography, section-linked ambient color, a draggable project index with release inertia, an interactive Order/Residue comparison, scroll-linked parallax, project-art reveals, pointer tilt, an inspection lens, and short-lived residual trails.

The inspiration from Kigo Studio is limited to broad interaction principles—bold moving typography, direct manipulation, work showcases, and comparison gestures. This implementation uses its own project visuals and motion language. It does not copy their layouts, artwork, assets, or branding.

The influence from *Clair Obscur: Expedition 33* remains limited to contrast and selective light. No game characters, objects, environments, typography, UI, soundtrack, or official assets are used.

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

GSAP/ScrollTrigger choreograph motion; Lenis adds desktop wheel inertia; the custom TypeScript engine drives bounded pressure and the procedural text echo. Touch devices retain native scrolling. Reduced-motion preferences are respected.

## Interaction contract

- Essential content and links are present as semantic HTML.
- The project index is draggable and horizontally scrollable by touch, keyboard, and trackpad.
- The Order/Residue comparison is keyboard-adjustable using its range input.
- Residual trails are created only by active pointer movement/clicks and fade away.
- The pressure engine recovers instead of holding the site in a permanent high-chaos state.
- The visitor can still read, select, and follow the real content when effects are unavailable.
- Sound is not implemented yet; no fake sound control is shown.

See planning/README.md and DESIGN-DIRECTION.md for the longer constraints and originality rules.