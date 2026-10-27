# Entropy System — Mathematical & Interaction Specification

## 1. Design contract

The website is a readable portfolio first and a behavioral artwork second. **The text is not the state; the state changes how the text is rendered.** The meaning, link targets, and accessible names must stay intact even when the visible presentation becomes alien.

At rest: composed, almost still, slightly imperfect.  
Under input: tension rises; typography, light, textures, and selected local regions lose registration.  
After input stops: the same system decays back toward order.

No random glitch timer should run independently of the visitor. No continuously animated page-wide jitter should be used to simulate life.

## 2. Two separate values: Pressure and chaotic texture

Do not combine every phenomenon into one untestable "entropy" variable. Use two bounded signals with different jobs:

- **Pressure E ∈ [0, 1]:** smooth, interpretable intensity driven by visitor behavior. This controls how much of the visual system is allowed to distort.
- **Chaotic state X ∈ [0, 1]:** a small driven logistic map that supplies irregularity to the selection/phase of visual mutations. X determines *which* variation appears; E determines *how much* is allowed to appear.

Local pressure Lᵢ ∈ [0, 1] is maintained for each major text block/project/visual. The user cannot push a critical button into a broken state.

## 3. Input signals

Normalize inputs to 0–1, filter obvious noise, and combine them at a fixed 30 Hz control cadence. Use event listeners to collect data; do not perform expensive DOM measurement on every pointer event.

| Input | Normalization proposal | Initial weight | Notes |
|---|---|---:|---|
| Scroll velocity | Absolute viewport-heights per second, clamped at 1.5 vh/s | 0.24 | Main input. |
| Scroll acceleration | Change in normalized velocity, clamped to a reference range | 0.10 | Captures sudden braking/launching. |
| Direction changes | Exponentially decayed counter for reversals in a short window | 0.12 | One reversal should not create a full storm. |
| Pointer/touch velocity | Pointer distance per second / 1,500 px/s, clamped | 0.12 | On touch, prefer scroll/swipe velocity to hover. |
| Proximity to tracked region | Gaussian falloff: exp(−d² / 2σ²), σ around 180 px | 0.16 | Only a few important regions need to be tracked. |
| Hover dwell | min(hover duration / 1.2 s, 1) | 0.08 | Dwell changes local pressure more than global pressure. |
| Click/tap burst | Count in 1.5 s / 4, clamped | 0.10 | Debounce; don't treat normal navigation as an attack. |
| Keyboard/focus activity | Small one-shot impulse for intentional input | 0.04 | Preserve keyboard users in the model. |
| Device orientation | Disabled by default; optional, tiny weight only after explicit permission if the platform requires it | optional | Never show a permission prompt on page load. |

Weights above total 0.96 before optional orientation; normalize the combined value or leave the remaining margin as headroom. The precise weights are tuning parameters, not a claim about human behavior.

Let each normalized feature be sᵢ(t). Then:

A(t) = clamp(Σ wᵢ sᵢ(t), 0, 1)

Apply a low-pass filter to the input aggregate so one noisy pointer event cannot flip the site from calm to total chaos.

### Events that should affect the system

- Scroll velocity, acceleration, and direction reversals.
- Pointer velocity, proximity, hover entry/exit, and dwell.
- Click/tap bursts and deliberate keyboard/focus movement.
- Section entry/exit and time spent near a project.
- Touch swipes and viewport resize.
- Visibility change: pause when hidden, discard the long elapsed interval when resumed, and restore from a calm state.
- Orientation only if explicitly enabled and useful; it is not required for the first version.

Time since last input does **not** increase entropy. It increases recovery.

## 4. Pressure dynamics (bounded, frame-rate independent)

Use a driven, damped model rather than additive increments per frame. Additive frame-based updates often behave differently on 30 Hz and 120 Hz screens.

For the calm/active part, model:

dE/dt = kₐ A(t) (1 − E) − kᵣ E

Initial desktop values: kₐ = 2.8 s⁻¹, kᵣ = 0.45 s⁻¹.

For a time step Δt, with A treated as constant over the step:

- λ = kₐA + kᵣ
- E* = (kₐA) / λ
- E_next = E* + (E − E*) exp(−λΔt)

This gives a smooth bounded response. The implementation should clamp Δt to 50 ms after tab suspension to avoid a giant catch-up jump.

**Event impulses:** clicks and sudden reversals may add a small one-shot impulse J, such as 0.01–0.035, after the analytic update. Clamp immediately to the active device ceiling.

