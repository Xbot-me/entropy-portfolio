/**
 * Project Cards — Local Entropy Soft-Collapse
 * Each card is a living object with its own local entropy.
 * Hover / proximity / global chaos can soft-collapse it;
 * it always tries to reform.
 */

import { getEntropy, updateLocal } from "./entropy";

type CardRecord = {
  el: HTMLElement;
  id: string;
  baseTransform: string;
  localBoost: number; // extra from hover/proximity
  lastHover: number;
};

const cards: CardRecord[] = [];
let rafId = 0;
let pointerX = 0;
let pointerY = 0;

function getProximity(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(pointerX - cx, pointerY - cy);
  // 0 at center, falls off over ~220px
  return Math.max(0, 1 - dist / 220);
}

export function registerProjectCards() {
  cards.length = 0;
  document.querySelectorAll<HTMLElement>(".project[data-entropy]").forEach((el) => {
    const id = el.dataset.entropy || "proj";
    cards.push({
      el,
      id,
      baseTransform: "",
      localBoost: 0,
      lastHover: 0,
    });

    // Hover boost
    el.addEventListener("pointerenter", () => {
      const rec = cards.find((c) => c.el === el);
      if (rec) {
        rec.localBoost = 0.55;
        rec.lastHover = performance.now();
      }
    });
    el.addEventListener("pointerleave", () => {
      const rec = cards.find((c) => c.el === el);
      if (rec) {
        rec.localBoost = 0;
      }
    });
  });
}

function tick() {
  const global = getEntropy().global;
  const now = performance.now();

  cards.forEach((rec, index) => {
    // Local entropy = global influence + proximity + hover boost
    const prox = getProximity(rec.el);
    const hoverDecay = Math.max(0, 1 - (now - rec.lastHover) / 1400);
    const boost = Math.max(rec.localBoost * hoverDecay, prox * 0.45);

    const local = updateLocal(rec.id, global * 0.5 + boost);
    const intensity = Math.min(1, Math.max(global * 0.7, local, boost));

    // --- Soft collapse parameters ---
    // Scale down slightly, skew, shift, reduce opacity of content
    const scale = 1 - intensity * 0.06;
    const skewX = Math.sin(now * 0.0013 + index * 1.7) * intensity * 2.2;
    const skewY = Math.cos(now * 0.0011 + index) * intensity * 1.4;
    const tx = Math.sin(now * 0.0009 + index * 2.1) * intensity * 4.5;
    const ty = Math.cos(now * 0.0008 + index * 1.3) * intensity * 3.2;
    const rot = Math.sin(now * 0.0007 + index) * intensity * 1.1;

    // Residual micro-life even at rest
    const resX = Math.sin(now * 0.00035 + index) * 0.2;
    const resY = Math.cos(now * 0.0003 + index * 0.7) * 0.15;

    rec.el.style.transform = `
      translate3d(${(tx + resX).toFixed(2)}px, ${(ty + resY).toFixed(2)}px, 0)
      rotate(${rot.toFixed(3)}deg)
      skew(${skewX.toFixed(2)}deg, ${skewY.toFixed(2)}deg)
      scale(${scale.toFixed(4)})
    `;

    // Border / glow reacts
    const borderAlpha = 0.08 + intensity * 0.35;
    const glow = intensity > 0.3 ? intensity * 18 : 0;
    rec.el.style.borderColor = `rgba(201, 162, 39, ${borderAlpha.toFixed(3)})`;
    rec.el.style.boxShadow =
      glow > 2
        ? `0 0 ${glow.toFixed(1)}px rgba(201, 162, 39, ${(intensity * 0.2).toFixed(3)})`
        : "none";

    // Content inside soft-fades / shifts under high local entropy
    const desc = rec.el.querySelector(".project__desc") as HTMLElement | null;
    const tags = rec.el.querySelector(".project__tags") as HTMLElement | null;
    const year = rec.el.querySelector(".project__year") as HTMLElement | null;

    if (desc) {
      const dOpac = 1 - intensity * 0.35;
      desc.style.opacity = Math.max(0.45, dOpac).toFixed(3);
      desc.style.filter = intensity > 0.55 ? `blur(${((intensity - 0.55) * 1.4).toFixed(2)}px)` : "none";
    }
    if (tags) {
      tags.style.opacity = (1 - intensity * 0.25).toFixed(3);
      tags.style.transform = `translateY(${(intensity * 4).toFixed(1)}px)`;
    }
    if (year) {
      year.style.opacity = (0.8 - intensity * 0.3).toFixed(3);
    }

    // Under very high local intensity the card "cracks" — slight clip or overflow feel
    if (intensity > 0.72) {
      rec.el.style.overflow = "hidden";
      // subtle internal shift of title already handled by global char mutation
    } else {
      rec.el.style.overflow = "";
    }
  });

  rafId = requestAnimationFrame(tick);
}

export function startProjectCards() {
  registerProjectCards();

  window.addEventListener(
    "pointermove",
    (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    },
    { passive: true }
  );

  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}
