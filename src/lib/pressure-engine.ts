/**
 * Behavior-responsive visual layer.
 *
 * The page is composed at rest. Pointer movement and fast scrolling briefly
 * increase visual pressure; the value decays back to zero. No perpetual
 * animation loop, character randomization, audio, or layout displacement.
 */
export function startPressureEngine(): void {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) return;

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointerPressureCap = isCoarsePointer ? 0.25 : 0.58;
  const scrollPressureCap = isCoarsePointer ? 0.42 : 0.72;
  const pressureDecay = isCoarsePointer ? 0.955 : 0.982;

  let targetX = window.innerWidth * 0.68;
  let targetY = window.innerHeight * 0.24;
  let currentX = targetX;
  let currentY = targetY;
  let targetPressure = 0;
  let pressure = 0;
  let lastPointerX = targetX;
  let lastPointerY = targetY;
  let lastPointerTime = performance.now();
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let frame = 0;

  const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

  const wake = (): void => {
    if (frame === 0) frame = window.requestAnimationFrame(tick);
  };

  const tick = (now: number): void => {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.12;
    currentY += dy * 0.12;

    targetPressure *= pressureDecay;
    pressure += (targetPressure - pressure) * 0.16;
    if (pressure < 0.003 && targetPressure < 0.003) {
      pressure = 0;
      targetPressure = 0;
    }

    root.style.setProperty("--pointer-x", currentX.toFixed(1) + "px");
    root.style.setProperty("--pointer-y", currentY.toFixed(1) + "px");
    root.style.setProperty(
      "--drift-x",
      (((currentX / Math.max(window.innerWidth, 1)) - 0.5) * 18).toFixed(2) + "px",
    );
    root.style.setProperty(
      "--drift-y",
      (((currentY / Math.max(window.innerHeight, 1)) - 0.5) * 12).toFixed(2) + "px",
    );
    root.style.setProperty("--pressure", pressure.toFixed(3));
    root.style.setProperty("--pressure-opacity", (0.35 + pressure * 0.65).toFixed(3));
    body.classList.toggle("is-pressured", pressure > 0.28);

    const pointerSettled = Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2;
    if (!pointerSettled || pressure > 0.003 || targetPressure > 0.003) {
      frame = window.requestAnimationFrame(tick);
    } else {
      frame = 0;
    }
  };

  window.addEventListener(
    "pointermove",
    (event: PointerEvent) => {
      const now = performance.now();
      const elapsed = Math.max(now - lastPointerTime, 1);
      const distance = Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY);
      const velocity = distance / elapsed;

      targetX = event.clientX;
      targetY = event.clientY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = now;

      targetPressure = Math.max(targetPressure, clamp(velocity / 4.2, 0, pointerPressureCap));
      wake();
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastScrollTime, 1);
      const distance = Math.abs(window.scrollY - lastScrollY);
      const velocity = distance / elapsed;

      lastScrollY = window.scrollY;
      lastScrollTime = now;
      targetPressure = Math.max(targetPressure, clamp(velocity / 5.5, 0, scrollPressureCap));
      wake();
    },
    { passive: true },
  );

  document.querySelectorAll<HTMLElement>(".work-card__visual").forEach((visual) => {
    visual.addEventListener(
      "pointermove",
      (event: PointerEvent) => {
        const rect = visual.getBoundingClientRect();
        const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
        const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
        visual.style.setProperty("--card-x", x.toFixed(1) + "%");
        visual.style.setProperty("--card-y", y.toFixed(1) + "%");
      },
      { passive: true },
    );
  });

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-nav a"));
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector<HTMLElement>(id) : null;
    })
    .filter((section): section is HTMLElement => section !== null);

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const activeId = "#" + entry.target.id;
          for (const link of links) {
            const active = link.getAttribute("href") === activeId;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  window.addEventListener(
    "resize",
    () => {
      targetX = clamp(targetX, 0, window.innerWidth);
      targetY = clamp(targetY, 0, window.innerHeight);
      wake();
    },
    { passive: true },
  );

  window.addEventListener(
    "pagehide",
    () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
    },
    { once: true },
  );

  // Keep the first paint stable. The first frame starts only after real input.
  root.style.setProperty("--pointer-x", targetX.toFixed(1) + "px");
  root.style.setProperty("--pointer-y", targetY.toFixed(1) + "px");
}