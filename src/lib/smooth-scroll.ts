/**
 * Lightweight smooth scroll (Lenis alternative while we wait for full deps).
 * Intentionally imperfect under high entropy — micro resistance / overshoot.
 */

import { getEntropy } from "./entropy";

let current = 0;
let target = 0;
let rafId = 0;
let active = false;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function loop() {
  const e = getEntropy().global;

  let ease = 0.085;

  if (e > 0.45) {
    ease = 0.085 - e * 0.035;
    const overshoot = Math.sin(performance.now() * 0.002) * e * 0.4;
    target += overshoot * 0.15;
  }

  current = lerp(current, target, ease);

  window.scrollTo(0, current);

  if (Math.abs(target - current) < 0.3 && e < 0.2) {
    active = false;
    return;
  }

  rafId = requestAnimationFrame(loop);
}

export function startSmoothScroll() {
  window.addEventListener(
    "scroll",
    () => {
      target = window.scrollY;
      if (!active) {
        active = true;
        current = window.scrollY;
        rafId = requestAnimationFrame(loop);
      }
    },
    { passive: true }
  );

  return () => {
    cancelAnimationFrame(rafId);
    active = false;
  };
}