**Recovery:** if E exceeds 0.72, raise kᵣ to around 1.4 s⁻¹. Return to the normal rate only when E drops below 0.48. This hysteresis prevents rapid switching around the threshold.

**Forced cool-down:** if E exceeds 0.88, or remains above 0.78 for more than roughly 1.2 s, enter a 1.5–2.0 s recovery window. During this window, suppress new cosmetic impulses and increase release. Do not hard-reset the number abruptly; ease it down so the recovery feels like the system attempting to re-form.

Clamp E after every update. The ceilings below are hard contracts, not suggestions.

| Profile | E ceiling | Input gain | Recovery | Allowed effects |
|---|---:|---:|---|---|
| Desktop, normal motion | 1.00 | 1.00 | Standard + fast recovery thresholds | Full text mutation, local fragmentation, texture/light response. |
| Coarse pointer/mobile | 0.58 | 0.68 | Faster recovery | Less glyph displacement, no default WebGL, no layout shift. |
| Reduced motion | 0.20 | 0.25 | Fast | No spatial text movement; use brief color/texture changes only, or keep effects static if requested. |
| Save-Data / low-power hint | 0.38 | 0.45 | Fast | DOM-only effects; no canvas particle layer or audio synthesis until user opts in. |

A ceiling of 1.0 describes the model's scale, not permission to make everything unreadable. The visual layer has its own restrictions.

## 5. A genuine chaotic component (not random CSS)

Use the logistic map as a bounded chaotic source:

Xₙ₊₁ = rₙ Xₙ (1 − Xₙ) + ε(2Aₙ − 1)

Initial parameters:
- X₀ is seeded once per session, using a safe pseudorandom seed.
- rₙ = 3.82 + 0.12 Aₙ, clamped to [3.82, 3.94].
- ε ≈ 0.004; clamp X after the small drive perturbation to [0, 1].
- Advance the map only during active pressure (E > 0.08) or in response to a meaningful input event. Stop presenting its output when E has decayed to rest.

The logistic map is the chaotic source; pressure is the damping/permission layer. This is more honest than attaching a “chaos” label to random numbers. It does not make the whole webpage mathematically chaotic by itself. The rendered result is a constrained, input-driven artwork controlled by the map.

Use X to choose bounded outcomes: which glyph subset mutates, a small offset sign, which visual fragment appears, or the phase of a texture sweep. Do not multiply every CSS property by X. The output must remain art-directed and testable.

### Optional visible trace

In a later phase, draw a small abstract signal trace from the actual recent X samples. It can behave like a noisy instrument readout. Do not use a generic stock Lorenz attractor just because it looks scientific; if a Lorenz system is ever added, document its equations and explain what its state drives.

## 6. Local pressure

Each tracked region has Lᵢ ∈ [0, 1]. A local target combines global pressure, nearby input, and deliberate dwell:

Tᵢ = clamp(0.50 E + 0.35 Pᵢ + 0.15 Hᵢ, 0, 1)

where Pᵢ is proximity to the region and Hᵢ is normalized hover dwell. Move Lᵢ toward Tᵢ with an exponential approach and use a faster decay constant when the region is no longer near the pointer or visible.

- Project cards receive the strongest local response.
- The hero title responds visibly but does not change its line breaks or push page content around.
- Long body copy can briefly mutate in one short run of text, never entire paragraphs at once.
- Stack lists may lose registration or reorder one small group only during a short high-pressure beat, then restore the exact original order.
- The timeline may visually misalign lines, but dates and semantic reading order never change.
- Navigation, project links, email, and focus indicators are not eligible for mutation.

## 7. Visual intensity ladder

| Pressure | Behavior | Duration / boundary |
|---|---|---|
| 0.00–0.18 | Stable copy, tiny residual imperfection; light follows pointer very gently. | Continuous idle appearance; no animation loop when settled. |
| 0.18–0.38 | Local contrast shifts, one or two glyphs briefly swap with procedural glyphs, texture becomes more visible. | Only around the region receiving input. |
| 0.38–0.62 | Small character groups detach by a few pixels, a text run can lose registration, project artwork may fracture into small pieces. | One or two regions at a time; layout geometry remains stable. |
| 0.62–0.82 | Brief severe mutation: mixed Latin/Bangla forms, fragments, uneven opacity, partial word dissolution. | Hold under ~700 ms, recover over ~500–1,200 ms. Never cover controls. |
| 0.82–1.00 | Rare whole-section “storm” effect: visual overlays drift, one short phrase may become mostly alien, light/noise surges. | At most one region and about 1.2 s; no continuous global collapse. Enter recovery immediately. |

