/**
 * Extra interactivity layer
 * Cursor trail, entropy pulse on click, scroll progress,
 * magnetic accents, section reveals.
 */

import { getEntropy, updateEntropy } from "./entropy";

let cursor: HTMLElement | null = null;
let progress: HTMLElement | null = null;
let rafId = 0;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

function createCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch

  cursor = document.createElement("div");
  cursor.className = "entropy-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  window.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) cursor.classList.add("is-visible");
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    if (cursor) cursor.classList.remove("is-visible");
  });

  // Grow near interactive elements
  document.querySelectorAll("a, button, .project, [data-entropy]").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor?.classList.add("is-active"));
    el.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
  });
}

function createProgress() {
  progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
}

function pulseAt(x: number, y: number, intensity = 0.5) {
  const pulse = document.createElement("div");
  pulse.className = "entropy-pulse";
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
  pulse.style.setProperty("--pulse-scale", String(0.6 + intensity * 1.4));
  document.body.appendChild(pulse);
  pulse.addEventListener("animationend", () => pulse.remove());
}

function setupClickPulse() {
  window.addEventListener(
    "pointerdown",
    (e) => {
      const ent = getEntropy().global;
      pulseAt(e.clientX, e.clientY, 0.35 + ent * 0.5);
      // Tiny entropy bump on intentional clicks
      updateEntropy({
        scrollVelocity: 0,
        scrollAcceleration: 0,
        directionChanges: 0,
        mouseVelocity: 0,
        proximity: 0,
        hoverIntensity: 0,
        clickRate: 2.5,
        timeSinceInput: 0,
      });
    },
    { passive: true }
  );
}

function setupMagneticLinks() {
  document.querySelectorAll<HTMLElement>(".contact__link, .sound-toggle").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

function setupSectionReveals() {
  const sections = document.querySelectorAll<HTMLElement>(
    ".presence, .work, .systems, .history, .contact"
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  sections.forEach((s) => {
    s.classList.add("will-reveal");
    io.observe(s);
  });
}

function tick() {
  // Cursor lag (imperfect follow)
  const ease = 0.14;
  cursorX += (mouseX - cursorX) * ease;
  cursorY += (mouseY - cursorY) * ease;

  if (cursor) {
    const e = getEntropy().global;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    cursor.style.setProperty("--cursor-entropy", e.toFixed(3));
  }

  // Scroll progress bar intensity tied to entropy
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    const e = getEntropy().global;
    progress.style.width = `${pct}%`;
    progress.style.opacity = String(0.35 + e * 0.5);
  }

  rafId = requestAnimationFrame(tick);
}

export function startInteractions() {
  createCursor();
  createProgress();
  setupClickPulse();
  setupMagneticLinks();
  setupSectionReveals();
  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}
