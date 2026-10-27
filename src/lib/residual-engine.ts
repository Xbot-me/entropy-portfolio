type Profile = {
  ceiling: number;
  inputGain: number;
  baseRecovery: number;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

type Region = {
  element: HTMLElement;
  local: number;
  dwellStart: number;
  lastMutation: number;
  echo?: HTMLElement;
  source?: string;
};

const GLYPHS = ["∿", "∷", "◌", "⊗", "ϟ", "ᚦ", "⌁", "Ⱥ", "⨯", "⋮", "⟊", "⟡", "⧖", "⫶", "⤫"];
const LATIN_SHAPES: Record<string, string[]> = {
  a: ["ɑ", "Ⱥ", "∂"], e: ["ɛ", "∃"], i: ["ı", "!", "¦"], o: ["ø", "○", "°"],
  s: ["§", "∫"], t: ["†", "ŧ"], r: ["ɍ", "Я"], n: ["ŋ", "⋒"], m: ["⋔", "ɱ"],
};
const clamp = (v: number, min = 0, max = 1): number => Math.max(min, Math.min(max, v));
const smoothToward = (from: number, to: number, rate: number, dt: number): number =>
  to + (from - to) * Math.exp(-rate * dt);

function readProfile(): Profile {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const lowPower = Boolean(connection?.saveData || connection?.effectiveType === "slow-2g");
  if (reducedMotion) return { ceiling: 0.2, inputGain: 0.25, baseRecovery: 1.8, reducedMotion, coarsePointer };
  if (lowPower) return { ceiling: 0.38, inputGain: 0.45, baseRecovery: 1.25, reducedMotion, coarsePointer };
  if (coarsePointer) return { ceiling: 0.58, inputGain: 0.68, baseRecovery: 0.8, reducedMotion, coarsePointer };
  return { ceiling: 1, inputGain: 1, baseRecovery: 0.45, reducedMotion, coarsePointer };
}

function graphemes(text: string): string[] {
  if ("Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), part => part.segment);
  }
  return Array.from(text);
}

function mutatedEcho(source: string, pressure: number, chaotic: number, seed: number): string {
  if (pressure < 0.2) return source;
  const parts = graphemes(source);
  const mutationRate = clamp((pressure - 0.12) * 0.48, 0, 0.34);
  const result = parts.map((part, index) => {
    if (/^\s+$/.test(part) || /^[.,:;!?()[\]{}'"“”'’—–-]+$/.test(part)) return part;
    const phase = Math.abs(Math.sin((index + 1) * 12.9898 + chaotic * 78.233 + seed * 0.19));
    if (phase > mutationRate) return part;
    if (/^[A-Za-z]$/.test(part)) {
      const pool = LATIN_SHAPES[part.toLowerCase()];
      if (pool && phase < mutationRate * 0.72) return pool[Math.floor((chaotic * 17 + index + seed) % pool.length)];
    }
    if (/\p{Script=Bengali}/u.test(part)) {
      // Keep Bengali combining marks attached; replace selected graphemes only with an abstract echo.
      return phase < mutationRate * 0.42 ? GLYPHS[Math.floor((chaotic * 31 + index + seed) % GLYPHS.length)] : part;
    }
    return GLYPHS[Math.floor((chaotic * 31 + index + seed) % GLYPHS.length)];
  });
  return result.join("");
}

export function startResidualEngine(): () => void {
  const root = document.documentElement;
  const body = document.body;
  const profile = readProfile();
  const now = () => performance.now();
  let pressure = 0;
  let chaotic = 0.2 + Math.random() * 0.6;
  let attractorR = 3.82;
  let lastTick = now();
  let lastInput = now();
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let previousScrollVelocity = 0;
  let scrollAcceleration = 0;
  let lastScrollDirection = 0;
  let directionChanges = 0;
  let pointerVelocity = 0;
  let proximity = 0;
  let hoverDwell = 0;
  let clicks: number[] = [];
  let keyboardImpulse = 0;
  let activeRegion: Region | null = null;
  let raf = 0;
  let lastModelUpdate = 0;
  let timeAtHighPressure = 0;
  let recoveryUntil = 0;
  let recovering = false;
  let lastPointerX = window.innerWidth * 0.65;
  let lastPointerY = window.innerHeight * 0.2;
  let lastPointerAt = now();
  let disposed = false;

  const regions: Region[] = Array.from(document.querySelectorAll<HTMLElement>("[data-alien='true'], [data-entropy-region]"))
    .map(element => {
      const isText = element.dataset.alien === "true";
      const region: Region = { element, local: 0, dwellStart: 0, lastMutation: 0 };
      if (isText) {
        region.source = element.textContent || "";
        const echo = document.createElement("span");
        echo.className = "alien-echo";
        echo.setAttribute("aria-hidden", "true");
        echo.textContent = region.source;
        element.appendChild(echo);
        region.echo = echo;
      }
      return region;
    });

  const setActiveRegion = (region: Region | null): void => {
    const timestamp = now();
    if (region === activeRegion) return;
    if (activeRegion) activeRegion.dwellStart = 0;
    activeRegion = region;
    proximity = region ? 1 : 0;
    hoverDwell = 0;
    if (region) region.dwellStart = timestamp;
  };

  const wake = (): void => {
    if (!raf && !disposed && !profile.reducedMotion) raf = requestAnimationFrame(tick);
  };

  const applyVisuals = (timestamp: number, dt: number): void => {
    const effective = clamp(pressure, 0, profile.ceiling);
    root.style.setProperty("--pressure", effective.toFixed(3));
    root.style.setProperty("--pointer-x", lastPointerX.toFixed(1) + "px");
    root.style.setProperty("--pointer-y", lastPointerY.toFixed(1) + "px");
    const ratio = profile.ceiling > 0 ? effective / profile.ceiling : 0;
    root.style.setProperty("--echo-x", (Math.sin(chaotic * 8) * ratio * (profile.coarsePointer ? 2 : 5)).toFixed(2) + "px");
    root.style.setProperty("--echo-y", (Math.cos(chaotic * 11) * ratio * (profile.coarsePointer ? 1.5 : 3.5)).toFixed(2) + "px");
    body.classList.toggle("is-pressured", effective > 0.28);
    body.classList.toggle("is-recovering", recovering);

    for (const region of regions) {
      const local = clamp(region.local, 0, profile.ceiling);
      region.element.classList.toggle("is-pressured", local > 0.25);
      if (region.echo && region.source !== undefined) {
        const echoOpacity = profile.reducedMotion ? 0 : clamp((local - 0.12) * 0.7, 0, 0.42);
        region.echo.style.setProperty("--echo-opacity", echoOpacity.toFixed(3));
        region.echo.style.setProperty("--echo-x", (Math.sin(chaotic * 7 + regions.indexOf(region)) * local * (profile.coarsePointer ? 1.2 : 3.2)).toFixed(2) + "px");
        region.echo.style.setProperty("--echo-y", (Math.cos(chaotic * 5 + regions.indexOf(region)) * local * (profile.coarsePointer ? 0.8 : 1.8)).toFixed(2) + "px");
        if (timestamp - region.lastMutation > (profile.coarsePointer ? 170 : 95)) {
          region.echo.textContent = mutatedEcho(region.source, local, chaotic, regions.indexOf(region) * 13 + 5);
          region.lastMutation = timestamp;
        }
      }
    }
  };

  function tick(timestamp: number): void {
    raf = 0;
    if (disposed) return;
    if (document.hidden) {
      pressure = 0;
      recovering = false;
      recoveryUntil = 0;
      applyVisuals(timestamp, 0);
      return;
    }

    const dt = clamp((timestamp - lastTick) / 1000, 0, 0.05);
    lastTick = timestamp;

    // Re-sample velocity-derived inputs at a stable 30 Hz model cadence.
    const modelDue = timestamp - lastModelUpdate >= 1000 / 30;
    if (modelDue) {
      const modelDt = clamp((timestamp - lastModelUpdate) / 1000, 0, 0.05);
      lastModelUpdate = timestamp;
      clicks = clicks.filter(t => timestamp - t < 1500);
      directionChanges *= Math.exp(-modelDt * 1.8);
      pointerVelocity *= Math.exp(-modelDt * 3.2);
      keyboardImpulse *= Math.exp(-modelDt * 5.5);
      const idleFor = timestamp - lastInput;
      if (activeRegion && idleFor < 500) hoverDwell = clamp((timestamp - activeRegion.dwellStart) / 1200, 0, 1);
      else {
        hoverDwell *= Math.exp(-modelDt * 2.4);
        proximity *= Math.exp(-modelDt * 1.8);
      }

      const clickBurst = clamp(clicks.length / 4);
      const scrollA = clamp(scrollVelocity);
      const accelA = clamp(scrollAcceleration);
      const directionA = clamp(directionChanges);
      const pointerA = clamp(pointerVelocity);
      const proximityA = clamp(proximity);
      const hoverA = clamp(hoverDwell);
      const keyboardA = clamp(keyboardImpulse);
      const activity =
        (0.24 * scrollA + 0.10 * accelA + 0.12 * directionA +
         0.12 * pointerA + 0.16 * proximityA + 0.08 * hoverA +
         0.10 * clickBurst + 0.04 * keyboardA) * profile.inputGain;
      const input = clamp(activity / 0.96);
      scrollVelocity *= Math.exp(-modelDt * 2.2);
      scrollAcceleration *= Math.exp(-modelDt * 3.2);

      const normalRecovery = profile.baseRecovery;
      const currentRecovery = timestamp < recoveryUntil ? Math.max(normalRecovery, 1.4) : normalRecovery;
      const kAttack = 2.8;
      const lambda = kAttack * input + currentRecovery;
      const equilibrium = lambda > 0 ? (kAttack * input) / lambda : 0;
      pressure = equilibrium + (pressure - equilibrium) * Math.exp(-lambda * modelDt);
      if (input === 0 && pressure < 0.004) pressure = 0;

      // A driven logistic map supplies bounded irregularity; pressure decides how much is visible.
      if (pressure > 0.08) {
        attractorR = 3.82 + 0.12 * input;
        chaotic = attractorR * chaotic * (1 - chaotic) + 0.004 * (2 * input - 1);
        chaotic = clamp(chaotic, 0.001, 0.999);
      }

      if (pressure > 0.72 && !recovering) recovering = true;
      if (recovering && pressure < 0.48 && timestamp >= recoveryUntil) recovering = false;
      if (pressure > 0.78) timeAtHighPressure += modelDt;
      else timeAtHighPressure = Math.max(0, timeAtHighPressure - modelDt * 2);
      if ((pressure > 0.88 || timeAtHighPressure > 1.2) && timestamp >= recoveryUntil) {
        recoveryUntil = timestamp + 1800;
        recovering = true;
        timeAtHighPressure = 0;
      }
      if (recovering && timestamp < recoveryUntil) {
        pressure = smoothToward(pressure, 0, 2.1, modelDt);
      }

      for (const region of regions) {
        const localTarget = clamp(0.5 * pressure + 0.35 * (region === activeRegion ? proximity : 0) + 0.15 * (region === activeRegion ? hoverDwell : 0));
        const rate = region === activeRegion ? 5.5 : 2.8;
        region.local = smoothToward(region.local, localTarget, rate, modelDt);
        region.local = clamp(region.local, 0, profile.ceiling);
      }
      pressure = clamp(pressure, 0, profile.ceiling);
    }

    applyVisuals(timestamp, dt);

    const stillActive = pressure > 0.003 || Math.abs(scrollVelocity) > 0.003 ||
      pointerVelocity > 0.015 || proximity > 0.01 || clicks.length > 0 ||
      regions.some(region => region.local > 0.003) || hoverDwell > 0.01;
    if (stillActive) {
      raf = requestAnimationFrame(tick);
    } else {
      // No perpetual animation loop at rest. Keep state and only wake on a new input.
      root.style.setProperty("--echo-x", "0px");
      root.style.setProperty("--echo-y", "0px");
      body.classList.remove("is-pressured", "is-recovering");
    }
  }

  const onPointerMove = (event: PointerEvent): void => {
    const timestamp = now();
    const elapsed = Math.max(timestamp - lastPointerAt, 1);
    const distance = Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY);
    pointerVelocity = clamp(distance / elapsed * 1000 / 1500);
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerAt = timestamp;
    lastInput = timestamp;
    root.style.setProperty("--pointer-x", lastPointerX.toFixed(1) + "px");
    root.style.setProperty("--pointer-y", lastPointerY.toFixed(1) + "px");

    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-entropy-region], [data-alien='true']") : null;
    const region = target ? (regions.find(item => item.element === target) || regions.find(item => item.element.contains(target)) || null) : null;
    setActiveRegion(region);
    if (!region) proximity = 0;
    wake();
  };

  const onScroll = (): void => {
    const timestamp = now();
    const delta = window.scrollY - lastScrollY;
    const elapsed = Math.max(timestamp - lastTick, 8);
    const velocity = Math.abs(delta) / elapsed * 1000 / Math.max(window.innerHeight, 1) / 1.5;
    const direction = Math.sign(delta);
    if (direction && lastScrollDirection && direction !== lastScrollDirection) directionChanges = clamp(directionChanges + 0.28);
    if (direction) lastScrollDirection = direction;
    previousScrollVelocity = scrollVelocity;
    scrollVelocity = clamp(velocity);
    scrollAcceleration = clamp(Math.abs(scrollVelocity - previousScrollVelocity) / 0.7);
    lastScrollY = window.scrollY;
    lastInput = timestamp;
    wake();
  };

  const onPointerDown = (): void => {
    const timestamp = now();
    clicks.push(timestamp);
    lastInput = timestamp;
    wake();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
      keyboardImpulse = Math.min(1, keyboardImpulse + 0.3);
      lastInput = now();
      wake();
    }
  };

  const onPointerOut = (event: PointerEvent): void => {
    if (event.relatedTarget === null) setActiveRegion(null);
  };

  const onVisibility = (): void => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      pressure = 0;
      recovering = false;
      recoveryUntil = 0;
      for (const region of regions) region.local = 0;
      applyVisuals(now(), 0);
    } else {
      lastTick = now();
      lastInput = now();
      scrollVelocity = 0;
      pointerVelocity = 0;
      wake();
    }
  };

  const onResize = (): void => {
    lastPointerX = Math.min(lastPointerX, window.innerWidth);
    lastPointerY = Math.min(lastPointerY, window.innerHeight);
    wake();
  };

  const onPageHide = (): void => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide, { once: true });

  // Initial state is composed, not animated. Interactions start the model.
  root.style.setProperty("--pressure", "0");
  root.style.setProperty("--echo-x", "0px");
  root.style.setProperty("--echo-y", "0px");

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
  };
}