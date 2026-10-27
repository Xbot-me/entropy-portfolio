/**
 * Collects all behavioral inputs and feeds the entropy engine.
 * Scroll, pointer, clicks, proximity — everything.
 */

import { updateEntropy, setDeviceProfile, type EntropyInputs } from "./entropy";

let lastScrollY = 0;
let lastScrollTime = performance.now();
let lastVelocity = 0;
let directionChanges = 0;
let lastDirection = 0;
let mouseVX = 0;
let mouseVY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = performance.now();
let clickTimestamps: number[] = [];
let lastSignificantInput = performance.now();
let proximity = 0;
let hoverIntensity = 0;
let lastAccel = 0;
let rafId = 0;

function normalizeScrollVelocity(dy: number, dt: number) {
  if (dt <= 0) return 0;
  return dy / dt; // px per ms
}

export function startInputCollector() {
  // Device profile
  const isMobile = window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setDeviceProfile(isMobile, reducedMotion);

  // Scroll
  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const now = performance.now();
        const y = window.scrollY;
        const dy = y - lastScrollY;
        const dt = Math.max(now - lastScrollTime, 1);
        const velocity = normalizeScrollVelocity(dy, dt);
        const acceleration = (velocity - lastVelocity) / dt;
        lastAccel = acceleration;

        // Direction change detection
        const dir = Math.sign(dy);
        if (dir !== 0 && dir !== lastDirection && lastDirection !== 0) {
          directionChanges = Math.min(12, directionChanges + 1.8);
        }
        if (dir !== 0) lastDirection = dir;

        lastScrollY = y;
        lastScrollTime = now;
        lastVelocity = velocity;
        lastSignificantInput = now;
        scrollTicking = false;

        // Decay directionChanges over time
        directionChanges *= 0.90;
      });
    },
    { passive: true }
  );

  // Pointer
  window.addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      const dt = now - lastMouseTime;
      if (dt > 0) {
        mouseVX = (e.clientX - lastMouseX) / dt;
        mouseVY = (e.clientY - lastMouseY) / dt;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastMouseTime = now;
      lastSignificantInput = now;

      // Simple proximity: distance to any [data-entropy] element
      const nodes = document.querySelectorAll("[data-entropy]");
      let minDist = Infinity;
      nodes.forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        minDist = Math.min(minDist, dist);
      });
      // 0 at center, 1 far away → invert to proximity
      proximity = Math.max(0, 1 - minDist / 280);
    },
    { passive: true }
  );

  // Clicks / taps
  window.addEventListener(
    "pointerdown",
    () => {
      const now = performance.now();
      clickTimestamps.push(now);
      clickTimestamps = clickTimestamps.filter((t) => now - t < 2000);
      lastSignificantInput = now;
    },
    { passive: true }
  );

  // Hover intensity on entropy nodes
  document.addEventListener(
    "pointerover",
    (e) => {
      const target = (e.target as HTMLElement).closest("[data-entropy]");
      if (target) hoverIntensity = 0.7;
    },
    { passive: true }
  );
  document.addEventListener(
    "pointerout",
    (e) => {
      const target = (e.target as HTMLElement).closest("[data-entropy]");
      if (target) hoverIntensity = 0;
    },
    { passive: true }
  );

  // Main loop
  function loop() {
    const now = performance.now();
    const mouseSpeed = Math.hypot(mouseVX, mouseVY) * 1000; // rough px/s
    const clickRate = clickTimestamps.length / 2;

    const inputs: EntropyInputs = {
      scrollVelocity: lastVelocity * 1000,
      scrollAcceleration: lastAccel * 1000,
      directionChanges,
      mouseVelocity: mouseSpeed,
      proximity,
      hoverIntensity,
      clickRate,
      timeSinceInput: now - lastSignificantInput,
    };

    updateEntropy(inputs);
    // Soft decay of mouse velocity
    mouseVX *= 0.85;
    mouseVY *= 0.85;

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
  };
}
