/**
 * Alien Text Mutation Layer
 * Pure procedural chaos. No fixed conlang.
 * Characters mutate, dissolve, and reassemble based on local entropy.
 * Affects Latin + Bangla. Meaning can temporarily collapse, then recover.
 */

// Glyph pools for mutation
const LATIN_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ALIEN_POOL = "∆∇∈∉∋∌∃∄∅∀∂∫∮∴∵∼≈≠≤≥⊂⊃⊆⊇⊕⊗⊥∠∡⊙⊚⊛⊞⊟⊠⊡⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊀⊁⊄⊅⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔";
const GLITCH_POOL = "░▒▓█▄▀▌▐■□▪▫●○◦•‧∙∘°";
const BANGLA_POOL = "অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃেৈোৌ্ৎংঃঁ";

// Mixed chaos pool — heavier weight on alien + glitch under high entropy
function pickMutated(original: string, intensity: number, seed: number): string {
  if (original === "\u00A0" || original === " " || original === "\n") return original;

  // Very low intensity → stay original
  if (intensity < 0.18) return original;

  // Deterministic-ish randomness from seed
  const r = Math.abs(Math.sin(seed * 12.9898 + intensity * 78.233) * 43758.5453) % 1;

  // Probability of mutation rises with intensity
  const mutateChance = Math.min(0.92, (intensity - 0.18) * 1.6);
  if (r > mutateChance) return original;

  // Choose pool based on intensity + original script
  const isBangla = /[\u0980-\u09FF]/.test(original);
  let pool: string;

  if (intensity > 0.75) {
    // High chaos: heavy alien + glitch
    pool = r > 0.4 ? ALIEN_POOL : GLITCH_POOL;
  } else if (intensity > 0.5) {
    // Mid: mix of alien and same-script
    pool = isBangla
      ? (r > 0.55 ? BANGLA_POOL : ALIEN_POOL)
      : (r > 0.5 ? LATIN_POOL : ALIEN_POOL);
  } else {
    // Lower chaos: mostly same script, occasional alien
    pool = isBangla
      ? (r > 0.7 ? BANGLA_POOL : original)
      : (r > 0.65 ? LATIN_POOL : original);
    if (pool === original) return original;
  }

  const idx = Math.floor(
    (Math.abs(Math.sin(seed * 4.1 + intensity * 9.2)) % 1) * pool.length
  );
  return pool[idx] || original;
}

export type CharState = {
  span: HTMLElement;
  original: string;
  current: string;
  lastMutate: number;
};

/** Create char state from already-split spans */
export function createCharStates(spans: HTMLElement[]): CharState[] {
  return spans.map((span) => ({
    span,
    original: span.textContent || "",
    current: span.textContent || "",
    lastMutate: 0,
  }));
}

/**
 * Apply mutation to a set of character states.
 * intensity: 0–1 (local or global entropy)
 * Returns true if any character actually changed.
 */
export function mutateChars(
  states: CharState[],
  intensity: number,
  now: number
): boolean {
  if (!states || states.length === 0) return false;

  let changed = false;
  const cooldown = intensity > 0.7 ? 45 : intensity > 0.45 ? 90 : 140; // ms between possible mutations per char

  states.forEach((cs, i) => {
    if (now - cs.lastMutate < cooldown) return;

    const seed = i * 1.618 + now * 0.001 + intensity * 10;
    const next = pickMutated(cs.original, intensity, seed);

    if (next !== cs.current) {
      cs.span.textContent = next;
      cs.current = next;
      cs.lastMutate = now;
      changed = true;

      // Brief visual flash on mutation
      if (intensity > 0.4) {
        cs.span.style.color = intensity > 0.65 ? "var(--accent-bright)" : "var(--accent)";
        // restore after a frame
        requestAnimationFrame(() => {
          setTimeout(() => {
            cs.span.style.color = "";
          }, 60 + Math.random() * 80);
        });
      }
    }
  });

  return changed;
}

/**
 * Force recovery toward original characters.
 * Called when entropy drops so meaning reassembles.
 */
export function recoverChars(states: CharState[], force = false): void {
  if (!states) return;
  states.forEach((cs) => {
    if (cs.current === cs.original) return;

    // Force = hard reset. Otherwise probabilistic + slower for a more human recovery.
    const chance = force ? 1 : 0.42;
    if (Math.random() < chance) {
      cs.span.textContent = cs.original;
      cs.current = cs.original;
      cs.span.style.color = "";
    }
    // else: leave it mutated a little longer — intentional imperfection
  });
}

/** Full hard reset (e.g. on reduced-motion or page hide) */
export function hardResetChars(states: CharState[]): void {
  if (!states) return;
  states.forEach((cs) => {
    cs.span.textContent = cs.original;
    cs.current = cs.original;
    cs.span.style.color = "";
    cs.span.style.transform = "";
    cs.span.style.filter = "";
    cs.span.style.opacity = "1";
  });
}
