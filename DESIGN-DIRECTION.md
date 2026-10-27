# Design Direction — Light Under Pressure

## The idea

The portfolio is a composed instrument that reveals its character under pressure. At rest it should feel deliberate, editorial, and almost still. Human input briefly disturbs that order; the visual system then recovers.

The emotional reference is *chiaroscuro*: light against shadow, beauty against damage, calm against strain. *Clair Obscur: Expedition 33* is a reference for emotional contrast only. This site must not borrow its characters, environments, architecture, interface, symbols, or visual assets.

## Art direction

- **Palette:** near-black ink, paper-warm text, aged gold as the key light, and a small amount of cool steel blue. Rust appears only as a secondary signal.
- **Typography:** expressive editorial serif for moments of emphasis; restrained sans-serif for reading; monospaced micro-labels for technical evidence.
- **Composition:** asymmetrical, carefully measured layouts with large type, deliberate empty space, fine rules, and a small number of authored diagrammatic objects.
- **Material:** low-level grain, worn edges, thin line-work, and local pools of light. Avoid glossy gradients everywhere, glassmorphism, fake dashboards, neon cyberpunk, and template-card repetition.
- **Visual signature:** a fractured vertical form crossed by one line of light. It stands for a system made legible by force, not an in-game object.

## Interaction model

1. Default state is stable, readable, and visually complete without JavaScript.
2. Pointer movement gently changes the ambient light and the illustration's position.
3. Fast pointer movement or fast scrolling briefly raises a pressure value.
4. Pressure intensifies a small set of details; it does not shake paragraphs or move page layout.
5. Pressure decays back to the composed state. There is no permanent chaos.
6. Respect reduced-motion preferences; do not add auto-playing sound, forced scroll, or hidden navigation.

## Information hierarchy

1. **Thesis:** engineering matters most when systems are under real load.
2. **Production proof:** retail platform scale, role, and scope; label private client work honestly.
3. **Inspectable work:** SentinelGuard, Repo-Brain, PulseDeploy, KhojBangla, PerfKit, and GeoProspector AI with direct public links.
4. **Engineering principles:** observe before acting, make complexity legible, design for recovery.
5. **Experience and contact:** concise and credible, with no inflated claims.

## Content rules

- Prefer one verifiable artifact, repository, or concrete result over several broad capability claims.
- Do not invent client names, metrics, commands, product functionality, or testimonials.
- Preserve the distinction between public projects and confidential production work.
- The page should communicate engineering judgment, not perform a persona of being “dangerous.”
- English carries essential information. Bangla can appear where it adds genuine context, never as a barrier to comprehension.

## Implementation rules

- Astro static output; no animation framework is needed for the current interaction model.
- Keep the initial viewport strong before any hover or scroll.
- Keep the page responsive, keyboard navigable, and readable at 320px.
- Avoid continuous requestAnimationFrame loops when the page is idle.
- No visual effect may obscure project names, descriptions, links, or contact information.
- Validate the production build after structural changes.