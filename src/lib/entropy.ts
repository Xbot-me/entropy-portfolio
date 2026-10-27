/**
 * Entropy Engine
 * Real dynamical system controlling Order ↔ Chaos.
 * Forced decay + soft caps prevent permanent annoyance.
 */

export type EntropyInputs = {
  scrollVelocity: number;
  scrollAcceleration: number;
  directionChanges: number;
  mouseVelocity: number;
  proximity: number;
  hoverIntensity: number;
  clickRate: number;
  timeSinceInput: number;
};

export type EntropyState = {
  global: number;
  local: Map<string, number>;
  lastUpdate: number;
  recoveryActive: boolean;
  hardCap: number;
};

const DEFAULT_STATE: EntropyState = {
  global: 0,
  local: new Map(),
  lastUpdate: performance.now(),
  recoveryActive: false,
  hardCap: 1.0,
};

const ATTACK = 0.045;
const BASE_DECAY = 0.965;
const RECOVERY_DECAY = 0.92;
const RECOVERY_THRESHOLD = 0.75;
const FORCE_COOLDOWN_THRESHOLD = 0.87;
const FORCE_COOLDOWN_DURATION = 4200;

let state: EntropyState = { ...DEFAULT_STATE, local: new Map() };
let forceCooldownUntil = 0;
let listeners: Set<(s: EntropyState) => void> = new Set();

export function setDeviceProfile(isMobile: boolean, reducedMotion: boolean) {
  if (reducedMotion) {
    state.hardCap = 0.25;
  } else if (isMobile) {
    state.hardCap = 0.58;
  } else {
    state.hardCap = 1.0;
  }
}

export function updateEntropy(inputs: Partial<EntropyInputs>, dt = 16.67) {
  const now = performance.now();

  if (now < forceCooldownUntil) {
    state.global *= 0.88;
    state.global = Math.max(0, state.global);
    notify();
    return state;
  }

  const scrollEnergy =
    Math.min(1, Math.abs(inputs.scrollVelocity ?? 0) / 40) * 0.55 +
    Math.min(1, Math.abs(inputs.scrollAcceleration ?? 0) / 80) * 0.25 +
    Math.min(1, (inputs.directionChanges ?? 0) / 6) * 0.35;

  const pointerEnergy =
    Math.min(1, (inputs.mouseVelocity ?? 0) / 1200) * 0.4 +
    (inputs.proximity ?? 0) * 0.5 +
    (inputs.hoverIntensity ?? 0) * 0.3;

  const clickEnergy = Math.min(1, (inputs.clickRate ?? 0) / 4) * 0.45;

  const raw = Math.min(1.8, scrollEnergy + pointerEnergy + clickEnergy);

  state.global += ATTACK * raw * (dt / 16.67);

  const decay = state.recoveryActive ? RECOVERY_DECAY : BASE_DECAY;
  const calmBoost = (inputs.timeSinceInput ?? 0) > 1800 ? 0.015 : 0;
  state.global *= decay - calmBoost;

  if (state.global > RECOVERY_THRESHOLD) {
    state.recoveryActive = true;
  } else if (state.global < 0.45) {
    state.recoveryActive = false;
  }

  if (state.global > FORCE_COOLDOWN_THRESHOLD) {
    forceCooldownUntil = now + FORCE_COOLDOWN_DURATION;
    state.recoveryActive = true;
  }

  state.global = Math.max(0, Math.min(state.hardCap, state.global));
  state.lastUpdate = now;

  document.documentElement.style.setProperty("--entropy", state.global.toFixed(4));

  notify();
  return state;
}

export function updateLocal(id: string, influence: number) {
  const current = state.local.get(id) ?? 0;
  const next = current * 0.92 + influence * 0.18 + state.global * 0.12;
  state.local.set(id, Math.min(1, next));
  return state.local.get(id)!;
}

export function getEntropy() {
  return state;
}

export function subscribe(fn: (s: EntropyState) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

export function resetEntropy() {
  state = { ...DEFAULT_STATE, local: new Map(), hardCap: state.hardCap };
  forceCooldownUntil = 0;
  document.documentElement.style.setProperty("--entropy", "0");
  notify();
}
