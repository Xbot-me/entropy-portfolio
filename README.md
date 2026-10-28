# Mustafizur Rahman — Residual Signal

An experimental personal portfolio built around **Order ↔ Residue**. The readable source layer stays intact while a procedural echo drifts under interaction, then recovers.

## Direction

The visual system is warm paper and charcoal ink, punctuated by signal red, blossom pink, cobalt, coral, sage, and pale lavender. Bold sans-serif display type meets an italic editorial accent. Project illustrations and the signal/registration motif stay original to this portfolio.

The live Kigo Studio homepage and its website-design page were reviewed in a browser. This site adapts broad principles observed there—motion-led typography, custom visual storytelling, varied project-gallery rhythm, scroll choreography, and direct manipulation—without copying Kigo's art, layouts, assets, branding, or text.

Motion is part of the information design: character-by-character hero entry, drawn signal linework, section-linked ambient color, a draggable project index with release inertia, an interactive Order/Residue comparison, scroll parallax, project-art reveals, pointer tilt, an inspection lens, and short-lived residue trails.

The influence from *Clair Obscur: Expedition 33* remains limited to contrast and selective light. No game characters, objects, environments, typography, UI, soundtrack, or official assets are used.

## Run locally

    npm install
    npm run dev

## Build

    npm run build
    npm run preview

Astro builds a static site into `dist/`. No server-side Worker is required for the core experience.

## Deploy to Cloudflare Pages

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist/`

GSAP/ScrollTrigger choreograph motion; Lenis adds desktop wheel inertia; the custom TypeScript engine drives bounded pressure and the procedural text echo. Touch devices retain native scrolling. Reduced-motion preferences are respected.

## Interaction contract

- Essential content and links are semantic HTML and remain available if effects fail.
- The project index can be dragged and horizontally scrolled by touch, keyboard, and trackpad.
- The Order/Residue comparison is keyboard-adjustable using its range input.
- Residual trails are created only by active pointer movement/clicks and fade away.
- The pressure engine recovers instead of holding the site in a permanent high-chaos state.
- Sound is not implemented; no fake sound control is shown.

See `planning/README.md` and `DESIGN-DIRECTION.md` for the longer constraints and originality rules.
