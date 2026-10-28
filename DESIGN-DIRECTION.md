# Design Direction — Residual Signal

## The idea

A human-made signal struggling to stay registered. English and Bangla are the readable source layer; alien mutation is a procedural echo that slips out of alignment when the visitor pushes the page, then tries to line up again.

The site should not be still, but every motion has a job: introduce the voice, provide depth while scrolling, invite direct manipulation, make project work feel like a field to inspect, and return to a readable state.

## Original visual metaphor

Two printing plates almost align:

1. The record plate carries real copy, project names, links, and evidence.
2. The residual plate is a translucent, unstable echo of the content: mutated glyphs, broken outlines, and small registration offsets.

Behavior pushes the residual plate away from alignment. Recovery draws it back. The visitor does not switch between two pages; their behavior changes the tension between two layers of the same page.

## Inspiration boundaries

### Kigo Studio
The inspiration is interaction-level: bold typography that moves, a clear work showcase, comparison as a direct manipulation gesture, and visual sections with different rhythms. Our versions are a drag-inertia project index, an Order/Residue comparison, scroll color choreography, pointer-directed project art, and residual trails.

Do not reproduce Kigo's specific layouts, illustrations, images, branding, text, or exact interaction timings. Every visual should derive from Mustafizur's own work and the signal/registration metaphor.

### Clair Obscur: Expedition 33
The game is an emotional reference for contrast, selective light, and beauty under strain only. Do not reproduce its characters, environments, architecture, objects, motifs, typography, UI, HUD, soundtrack, or official artwork. No monolith, painter figure, expedition motif, or Belle Époque/Art Deco imitation.

## Color system

- **Midnight navy** #111426: base and high-focus reading surfaces.
- **Warm paper** #F4F0E6: text and occasional light surfaces.
- **Acid lime** #D7FF43: primary active accent; signal spike, highlight, or drag target.
- **Electric periwinkle** #6574FF: the counter-tone and some project surfaces.
- **Coral** #FF735C: interruption, risk, or high-pressure detail.
- **Sea-glass cyan** #65E5D6: flow, connection, and network detail.
- **Soft lilac** #B9A6FF: analysis and performance surfaces.
- **Dust** #898BA1: metadata and quiet notes.

Use colored surfaces as punctuation rather than painting the entire page one color. Each work item gets a surface and motion treatment that reflects its subject. Keep high-contrast reading areas and never make color the only indicator of state.

## Typography

- Newsreader for expressive, large editorial lines.
- Instrument Sans for the body and UI.
- DM Mono for tiny field labels and status details.
- Noto Sans Bengali for verified Bengali character coverage.
- Avoid tracking adjustments that break Bengali shaping.
- Kinetic splitting is decorative. Preserve the semantic text and test screen readers and copy/select in a real browser.

## Motion language

1. **Entry:** linework draws in; the hero arrives character by character with physical depth, then the supporting text follows.
2. **Scroll:** the hero artwork travels at a different depth; project art reveals in a vertical wipe; headings and content enter with staggered, non-identical timing.
3. **Direct manipulation:** drag the project index and let it coast; move through an Order/Residue comparison; inspect project visuals with pointer tilt and a moving light.
4. **Pressure:** the current engine briefly mutates the visual echo and emits tiny canvas marks on fast pointer movement/clicks. It decays; it does not leave the site broken.
5. **Color:** ambient light changes as different sections enter the active region, adding visual rhythm across the page.
6. **Recovery:** geometry and contrast settle before the final fine texture disappears.

Use GSAP/ScrollTrigger for choreographed entrances and parallax, Lenis for restrained desktop wheel inertia, and the custom pressure engine for input-driven chaos. Touch retains native scrolling. Do not deliberately drop frames or break scrolling to simulate imperfection.

## Content voice and evidence

- Use English for essential information; place selective Bangla where it adds a natural personal voice.
- Lead with specific production work and verifiable projects rather than generic capability claims.
- Include the full public project set: SentinelGuard, Repo-Brain, Signal Watch (private source / walkthrough on request), PulseDeploy, PerfKit, KhojBangla, and GeoProspector AI.
- The experience record includes Kpop USA, independent consulting, and agency work before 2020.
- The original portfolio reports 99.9% uptime, 236,000+ orders, 134,000+ customer accounts, 200+ projects, and 6+ years. Keep platform outcomes distinct from personal action and never invent additional metrics.
- Contact email and LinkedIn must point to the original portfolio's actual values, not guessed addresses.

## Accessibility and mobile

- Native scrolling on touch devices; lower entropy and fewer hover-only effects.
- Drag rail retains horizontal touch scrolling and keyboard access.
- The compare gesture is a semantic range input.
- Project links and contact remain usable throughout.
- Reduced motion disables the elaborate choreography and canvas trails without hiding core content.
- Test Bengali shaping, screen readers, keyboard navigation, 320 px widths, zoom, high-refresh displays, and physical devices.
