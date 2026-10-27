# Art Direction — Residual Signal

## One-sentence concept

**A human-made signal struggling to stay registered.** English and Bangla are the readable source layer; alien mutation is a procedural underprint that slips out of alignment when the visitor pushes the page, then tries to line up again.

Working title for the visual system: **Residual Signal**. The portfolio domain and personal name remain the brand; this is an art-direction label, not a new company name.

## Relationship to Clair Obscur: Expedition 33

The game is a source of emotional direction, not a visual kit. The transferable principle is selective contrast: the designer chooses what is clearly seen and what is left in shadow. An interview with the game's lead writer discusses the intentional light/shadow metaphor; the portfolio should develop its own visual grammar from that abstract idea. [CGMagazine interview](https://www.cgmagonline.com/interviews/clair-obscur-expedition-33-contrast/) · [Unreal Engine interview](https://www.unrealengine.com/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33).

### Explicitly do not borrow

- No characters, silhouettes, costume details, enemies, or environments.
- No monolith, Paintress, numbered expedition, erasure motif, or recognizably game-specific shape.
- No imitation of the game's menus, HUD, typography, frames, maps, icons, or navigation.
- No direct recreation of Belle Époque, Art Deco, steampunk, ornamental gold filigree, or French-fantasy architecture.
- No game screenshots, logos, sounds, motifs, official concept art, or look-alike assets.

The separately shared exploratory moodboard is an **atmosphere/material study only**. Do not lift its central texture as the portfolio's hero illustration. The actual visual signature should be built from registration drift, ink spread, signal traces, measured marks, and procedural typography—not a cracked monolith or floating stone.

## The original metaphor: two printing plates

Imagine a page printed from two plates that almost align:

1. **The record plate:** readable, warm, deliberate. It carries the real copy, project names, links, and evidence.
2. **The residual plate:** a translucent, unstable echo of that content. It contains procedurally mutated English/Bangla glyphs, broken outlines, faint offsets, and clipped fragments.

At rest the two plates sit almost in register, with tiny imperfections. Behavior pushes the residual plate away from alignment. Recovery draws it back. The visitor is not switching between two pages; they are changing the tension between two layers of the same page.

This metaphor gives the alien layer a reason to exist and makes the visual system original without borrowing an identifiable game object.

## Palette tokens

Use color as lighting and information, not decoration. The warm accent is sparse; most of the page is ink, paper, and a cool counter-tone.

| Token | Hex | Use |
|---|---|---|
| Ink | #111315 | Primary background; not pure black. |
| Raised ink | #1A1D20 | Occasional surface separation, never an entire grid of cards. |
| Paper | #E9E2D6 | Primary text, high contrast without pure white. |
| Ash | #A6A196 | Paragraphs and descriptions. |
| Dust | #6F706C | Quiet metadata; never essential actions. |
| Signal amber | #D1A15B | Rare light leak, mutation edge, focus detail. |
| Oxidized blue | #738D9D | Counterpoint, cool artifacts and stable-system marks. |
| Rust | #8A5A49 | Rare error / interference accent. |
| Hairline | rgba(233,226,214,0.14) | Fine rules, registration guides, separators. |

### Color behavior

- Order: restrained amber, steady paper text, visible but quiet cool-blue details.
- Rising pressure: the amber edge splits into two nearby tones; cool blue bleeds into its shadow; small rust artifacts appear only in selected regions.
- Recovery: contrast returns first, position follows, residual noise disappears last.
- Never shift the whole page into neon purple/green “cyberpunk mode.” Never use color changes as the only signal for state.

## Typography

Use three typographic roles and a language-safe fallback:

- **Display:** Newsreader variable, primarily 400–500 weight. Large, editorial, slightly compressed line breaks; use italics selectively, not in every heading.
- **Body:** Instrument Sans, 400–500. Humanist, quietly plain, easy to read for long technical descriptions.
- **Technical annotations:** IBM Plex Mono, 400. Small field notes, dates, source labels, tiny state annotations.
- **Bangla fallback:** Noto Sans Bengali (or another verified Bengali-capable font) for Bangla glyph coverage. Test conjuncts, vowel signs, line-height, and shaping in the actual target browsers.

