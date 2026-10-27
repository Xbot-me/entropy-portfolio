/**
 * Visual Controller
 * Translates entropy into imperfect visual consequences.
 */

import { getEntropy, updateLocal } from "./entropy";
import {
  createCharStates,
  mutateChars,
  recoverChars,
  hardResetChars,
  type CharState,
} from "./alien-mutation";

type ElementRecord = {
  el: HTMLElement;
  id: string;
  originalTransform: string;
  chars?: HTMLElement[];
  charStates?: CharState[];
};

const tracked: ElementRecord[] = [];
let rafId = 0;
let lastEntropy = 0;
let recoveryFrames = 0;

function splitText(el: HTMLElement): HTMLElement[] | undefined {
  if (el.dataset.split === "true") {
    return Array.from(el.querySelectorAll("span")) as HTMLElement[];
  }
  const text = el.textContent || "";
  el.textContent = "";
  el.dataset.split = "true";

  const frag = document.createDocumentFragment();
  for (const char of text) {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity, filter";
    frag.appendChild(span);
  }
  el.appendChild(frag);
  return Array.from(el.querySelectorAll("span")) as HTMLElement[];
}

export function registerEntropyElements() {
  tracked.length = 0;

  document.querySelectorAll<HTMLElement>("[data-entropy]").forEach((el) => {
    const id = el.dataset.entropy || crypto.randomUUID();
    tracked.push({
      el,
      id,
      originalTransform: el.style.transform || "",
    });
  });

  const splitTargets = document.querySelectorAll<HTMLElement>(
    ".entry__title, .presence__lead, .presence__bn, .contact h2, .project__title"
  );

  splitTargets.forEach((el) => {
    const chars = splitText(el);
    if (!chars) return;

    const states = createCharStates(chars);
    const parent = el.closest("[data-entropy]") as HTMLElement | null;
    const record = tracked.find((t) => t.el === parent || t.el === el);

    if (record) {
      record.chars = chars;
      record.charStates = states;
    } else {
      tracked.push({
        el,
        id: el.className || "split-" + Math.random().toString(36).slice(2, 7),
        originalTransform: "",
        chars,
        charStates: states,
      });
    }
  });
}

function tick() {
  const state = getEntropy();
  const e = state.global;
  const now = performance.now();
  const falling = e < lastEntropy - 0.008;
  lastEntropy = e;

  if (falling && e < 0.4) {
    recoveryFrames = Math.min(30, recoveryFrames + 1);
  } else {
    recoveryFrames = Math.max(0, recoveryFrames - 1);
  }

  document.documentElement.style.setProperty("--entropy", e.toFixed(3));

  tracked.forEach((rec) => {
    const local = updateLocal(rec.id, e * 0.6);
    const intensity = Math.max(e, local * 0.85);

    const driftX = Math.sin(now * 0.0011 + rec.id.length) * intensity * 2.8;
    const driftY = Math.cos(now * 0.0009 + rec.id.length * 2) * intensity * 1.9;
    const rot = Math.sin(now * 0.0007) * intensity * 0.4;
    const residualX = Math.sin(now * 0.0004 + rec.id.length) * 0.15;
    const residualY = Math.cos(now * 0.00035) * 0.12;

    rec.el.style.transform = `translate3d(${(driftX + residualX).toFixed(2)}px, ${(driftY + residualY).toFixed(2)}px, 0) rotate(${rot.toFixed(3)}deg)`;

    if (intensity > 0.35) {
      const opac = 1 - intensity * 0.08 * Math.abs(Math.sin(now * 0.003));
      rec.el.style.opacity = Math.max(0.82, opac).toFixed(3);
    } else {
      rec.el.style.opacity = "1";
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const charThreshold = isMobile ? 0.28 : 0.12;

    if (rec.chars && rec.charStates) {
      if (intensity > charThreshold) {
        rec.chars.forEach((span, i) => {
          const seed = i * 0.37 + now * 0.001;
          const charIntensity = intensity * (0.6 + Math.sin(seed) * 0.4);
          const scale = isMobile ? 0.45 : 1;

          const cx = Math.sin(seed * 1.7) * charIntensity * 3.5 * scale;
          const cy = Math.cos(seed * 1.3) * charIntensity * 2.8 * scale;
          const cRot = Math.sin(seed) * charIntensity * 4 * scale;
          const blur = charIntensity > 0.55 ? (charIntensity - 0.55) * 1.8 * scale : 0;

          span.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) rotate(${cRot.toFixed(2)}deg)`;
          span.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";

          if (charIntensity > 0.7 && Math.sin(seed * 4.1) > 0.92) {
            span.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
          } else {
            span.style.opacity = "1";
          }
        });

        const mutationIntensity = isMobile ? intensity * 0.7 : intensity;
        if (mutationIntensity > 0.22) {
          mutateChars(rec.charStates, mutationIntensity, now);
        }
      } else {
        rec.chars.forEach((span) => {
          span.style.transform = "";
          span.style.filter = "none";
          span.style.opacity = "1";
        });

        if (recoveryFrames > 0 || e < 0.2) {
          recoverChars(rec.charStates, e < 0.12);
        }
      }
    }
  });

  if (e > 0.4) {
    const fracture = (e - 0.4) * 1.6;
    document.documentElement.style.setProperty(
      "--accent",
      `color-mix(in srgb, #c9a227 ${Math.max(40, 100 - fracture * 35)}%, #3a4a5c ${fracture * 45}%)`
    );
  } else {
    document.documentElement.style.setProperty("--accent", "#c9a227");
  }

  rafId = requestAnimationFrame(tick);
}

export function startVisualController() {
  registerEntropyElements();
  rafId = requestAnimationFrame(tick);

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleReduced = () => {
    if (mq.matches) {
      tracked.forEach((r) => {
        if (r.charStates) hardResetChars(r.charStates);
        r.el.style.transform = r.originalTransform;
        r.el.style.opacity = "1";
      });
    }
  };
  mq.addEventListener("change", handleReduced);
  handleReduced();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      tracked.forEach((r) => {
        if (r.charStates) hardResetChars(r.charStates);
      });
    }
  });

  return () => cancelAnimationFrame(rafId);
}
