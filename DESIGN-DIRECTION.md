# Design Direction — Residual Signal

## The idea

A human-made signal struggling to stay registered. English and Bangla are the readable source layer; an abstract echo slips out of alignment when the visitor pushes the page, then settles back. The site should feel crafted, editorial, and alive—not like a sci-fi dashboard.

The portfolio has to make production engineering understandable to a human hiring manager. Animation earns its place by adding hierarchy, depth, rhythm, or a useful interaction; it must not obscure the actual work or contact path.

## Original visual metaphor

Two printing plates almost align:

1. The record plate carries real copy, project names, links, and evidence.
2. The residual plate is a translucent, unstable echo: mutated glyphs, broken outlines, and small registration offsets.

Behavior pushes the residual plate away from alignment. Recovery draws it back. The visitor does not switch between two pages; their behavior changes the tension between two layers of the same page.

## What we observed on Kigo Studio

The live homepage and website-design page were reviewed in a browser, including their custom scroll containers and deeper sections. The important design cues were:

- A warm, light canvas with a compact header and large, assertive display type.
- An oversized headline whose bold sans-serif voice contrasts with an italic display accent.
- Custom illustration and drawn linework used as major parts of the hero, not just tiny decorative icons.
- Service panels that combine imagery, proof-point metrics, and large typography.
- An irregular, image-led work gallery with a different visual rhythm from the service sections.
- Direct manipulation in a before/after comparison, plus a testimonial carousel and FAQ accordion.
- Scroll choreography and strong pauses: large visual sections, editorial text, proof, then a focused contact CTA and footer.

### How this portfolio adapts those cues

Use the interaction principles, not the actual composition. The portfolio keeps its own signal/registration concept and engineering illustrations. It uses warm paper and charcoal ink, a bold-to-italic hero contrast, a horizontally draggable project rail, an Order/Residue comparison, section-linked ambient color, asymmetrical project layouts, clipped artwork reveals, and an emphatic berry contact ending.

Do **not** copy Kigo's sakura illustration, service poster designs, work-card layouts, branding, imagery, text, or exact timing. Do not add fake client logos, testimonials, or unsupported performance metrics merely to imitate a studio site. The project gallery must remain about Mustafizur's actual work.

## Color system

- **Warm paper** `#F8F3EA`: main canvas and light reading surfaces.
- **Charcoal ink** `#211B1B`: display text and primary copy.
- **Signal red** `#C9304A`: principal accent and active signal.
- **Blossom pink** `#EE7188` / `#F4B6C0`: softer highlights and interactive comparison surface.
- **Cobalt** `#4D5DBB`: technical counter-tone and selected artwork.
- **Coral** `#EE765F`: interruption and warning detail.
- **Muted sage** `#5D8D82`: connection and flow.
- **Pale lavender** `#C4B5E8`: analysis and performance surfaces.
- **Dust** `#796E6F`: metadata and quiet labels.
- **Deep berry** `#7C213A` to `#38212F`: contact finale.

Let paper dominate. Use color as a change of rhythm across the project index, illustrations, comparison, and contact section—not as random decoration or a new neon dashboard. Maintain readable contrast and never make color the only signal for a state.

## Typography

- Instrument Sans for confident headlines, body copy, and UI.
- Newsreader for italic display accents and editorial contrast.
- DM Mono for small technical labels and status details.
- Noto Sans Bengali for Bengali character coverage.
- Use display-size contrast sparingly, with enough tracking to preserve actual word spaces. Verify Bengali shaping after any font or spacing change.
- Kinetic splitting is decorative. Keep the source text semantic and test copy/select and assistive-technology output.

## Motion language

1. **Entry:** the title arrives in staggered characters; the signal illustration draws in. A distinct italic accent supplies the editorial hit.
2. **Scroll:** the hero illustration drifts at a different depth; section headings and project artwork enter with varied, restrained timing.
3. **Direct manipulation:** the horizontal project index can be dragged and coasts on release. The Order/Residue specimen can be compared using a real range input.
4. **Inspection:** pointer movement can tilt a project visual and move its light. Small canvas marks may trail fast movement, then fade.
5. **Color:** the ambient light changes as different sections enter the active region.
6. **Recovery:** the visual echo returns to alignment. The effect must not make page text illegible or leave the page in a permanently broken state.

Use GSAP/ScrollTrigger for choreographed entrances and parallax, Lenis for restrained desktop wheel inertia, and the custom pressure engine for input-driven residue. Touch devices keep native scrolling and must not rely on hover. Do not intentionally drop frames or break scrolling to simulate imperfection.

## Content voice and evidence

- Lead with production work and specific, supportable details rather than generic capability claims.
- Include the actual public project set: SentinelGuard, Repo-Brain, Signal Watch (private source / walkthrough on request), PulseDeploy, PerfKit, KhojBangla, and GeoProspector AI.
- The experience record includes Kpop USA, independent consulting, and agency work before 2020.
- The original portfolio reports 99.9% uptime, 236,000+ orders, 134,000+ customer accounts, 200+ projects, and 6+ years. Keep platform outcomes distinct from personal action and do not invent additional metrics.
- Preserve the original portfolio's working contact email and LinkedIn destination.

## Accessibility and mobile

- Keep the main page readable if animation fails; never gate portfolio copy behind a canvas.
- Respect `prefers-reduced-motion` and stop elaborate choreography and trails.
- The project rail retains horizontal touch scroll and keyboard access.
- The comparison stays a semantic range input with keyboard control.
- Remove hover-only requirements, keep fixed UI from covering mobile content, and check 320 px widths, zoom, high-refresh displays, and physical devices.