Do not apply a global letter-spacing trick to Bangla. Do not split Bangla text into independent graphemes without testing complex shaping. Latin and Bangla mutation require different rendering paths.

Typography should feel authored through scale and line breaks rather than a stack of decorative fonts. Avoid the default AI pairing of a geometric sans on every element plus gold-gradient hero text.

## Layout and composition

- Use asymmetry and deliberate imbalance, but keep the reading order obvious.
- Avoid a perfect 3-column card grid, identical section blocks, giant animated counters, and numbered “chapters.”
- Give projects different compositional treatments that reflect their substance: a dependency map, a risk surface, a real terminal capture if verified, an OCR strip, a performance waterfall. These are visualizations of evidence, not fake dashboard screenshots.
- Build the hero from typography, a dual-print echo, and one original abstract interference field. It does not need a giant 3D object.
- Let whitespace vary. One section can be dense; the next can open out. Do not force every section to balance perfectly.
- Keep a visible path through the content. “Imperfect” does not mean random reading order or hidden content.

## Texture and image rules

Use a small custom texture system:
- Very subtle monochrome grain at rest.
- Offset ink/print registration marks at section boundaries.
- Thin contour or interference lines tied to the chaotic state.
- Masked fragments and edge bleeds only at high pressure.
- Occasional paper-like off-white panels as counterpoint, not a permanent parchment fantasy aesthetic.

Textures should be generated locally with CSS, SVG, Canvas 2D, or tiny authored assets. Do not ship stock textures as the main identity. Do not use game images or scraped screenshots.

## The dual state in visual terms

**Order**
- A single clear source line.
- Text and interface nearly aligned.
- Calm but not sterile; a tiny residual offset remains.
- Project evidence is easy to inspect.
- Main actions read instantly.

**Chaos**
- The residual plate drifts away from the record plate.
- A few glyphs mutate into procedural forms, including Bangla.
- Clipped shadows and small signal fragments appear around the touched region.
- Background noise rises locally, not as a full-screen static overlay.
- Project visuals can briefly lose registration but their labels/links remain usable.

**Recovery**
- Geometry returns first.
- Glyphs reassemble second.
- Color and noise settle last.
- Different regions recover at slightly different rates, intentionally avoiding a synchronized “all animations finish now” feel.

## Motion character

- Use smooth response with small, authored imperfections: unequal recovery duration, tiny overshoot on decorative layers, slight delays between geometry and glyph recovery.
- Do not deliberately freeze frames, create actual layout collapse, block scroll, or inject bugs to make the code look human.
- Keep the imperfection in the art direction and timing, not in unreliable event handlers or sloppy implementation.
- Use GSAP/ScrollTrigger for choreographed entrances or specific authored sequences; use the custom pressure model for continuous behavior. Avoid building the entire page as one long timeline.
- Lenis is optional after a native-scroll prototype proves that smoother motion improves the idea without fighting user intent.

## Sound

- Original synthesized audio only; no copied game motifs or recognizable soundtrack material.
- Low, quiet, opt-in sound. It may follow the pressure envelope but must not intensify enough to feel punitive.
- Sound off on first paint and after tab restoration until preference is known.
- The page remains complete and expressive without sound.

## What “not AI-made” means in this direction

It does not mean random CSS, errors, arbitrary copy, or deliberately unreadable content. It means the work contains choices an author is willing to stand behind:

- One coherent metaphor (registration drift), not twenty unrelated tricks.
- A few strong visual moments instead of constant noise.
- Content that includes operational details and candid caveats.
- Different pacing for different projects.
- Controlled asymmetry and visible craft.
- No fake metrics, fake testimonials, fake terminal output, or faux-personal storytelling.

## Visual QA checklist

- Does the first viewport work as a still image before animation?
- Can a stranger understand the author's work in ten seconds?
- Is the alien layer an echo of readable content rather than a fake language claim?
- Does any asset resemble a game-specific object, UI, icon, or environment? Replace it if yes.
- Does high pressure still leave project names and contact details usable?
- Does the page recover naturally after the visitor stops interacting?
