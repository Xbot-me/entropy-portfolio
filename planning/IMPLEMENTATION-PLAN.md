# Implementation Plan — Astro / Cloudflare

## Goals

1. Make the first viewport feel authored and memorable without requiring animation to understand it.
2. Preserve all useful factual content from the existing portfolio, remove anime/arc cosplay, and prioritize evidence.
3. Make English the complete information channel, use selective Bangla for personal texture, and mutate visible forms into a procedural alien echo.
4. Drive the visual behavior from a bounded behavioral model with a real chaotic component.
5. Recover toward order reliably, especially on mobile and after tab switching.
6. Deploy static assets to Cloudflare Pages. Add a Worker only if a genuine server-side feature later requires one.

## Technical choice

### Core
- **Astro static output:** content, headings, project descriptions, metadata, and links render as HTML without client JavaScript.
- **TypeScript custom engine:** high-frequency input collection, model state, pressure math, local-region state, and visual variable updates. Keep it independent of Astro's page renderer.
- **GSAP + ScrollTrigger:** use for a few authored entrances/reveals and optional pinned transitions only if they clearly earn their cost. Do not encode the entire site as one scroll timeline.
- **Lenis:** a candidate for desktop smooth-scroll feel. Prototype with native scroll first; keep native scroll fallback and disable Lenis if it interferes with browser navigation or accessibility.
- **SVG / CSS / DOM first:** use authored SVG for diagrams, textured line fields, and small visual fragments.
- **Canvas 2D later:** only if DOM/SVG approaches cannot handle the intended fragment field. WebGL/Three.js/PixiJS is a Phase 4 option, not the starting requirement.
- **Web Audio API:** create the optional sound from original procedural synthesis. No soundtrack file required.
- **Small state store:** a custom typed store/reducer is enough. Do not route every pointer sample through React state or Zustand.
- **Grapheme handling:** use a tested grapheme segmentation implementation (Intl.Segmenter with a robust fallback/library) and test Bengali shaping; do not split Bangla text naïvely into Unicode code points.

### Deployment
- Astro builds to static output (dist).
- Cloudflare Pages runs npm run build and publishes dist.
- No Worker is needed for the entropy engine, sound, or session-only state. A Worker is appropriate only for a real backend feature such as a secure contact endpoint, not just because the site is on Cloudflare.
- Self-host selected fonts after checking licensing, weights, and Bengali coverage.
- Keep client work and data private; do not introduce analytics just to measure entropy.

## Proposed file structure

The exact layout can adapt to the current repo, but keep concerns separated:

- src/pages/index.astro — semantic page shell and real content.
- src/components/DualText.astro — canonical text plus an inaccessible visual mutation overlay.
- src/components/ProjectField.astro — project wrapper with stable source links and local-pressure target.
- src/components/FieldDiagram.astro — original SVG diagrams, each tied to project substance.
- src/lib/entropy/types.ts — typed inputs/state/config.
- src/lib/entropy/model.ts — pure bounded pressure update, recovery, caps, local fields.
- src/lib/entropy/logistic-map.ts — seeded chaotic recurrence, independent of DOM.
- src/lib/entropy/input-collector.ts — pointer, touch, scroll, hover, click, focus, visibility, and resize inputs.
- src/lib/entropy/visual-renderer.ts — maps pressure into CSS variables/selected node styles.
- src/lib/entropy/mutation.ts — script-aware, grapheme-safe, reversible mutation.
- src/lib/audio/ambient.ts — optional original Web Audio layer, user gated.
- src/styles/tokens.css — palette, typography and motion tokens.
- src/styles/global.css — layout, text styles, accessible defaults, responsive rules.
- tests/entropy-model.test.ts — deterministic tests for math.
- tests/alien-mutation.test.ts — reversible Latin/Bangla mutation tests.
- tests/portfolio-flow.spec.ts — browser checks for reading, links, mobile, sound consent and recovery.

Do not keep both the old always-on engine and the new pressure model alive. Migrate one responsibility at a time and remove superseded modules only after test coverage exists.

## Phases and gates

### Phase 0 — Evidence and foundation
**Deliverables**
- Confirm project/status inventory and all public links.
- Freeze factual claims that cannot yet be substantiated.
- Audit current live content, metadata, redirects, favicon, fonts, and current Cloudflare deployment path.
- Add design tokens and a stable static Astro page skeleton.
- Add CI build, type check, and baseline browser smoke test.

**Gate:** the full page is legible, all links work, and the first viewport has a clear hierarchy before the engine is added.

### Phase 1 — Write the human version
**Deliverables**
- Rewrite entry/about/work/stack/history/contact using CONTENT-DRAFT.md as a starting point.
- Keep project name, stack, date, status, evidence link, and caveat in a structured content record.
- Mark public open-source projects separately from private production work.
- Remove numbered chapters and One Piece/anime references.
- Use English for every critical fact; Bangla remains selective and naturally placed.

