# Mustafizur Rahman — Systems Under Pressure

A static-first portfolio about production engineering: commerce, security, performance, and the systems that have to recover when the happy path ends.

The visual direction is **light under pressure**: editorial typography, near-black surfaces, paper-warm text, restrained gold, and cool steel-blue details. It takes emotional cues from chiaroscuro and painterly contrast, not assets or interface motifs from any specific game.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Astro builds a static site into `dist/`. No client framework or animation library is required.

## Deploy

Use **Cloudflare Pages** with the following settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`

## Interaction principles

- The page is composed and readable at rest.
- Fast scrolling and pointer movement briefly raise visual pressure, then decay.
- No perpetual character jitter, sound, or forced interaction.
- Reduced-motion preferences disable the behavior layer.
- Public work links lead to source repositories or the WordPress.org listing; client production work is clearly marked as private.

See [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) before changing the visual language.