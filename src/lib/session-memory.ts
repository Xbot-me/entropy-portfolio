/**
 * Session Entropy Memory
 * Light persistence of the visitor's entropy signature.
 * Used to reflect the journey in the contact section and
 * optionally greet returning visitors with a slightly different starting state.
 */

import { getEntropy, subscribe } from "./entropy";

export type SessionSignature = {
  peak: number;
  accumulated: number;
  samples: number;
  startedAt: number;
  lastSeenAt: number;
  visitCount: number;
};

const SESSION_KEY = "entropy-session";
const VISIT_KEY = "entropy-visits";

let signature: SessionSignature = {
  peak: 0,
  accumulated: 0,
  samples: 0,
  startedAt: Date.now(),
  lastSeenAt: Date.now(),
  visitCount: 1,
};

let unsub: (() => void) | null = null;
let sampleTimer = 0;

function loadVisitCount(): number {
  try {
    return parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveVisitCount(n: number) {
  try {
    localStorage.setItem(VISIT_KEY, String(n));
  } catch {
    /* ignore */
  }
}

function loadSession(): SessionSignature | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionSignature;
  } catch {
    return null;
  }
}

function saveSession() {
  try {
    signature.lastSeenAt = Date.now();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(signature));
  } catch {
    /* ignore */
  }
}

export type JourneyTone = "calm" | "stirred" | "storm" | "returning";

export function getJourneyTone(): JourneyTone {
  const visits = signature.visitCount;
  if (visits > 1 && signature.peak < 0.35 && signature.samples < 40) {
    return "returning";
  }
  if (signature.peak >= 0.72 || signature.accumulated > 18) return "storm";
  if (signature.peak >= 0.4 || signature.accumulated > 6) return "stirred";
  return "calm";
}

export function getSignature(): SessionSignature {
  return { ...signature };
}

export function getContactReflection(): {
  headline: string;
  sub: string;
  body: string;
} {
  const tone = getJourneyTone();
  const peak = Math.round(signature.peak * 100);

  switch (tone) {
    case "storm":
      return {
        headline: "You stirred it.",
        sub: "Good.",
        body: `Peak chaos ${peak}%. The system recovered. I'm most useful when things are supposed to be impossible. Bring the hard problem.`,
      };
    case "stirred":
      return {
        headline: "Got a hard problem?",
        sub: "You already tested the edges.",
        body: `I'm most useful when it's supposed to be impossible. Bring me the thing your last three devs gave up on.`,
      };
    case "returning":
      return {
        headline: "Back again.",
        sub: "Still here.",
        body: `The surface is quiet. The systems underneath are not. If you have something heavy, send it.`,
      };
    default:
      return {
        headline: "Got a hard problem?",
        sub: "Good.",
        body: `I'm most useful when it's supposed to be impossible. Bring me the thing your last three devs gave up on.`,
      };
  }
}

function sample() {
  const e = getEntropy().global;
  signature.peak = Math.max(signature.peak, e);
  signature.accumulated += e * 0.08;
  signature.samples += 1;
  signature.lastSeenAt = Date.now();

  if (signature.samples % 40 === 0) {
    saveSession();
  }
}

export function startSessionMemory() {
  const existing = loadSession();
  const visits = loadVisitCount() + 1;
  saveVisitCount(visits);

  if (existing && Date.now() - existing.lastSeenAt < 1000 * 60 * 30) {
    signature = { ...existing, visitCount: visits };
  } else {
    signature = {
      peak: 0,
      accumulated: 0,
      samples: 0,
      startedAt: Date.now(),
      lastSeenAt: Date.now(),
      visitCount: visits,
    };
  }

  saveSession();

  if (visits > 1) {
    document.documentElement.style.setProperty("--entropy", "0.06");
  }

  unsub = subscribe(() => sample());
  sampleTimer = window.setInterval(sample, 1200);

  window.addEventListener("pagehide", () => saveSession());
  window.addEventListener("beforeunload", () => saveSession());

  return () => {
    if (unsub) unsub();
    clearInterval(sampleTimer);
    saveSession();
  };
}

export function applyContactReflection() {
  const reflection = getContactReflection();
  const tone = getJourneyTone();

  const headline = document.querySelector(".contact h2");
  const sub = document.querySelector(".contact__sub");
  const body = document.querySelector(".contact__body");
  const footer = document.querySelector(".contact");

  if (headline) headline.textContent = reflection.headline;
  if (sub) sub.textContent = reflection.sub;
  if (body) body.textContent = reflection.body;

  if (footer) {
    footer.setAttribute("data-journey", tone);
  }
}

export function startContactReflection() {
  applyContactReflection();

  const id = window.setInterval(() => {
    applyContactReflection();
  }, 3500);

  return () => clearInterval(id);
}
