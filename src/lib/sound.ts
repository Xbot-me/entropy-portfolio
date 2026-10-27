/**
 * Subtle Sound Design Layer
 * User-initiated only. Low evolving ambient bed.
 * Entropy modulates intensity and occasional fractured tones.
 */

import { getEntropy, subscribe } from "./entropy";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambientGain: GainNode | null = null;
let fractureGain: GainNode | null = null;
let enabled = false;
let muted = false;
let oscillators: OscillatorNode[] = [];
let started = false;
let lastFracture = 0;
let unsub: (() => void) | null = null;

const STORAGE_KEY = "entropy-sound-muted";

function loadMutePreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMutePreference(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function buildAmbient(ac: AudioContext, dest: GainNode) {
  const drone = ac.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 55;

  const droneGain = ac.createGain();
  droneGain.gain.value = 0.07;

  const lfo = ac.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.025;
  lfo.connect(lfoGain);
  lfoGain.connect(droneGain.gain);

  const partial = ac.createOscillator();
  partial.type = "sine";
  partial.frequency.value = 82.5;
  const partialGain = ac.createGain();
  partialGain.gain.value = 0.028;

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 280;
  filter.Q.value = 0.7;

  drone.connect(droneGain);
  partial.connect(partialGain);
  droneGain.connect(filter);
  partialGain.connect(filter);
  filter.connect(dest);

  drone.start();
  partial.start();
  lfo.start();

  oscillators.push(drone, partial, lfo);
  return { drone, partial, filter, droneGain, partialGain };
}

function playFracture(intensity: number) {
  if (!ctx || !fractureGain || muted) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  const base = 420 + intensity * 180 + Math.random() * 90;
  osc.frequency.setValueAtTime(base, now);
  osc.frequency.exponentialRampToValueAtTime(base * 0.6, now + 0.35 + intensity * 0.2);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.04 + intensity * 0.06, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + intensity * 0.25);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = base * 1.2;
  filter.Q.value = 2.5;

  osc.connect(filter);
  filter.connect(g);
  g.connect(fractureGain);

  osc.start(now);
  osc.stop(now + 0.7);
}

function onEntropy() {
  if (!ctx || !ambientGain || !master || muted) return;
  const e = getEntropy().global;
  const target = 0.15 + e * 0.55;
  ambientGain.gain.setTargetAtTime(target, ctx.currentTime, 0.4);

  const now = performance.now();
  if (e > 0.55 && now - lastFracture > 1800 + Math.random() * 2200) {
    playFracture(e);
    lastFracture = now;
  }
}

export async function initSound() {
  if (started) return;
  muted = loadMutePreference();

  try {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.35;
    master.connect(ctx.destination);

    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.2;
    ambientGain.connect(master);

    fractureGain = ctx.createGain();
    fractureGain.gain.value = 0.8;
    fractureGain.connect(master);

    buildAmbient(ctx, ambientGain);
    unsub = subscribe(onEntropy);
    started = true;
    enabled = true;

    if (ctx.state === "suspended") await ctx.resume();
  } catch {
    /* audio unavailable */
  }
}

export async function toggleMute(): Promise<{ muted: boolean }> {
  if (!started) {
    muted = false;
    saveMutePreference(false);
    await initSound();
    return { muted: false };
  }

  muted = !muted;
  saveMutePreference(muted);

  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : 0.35, ctx.currentTime, 0.15);
  }

  return { muted };
}

export function isMuted() {
  return muted;
}
