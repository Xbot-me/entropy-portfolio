# Design Direction — Residual Signal

## The idea

A human-made signal struggling to stay registered. English and Bangla are the readable source layer; alien mutation is a procedural underprint that slips out of alignment when the visitor pushes the page, then tries to line up again.

At rest, the portfolio should feel deliberate, editorial, and almost still. Human input briefly disturbs that order; the visual system recovers.

## Original visual metaphor

Two printing plates almost align:

1. The record plate carries real copy, project names, links, and evidence.
2. The residual plate is a translucent, unstable echo of the content: mutated glyphs, broken outlines, and small registration offsets.

Behavior pushes the residual plate away from alignment. Recovery draws it back. The visitor does not switch between two pages; their behavior changes the tension between two layers of the same page.

## Relationship to Clair Obscur: Expedition 33

The game is an emotional reference for contrast, selective light, and beauty under strain only. Do not reproduce its characters, environments, architecture, objects, motifs, typography, UI, HUD, soundtrack, or official artwork. Do not use a monolith, painter figure, expedition motif, or Belle Époque/Art Deco imitation as the site's signature.

The portfolio's own vocabulary is signal interference, print registration drift, ink spread, contour traces, and procedural typography. The shared mood must not become a copied visual identity.

## Art direction

- Near-black ink, warm paper, restrained amber, cool steel-blue, and a rare rust tone.
- Expressive serif display type; plain, readable sans-serif body text; monospaced technical annotations.
- Verify Bengali font support and shaping in actual browser output. Never apply Latin letter-spacing rules to Bangla.
- Use asymmetrical composition and distinct project-specific visuals, not a uniform grid of generic cards.
- Generate the residual layer locally with DOM/CSS/SVG at first. Add Canvas or WebGL only when a specific effect justifies it.
- Grain and interference remain subtle at rest. Contrast and local fragments intensify only under meaningful interaction.

## Interaction

- Scroll velocity, acceleration, direction changes, pointer motion, proximity, dwell, taps, and keyboard navigation feed the pressure model.
- A bounded pressure state controls effect intensity. A driven logistic map supplies irregularity; it does not become a license for unbounded randomness.
- Local regions respond separately; a visitor should be able to disturb one project without destroying the whole layout.
- The page returns to readable order after the visitor stops interacting.
- Mobile has a lower intensity ceiling and faster decay.
- Respect reduced motion, keyboard access, text selection, and screen readers.
- No sound autoplay. Sound is opt-in and can be disabled immediately.
- Do not deliberately degrade event handling or create real layout failures to simulate imperfection.

## Content voice

- Lead with operational reality and specific decisions.
- Use English for all critical information.
- Use selective Bangla where it adds a real personal cadence, with English context when needed.
- Avoid grandiose claims, fake vulnerability, generic AI slogans, anime/cosplay framing, and fake terminal output.
- Treat numbers as evidence. Keep unverified claims out of public copy until confirmed.

## Definition of success

The page should make a visitor think, “This feels authored,” before they think about the animation. A reader can understand the work without interacting. The chaos can be explored without getting trapped in it, and the underlying code remains deterministic enough to test.