A visitor who enjoys chaos can provoke repeated short events by interacting. The system must still return toward a legible state after they stop.

## 8. Alien mutation

Purely procedural; no fixed conlang and no prewritten fake translation.

### Mutation principles

1. Keep the original content as the canonical source. Generate mutation spans from it; do not destructively replace the source string.
2. Use script-aware pools for Latin and Bangla: punctuation, combining marks, selected glyph-shape substitutions, small rotations, clipping, and fragment overlays. Do not treat Bangla as Latin transliteration.
3. Avoid heavy Zalgo by default. A few combining marks can be used at very high pressure, but cap their number and never allow text to grow vertically enough to shove content.
4. Use a deterministic per-region seed plus X and Lᵢ so a mutation can be tested and reversed.
5. Mutations should not create offensive, misleading, or accidentally legible content that looks like a real claim.
6. On blur, selection, keyboard focus, reduced-motion, or recovery, render the original text.
7. Every mutated text region keeps an untouched accessible version; decorative mutation layers use aria-hidden="true".
8. The effect is not a language for communication. No links, metrics, code, email addresses, dates, or skills are generated from alien glyphs.

## 9. Session memory and sound

### Memory

- Session-only state by default. Store an aggregate session signature (e.g. last pressure percentile and a seeded variation) in sessionStorage if continuity across reloads is genuinely helpful.
- Never store pointer paths, keystrokes, raw event logs, project interests, or identifiers.
- No external analytics or network call is needed for entropy.
- Do not use localStorage to create a surprise across-visit “recognition” effect. Later revisit memory requires a separate product/privacy decision.
- Respect browser storage failure and private browsing; lack of storage should not break the experience.

### Sound

- Sound is off by default and starts only from an explicit user action.
- Use original procedural audio, never a game soundtrack or recognizable copied motif.
- A muted oscillator/drone and occasional soft, short, non-startling tones are enough. Pressure can influence volume and dissonance only after the visitor opts in.
- Keep a visible mute control, preserve keyboard access, and persist the mute choice only if helpful.
- Audio must stop or quiet on tab hiding; do not use audio to punish fast scrolling.

## 10. Scroll behavior

- Native scroll is the fallback and remains usable in all states.
- Test Lenis for a restrained smooth-scroll baseline, but do not hijack anchor navigation, keyboard scrolling, or browser expectations.
- Do not introduce intentional frame drops. Imperfection should come from visual timing and imperfect registration—not broken input or a deliberately slow main thread.
- Never use scroll-linked height/position changes that cause actual content reflow.
- Scroll restoration/back navigation must work.
- When the visitor reverses direction, treat it as a signal for pressure, not a reason to fight or lock scroll.

## 11. Mobile and accessibility contract

- Use touch scroll velocity as the main signal; do not emulate desktop hover on touch.
- Do not request motion/orientation permission on load.
- Keep every project and contact link usable during the maximum storm.
- No default particle WebGL layer on mobile. Start with SVG/DOM/CSS; add Canvas 2D only after profiling.
- Avoid layout shifts: use transforms, clip-path, opacity, and overlays; do not change card height or font metrics.
- Respect prefers-reduced-motion without hiding content. Never replace content with an inaccessible canvas.
- Preserve contrast and selection. Keyboard focus or active selection forces the relevant text to Order.
- Test at 320 px wide, tablet portrait/landscape, desktop, high-refresh devices, CPU throttling, and background-tab resume.

## 12. Model tests and acceptance criteria

Write unit tests for the pure model before building effects. Then deliberately mutate a key operation (for example, remove clamping or change the recovery constant) and confirm the tests fail; restore the correct implementation afterward.

Required tests:
- E and each Lᵢ always stay within [0, configured ceiling].
- With A = 0 and no new impulses, pressure monotonically decays to near zero.
- A burst raises pressure faster than a slow, steady scroll.
- Recovery activates above threshold and does not chatter around the boundary.
- Forced cool-down suppresses cosmetic spikes and returns to calm.
- Output is independent of 30/60/120 Hz frame cadence within a defined tolerance.
- X remains bounded and follows the logistic recurrence for a fixed seed.
- Local proximity changes one region more than distant regions.
- Reduced-motion and mobile profiles enforce their caps.
- Hidden tab does not accumulate a large dt or wake in a high-chaos state.
- Accessible text, link targets, copy/select behavior, and contact actions remain unchanged throughout mutation.
- Audio never starts without an explicit gesture.

Definition of done: after any input sequence, stop interacting and the site returns to its readable baseline. The user may be surprised by the journey, never trapped in it.