**Gate:** a reader who disables JavaScript can still understand the portfolio and contact Mustafizur.

### Phase 2 — Pure math before visual effects
**Deliverables**
- Implement normalized input features, pressure model E, local pressure Lᵢ, logistic map X, and reset/recovery logic.
- Unit-test caps, monotonic decay, fixed-seed reproducibility, hysteresis, low-frame-rate behavior, and visibility resume.
- Add mutation-first tests: deliberately remove a cap or invert recovery once to prove tests detect the regression, then revert the mutation.
- Add a development-only state inspector or graph (not visible to normal visitors) to tune the math.

**Gate:** deterministic tests pass and every profile recovers without a page reload.

### Phase 3 — Order / alien type layer
**Deliverables**
- Create DualText so original text remains canonical and the alien layer is purely visual.
- Implement separate Latin and Bangla glyph pools / shaping paths.
- Use pressure and X to select rare, bounded mutations rather than randomizing the DOM every frame.
- Keep the accessible copy, URLs, metrics, source code, and email untouched.
- Add local mutation to one project title or short phrase at a time.

**Gate:** selecting, copying, keyboard focus, screen-reader output, and reduced-motion behavior preserve meaning.

### Phase 4 — Composed-to-chaotic visuals
**Deliverables**
- Apply pressure to registration offset, masked fragments, ink bleed, localized grain, and authored SVG interference lines.
- Build distinct project-specific visuals from real project logic: import/dependency map, checkout risk surface, deploy/recovery sequence, OCR strip, performance waterfall.
- Add rare attractor beats driven by a high-entropy input sequence plus a short recovery window, not simple timers or fixed scroll locations alone.
- Trial GSAP/ScrollTrigger for specific entrances. Compare Lenis with native scroll on real devices.
- Only prototype Canvas/WebGL if SVG/DOM cannot deliver the required effect.

**Gate:** the still state already works; motion gives meaning, not noise. No layout reflow or loss of navigation.

### Phase 5 — Session signature and sound
**Deliverables**
- Optional sessionStorage signature only if it creates meaningful continuity; never record raw interaction histories or transmit them.
- Original, user-initiated Web Audio sound with visible mute state.
- Pause/quiet audio when hidden, and gracefully handle unavailable storage/audio contexts.

**Gate:** first visit is silent; the experience remains complete with sound unavailable or off.

### Phase 6 — Mobile, accessibility, performance
**Deliverables**
- Mobile profile with lower cap, lower input gain, faster decay and no default WebGL.
- Test 320 px, 360–430 px, tablet portrait/landscape, keyboard-only, VoiceOver/NVDA, reduced motion, zoom, and screen rotation.
- Check contrast, no text clipping, correct Bangla shaping, anchor navigation, back/forward, and scroll restoration.
- Profile CPU usage, memory, battery behavior, font loading, layout shift, and long tasks.
- Stop animation loops at rest and on hidden tabs.

**Gate:** touch visitors still get an expressive experience without UI obstruction, battery abuse, or broken scrolling.

### Phase 7 — Preview and launch
**Deliverables**
- Deploy a preview branch to Cloudflare Pages.
- Test the preview on desktop and physical mobile devices.
- Validate canonical URLs, OG metadata, favicon, 404/redirect behavior, project links, email link, and SEO-visible source content.
- Merge and promote only after factual claims and public links are approved by the owner.

**Gate:** CI passes, visual preview is accepted, and the live domain is only switched after explicit review.

## Performance targets (initial budgets)

These are project targets to measure, not promises made before profiling:

- Static semantic content renders without JavaScript.
- Avoid 3D/WebGL on first paint; defer optional heavy code until an actual interaction needs it.
- Keep the visual engine asleep at rest; one active loop maximum.
- No layout shifts caused by text mutation.
- Aim for a small initial script payload; split any optional canvas/audio engine from the base page.
- Measure LCP, INP, and CLS on a mid-range mobile device as well as desktop; tune from actual traces, not guesswork.
- No third-party analytics or remote AI calls in the browser.

## Definition of done

- Visitor understands the work in ten seconds, even if they never interact.
- Slow deliberate scrolling feels composed; fast behavior creates a short, intelligible disturbance.
- The site naturally returns to order after activity stops.
- The real chaos model has tests and its outputs are bounded.
- English content, links, evidence, and contact remain stable under every visual state.
- Bangla is rendered correctly; the alien layer never claims to be a real language.
- The effect remains original and cannot be mistaken for a recreation of game assets or UI.
- The owner approves the deployed preview before production cutover.

## Owner decisions still needed before final publish

1. Confirm 99.9% uptime and what period it covers, or remove it.
2. Confirm exact Kpop USA engagement end date and whether “nine microservices” is accurate.
3. Supply or confirm the status of Signal Watch.
4. Confirm the “200+ projects” count definition.
5. Approve the final English/Bangla copy after reading it aloud.
