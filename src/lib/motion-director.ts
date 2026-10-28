import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Fragment = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  angle: number;
  spin: number;
  color: string;
  width: number;
};

const reduceMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = (): boolean => window.matchMedia("(pointer: coarse)").matches;
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export function startMotionDirector(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const reduced = reduceMotion();
  const coarse = coarsePointer();
  const splits: SplitText[] = [];
  const cleanups: Array<() => void> = [];
  const cursor = document.querySelector<HTMLElement>(".motion-cursor");
  const canvas = document.querySelector<HTMLCanvasElement>(".residue-canvas");
  const ctx = canvas?.getContext("2d", { alpha: true });
  const fragments: Fragment[] = [];
  let canvasFrame = 0;
  let lastTrailAt = 0;
  let previousPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, at: performance.now() };
  let disposed = false;
  let lenis: Lenis | null = null;
  let lenisTicker: ((time: number) => void) | null = null;

  if (reduced) {
    document.documentElement.classList.add("motion-reduced");
    return () => document.documentElement.classList.remove("motion-reduced");
  }

  const setCanvasSize = (): void => {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.7);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  setCanvasSize();

  // Lenis supplies physical-feeling wheel inertia on desktop. Its GSAP ticker
  // subscription wakes only for actual input/scroll, then sleeps after settling.
  if (!coarse) {
    lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.88,
      touchMultiplier: 1,
      syncTouch: false,
      anchors: true,
      smoothWheel: true,
    });

    let idleLenisFrames = 0;
    const tickLenis = (time: number): void => {
      lenis?.raf(time * 1000);
      if (lenis?.isScrolling === true) {
        idleLenisFrames = 0;
        return;
      }
      idleLenisFrames++;
      if (idleLenisFrames > 5 && lenisTicker) {
        gsap.ticker.remove(lenisTicker);
        lenisTicker = null;
        gsap.ticker.lagSmoothing(500, 33);
      }
    };

    const wakeLenis = (): void => {
      idleLenisFrames = 0;
      if (lenisTicker) return;
      lenisTicker = tickLenis;
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(lenisTicker);
    };

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      wakeLenis();
    });

    const onScrollIntent = (): void => wakeLenis();
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchstart", onScrollIntent, { passive: true });
    window.addEventListener("keydown", onScrollIntent);
    document.addEventListener("click", onScrollIntent);
    cleanups.push(() => {
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchstart", onScrollIntent);
      window.removeEventListener("keydown", onScrollIntent);
      document.removeEventListener("click", onScrollIntent);
    });
  }

  // Draw only the characters that are actually present. The source heading remains semantic.
  const heroTitle = document.querySelector<HTMLElement>(".entry h1");
  if (heroTitle) {
    const split = SplitText.create(heroTitle, {
      type: "chars,words",
      charsClass: "hero-char",
      wordsClass: "hero-word",
      aria: "auto",
    });
    splits.push(split);
    gsap.set(split.chars, { transformOrigin: "50% 100%", willChange: "transform, opacity, filter" });
    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
      .from(".site-header .signature", { y: -16, opacity: 0, duration: 0.75 }, 0)
      .from(".site-header .nav a", { y: -10, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.1)
      .from(".entry .eyebrow", { x: -18, opacity: 0, duration: 0.8 }, 0.18)
      .from(split.chars, {
        yPercent: 125,
        rotateX: -68,
        opacity: 0,
        filter: "blur(9px)",
        stagger: { each: coarse ? 0.012 : 0.022, from: "start" },
        duration: coarse ? 0.72 : 1.05,
        clearProps: "filter",
      }, 0.28)
      .from(".entry__answer, .entry__bangla, .entry__translation", {
        y: 18,
        opacity: 0,
        stagger: 0.11,
        duration: 0.8,
      }, coarse ? 0.55 : 0.8)
      .from(".entry__body, .entry__links, .entry__foot", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
      }, 1.0);
  }

  // The signal field is drawn in, then loses registration as it leaves the viewport.
  const signalPaths = gsap.utils.toArray<SVGPathElement>(".signal-field path");
  signalPaths.forEach((path) => {
    try {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    } catch {
      // Non-geometric SVG paths simply retain their static appearance.
    }
  });
  gsap.to(signalPaths, {
    strokeDashoffset: 0,
    duration: 1.9,
    stagger: 0.025,
    ease: "power2.out",
    delay: 0.35,
  });

  if (!coarse) {
    gsap.to(".entry__field", {
      yPercent: 24,
      xPercent: 4,
      rotate: 7,
      scale: 1.12,
      opacity: 0.28,
      ease: "none",
      scrollTrigger: {
        trigger: ".entry",
        start: "top top",
        end: "bottom top",
        scrub: 1.15,
      },
    });
    gsap.to(".entry__main", {
      y: -78,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: ".entry",
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    });
    gsap.to(".entry__field-label--one", {
      y: -34,
      x: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".entry",
        start: "top top",
        end: "bottom top",
        scrub: 1.4,
      },
    });
  }

  // Content transitions have different timing, rather than all sections behaving like one template.
  const progressFill = document.querySelector<HTMLElement>(".scroll-progress span");
  if (progressFill) {
    gsap.to(progressFill, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.25 },
    });
  }

  // Color follows the active region: not a theme toggle, but a moving field of light.
  const sectionGlow = gsap.quickTo(document.documentElement, "--section-glow", { duration: 0.8, ease: "power2.out" });
  const glowMap: Array<[string, string]> = [
    [".entry", "#6574FF"],
    [".project-index", "#D7FF43"],
    [".duality-stage", "#FF735C"],
    [".about", "#B9A6FF"],
    [".work", "#6574FF"],
    [".experience", "#65E5D6"],
    [".contact", "#D7FF43"],
  ];
  glowMap.forEach(([selector, color]) => {
    const section = document.querySelector<HTMLElement>(selector);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 52%",
      end: "bottom 52%",
      onEnter: () => sectionGlow(color),
      onEnterBack: () => sectionGlow(color),
    });
  });

  // The colorful project index is a real draggable rail with a little release inertia.
  const rail = document.querySelector<HTMLElement>("[data-drag-index]");
  if (rail) {
    let pointerStartX = 0;
    let scrollStart = 0;
    let lastX = 0;
    let lastAt = 0;
    let velocity = 0;
    let dragging = false;
    let dragIntent = false;
    let inertiaFrame = 0;
    let suppressClickUntil = 0;

    const stopInertia = (): void => {
      if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
      inertiaFrame = 0;
    };
    const onRailDown = (event: PointerEvent): void => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stopInertia();
      pointerStartX = event.clientX;
      scrollStart = rail.scrollLeft;
      lastX = event.clientX;
      lastAt = performance.now();
      velocity = 0;
      dragging = true;
      dragIntent = false;
    };
    const onRailMove = (event: PointerEvent): void => {
      if (!dragging) return;
      const dx = event.clientX - pointerStartX;
      if (!dragIntent && Math.abs(dx) > 6) {
        dragIntent = true;
        rail.classList.add("is-dragging");
        rail.setPointerCapture?.(event.pointerId);
      }
      if (!dragIntent) return;
      event.preventDefault();
      rail.scrollLeft = scrollStart - dx;
      const timestamp = performance.now();
      const elapsed = Math.max(timestamp - lastAt, 1);
      velocity = (lastX - event.clientX) / elapsed * 16;
      lastX = event.clientX;
      lastAt = timestamp;
    };
    const releaseInertia = (): void => {
      const step = (): void => {
        inertiaFrame = 0;
        if (Math.abs(velocity) < 0.12 || !rail) return;
        rail.scrollLeft += velocity;
        velocity *= 0.93;
        inertiaFrame = requestAnimationFrame(step);
      };
      inertiaFrame = requestAnimationFrame(step);
    };
    const onRailUp = (): void => {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      if (dragIntent) {
        suppressClickUntil = performance.now() + 260;
        releaseInertia();
      }
    };
    const onRailClick = (event: MouseEvent): void => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const onRailWheel = (event: WheelEvent): void => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        rail.scrollLeft += event.deltaX;
      }
    };
    rail.addEventListener("pointerdown", onRailDown, { passive: true });
    rail.addEventListener("pointermove", onRailMove, { passive: false });
    window.addEventListener("pointerup", onRailUp, { passive: true });
    window.addEventListener("pointercancel", onRailUp, { passive: true });
    rail.addEventListener("click", onRailClick, true);
    rail.addEventListener("wheel", onRailWheel, { passive: true });
    cleanups.push(() => {
      stopInertia();
      rail.removeEventListener("pointerdown", onRailDown);
      rail.removeEventListener("pointermove", onRailMove);
      window.removeEventListener("pointerup", onRailUp);
      window.removeEventListener("pointercancel", onRailUp);
      rail.removeEventListener("click", onRailClick, true);
      rail.removeEventListener("wheel", onRailWheel);
    });

    gsap.fromTo(".project-index__item", {
      y: 42,
      opacity: 0,
      rotate: (index: number) => (index % 2 ? 3 : -2),
    }, {
      y: 0,
      opacity: 1,
      rotate: 0,
      stagger: 0.065,
      duration: 0.9,
      ease: "back.out(1.45)",
      scrollTrigger: { trigger: ".project-index", start: "top 86%", once: true },
    });
  }

  // A Kigo-inspired before/after gesture, re-authored as Order vs Residue.
  const compareFrame = document.querySelector<HTMLElement>("[data-compare]");
  const compareSlider = document.querySelector<HTMLInputElement>("#compare-slider");
  const compareHandle = document.querySelector<HTMLElement>("[data-compare-handle]");
  if (compareFrame && compareSlider) {
    const setCompare = gsap.quickTo(compareFrame, "--compare-position", { duration: 0.12, ease: "power2.out" });
    const updateCompare = (): void => {
      const value = clamp(Number(compareSlider.value), 8, 92);
      compareFrame.style.setProperty("--compare-position", value + "%");
      compareHandle?.style.setProperty("left", value + "%");
      compareFrame.classList.add("is-comparing");
    };
    compareSlider.addEventListener("input", updateCompare);
    compareSlider.addEventListener("change", () => compareFrame.classList.remove("is-comparing"));
    compareSlider.addEventListener("pointerdown", () => compareFrame.classList.add("is-comparing"));
    compareSlider.addEventListener("pointerup", () => compareFrame.classList.remove("is-comparing"));
    compareSlider.addEventListener("keydown", () => {
      setCompare(compareSlider.value + "%");
    });
    cleanups.push(() => {
      compareSlider.removeEventListener("input", updateCompare);
    });

    gsap.fromTo(".duality-stage__intro", { x: -34, opacity: 0 }, {
      x: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".duality-stage", start: "top 78%", once: true },
    });
    gsap.fromTo(compareFrame, { y: 45, rotate: 1.2, scale: .965, opacity: 0 }, {
      y: 0, rotate: 0, scale: 1, opacity: 1,
      duration: 1.15, ease: "power3.out",
      scrollTrigger: { trigger: compareFrame, start: "top 83%", once: true },
    });
  }

  // Project illustrations reveal as cropped artwork, then settle into their own color.
  gsap.utils.toArray<HTMLElement>(".project__graphic").forEach((graphic, index) => {
    gsap.fromTo(graphic, { clipPath: "inset(0 0 100% 0)", borderRadius: "0 0 44px 0" }, {
      clipPath: "inset(0 0 0% 0)",
      borderRadius: "0 0 0 0",
      duration: 1.1,
      ease: "power4.out",
      delay: index % 2 ? .06 : 0,
      scrollTrigger: { trigger: graphic, start: "top 88%", once: true },
    });
  });

  const sideNotes = gsap.utils.toArray<HTMLElement>(".section-side");
  sideNotes.forEach((element) => {
    gsap.fromTo(element, { x: -22, opacity: 0 }, {
      x: 0,
      opacity: 1,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: element.closest(".section-split"), start: "top 82%", once: true },
    });
  });

  const headings = gsap.utils.toArray<HTMLElement>(".section-title, .contact h2");
  headings.forEach((heading) => {
    const split = SplitText.create(heading, {
      type: "words",
      wordsClass: "reveal-word",
      aria: "auto",
    });
    splits.push(split);
    gsap.from(split.words, {
      yPercent: 100,
      opacity: 0,
      rotateZ: 1.8,
      stagger: { each: coarse ? 0.055 : 0.085, from: "start" },
      duration: coarse ? 0.58 : 0.82,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 87%", once: true },
    });
  });

  const aboutParagraphs = gsap.utils.toArray<HTMLElement>(".about__copy > p, .about__numbers > div");
  aboutParagraphs.forEach((element, index) => {
    gsap.from(element, {
      y: 24 + (index % 2) * 10,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 92%", once: true },
    });
  });

  const projects = gsap.utils.toArray<HTMLElement>(".project");
  projects.forEach((project, index) => {
    const graphic = project.querySelector<HTMLElement>(".project__graphic");
    const content = project.querySelector<HTMLElement>(".project__content");
    const direction = index % 2 === 0 ? 1 : -1;

    gsap.fromTo(project, {
      opacity: 0,
      y: coarse ? 24 : 56,
      rotateZ: coarse ? 0 : direction * (index % 2 ? 0.65 : 0.4),
    }, {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      duration: coarse ? 0.75 : 1.05,
      ease: "power3.out",
      scrollTrigger: { trigger: project, start: "top 88%", once: true },
    });

    if (graphic && !coarse) {
      gsap.fromTo(graphic, { yPercent: 9, scale: 0.94 }, {
        yPercent: -7,
        scale: 1.015,
        ease: "none",
        scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: 1.25 },
      });
    }

    if (content) {
      gsap.from(content.querySelectorAll(".project__meta, h3, p, .project__links"), {
        y: 14,
        opacity: 0,
        stagger: 0.09,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: content, start: "top 88%", once: true },
        delay: coarse ? 0 : 0.08,
      });
    }
  });

  gsap.utils.toArray<HTMLElement>(".experience__item, .stack-note, .project-tail").forEach((element, index) => {
    gsap.from(element, {
      y: 26,
      opacity: 0,
      duration: 0.8,
      delay: (index % 2) * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 90%", once: true },
    });
  });

  // Cursor state: the native pointer remains visible except over artwork, where this becomes the inspection lens.
  if (cursor && !coarse) {
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.24, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.24, ease: "power3.out" });
    const onMove = (event: PointerEvent): void => {
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const onOver = (event: PointerEvent): void => {
      const graphic = event.target instanceof Element ? event.target.closest(".project__graphic") : null;
      if (graphic) document.body.classList.add("is-inspecting");
      else document.body.classList.remove("is-inspecting");
    };
    const onOut = (event: PointerEvent): void => {
      if (event.relatedTarget === null) document.body.classList.remove("is-inspecting");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.body.classList.remove("is-inspecting");
    });

    // Small magnetic pull on links. A few pixels, not the obnoxious full-button chase.
    gsap.utils.toArray<HTMLElement>(".nav a, .link-underline, .project__links a, .contact__email").forEach((link) => {
      const toX = gsap.quickTo(link, "x", { duration: 0.35, ease: "power3.out" });
      const toY = gsap.quickTo(link, "y", { duration: 0.35, ease: "power3.out" });
      const onLinkMove = (event: PointerEvent): void => {
        const rect = link.getBoundingClientRect();
        toX(clamp((event.clientX - (rect.left + rect.width / 2)) * 0.10, -7, 7));
        toY(clamp((event.clientY - (rect.top + rect.height / 2)) * 0.10, -5, 5));
      };
      const reset = (): void => { toX(0); toY(0); };
      link.addEventListener("pointermove", onLinkMove, { passive: true });
      link.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        link.removeEventListener("pointermove", onLinkMove);
        link.removeEventListener("pointerleave", reset);
      });
    });

    // Project surfaces lean toward the visitor, then lag gently back when released.
    projects.forEach((project) => {
      const toRotateX = gsap.quickTo(project, "rotationX", { duration: 0.45, ease: "power3.out" });
      const toRotateY = gsap.quickTo(project, "rotationY", { duration: 0.45, ease: "power3.out" });
      const toZ = gsap.quickTo(project, "z", { duration: 0.45, ease: "power3.out" });
      gsap.set(project, { transformPerspective: 1100 });
      const onProjectMove = (event: PointerEvent): void => {
        if (!(event.target instanceof Element) || !event.target.closest(".project__graphic")) return;
        const rect = project.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        toRotateY(nx * 4.2);
        toRotateX(-ny * 3.1);
        toZ(5);
      };
      const graphic = project.querySelector<HTMLElement>(".project__graphic");
      const artwork = graphic?.querySelector<HTMLElement>(".risk-map, .graph-art, .terminal-sheet, .newspaper-sample, .signal-watch-art");
      const artX = artwork ? gsap.quickTo(artwork, "x", { duration: 0.42, ease: "power3.out" }) : null;
      const artY = artwork ? gsap.quickTo(artwork, "y", { duration: 0.42, ease: "power3.out" }) : null;
      const onArtworkMove = (event: PointerEvent): void => {
        if (!graphic) return;
        const rect = graphic.getBoundingClientRect();
        const nx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const ny = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        graphic.style.setProperty("--inspect-x", (nx * 100).toFixed(1) + "%");
        graphic.style.setProperty("--inspect-y", (ny * 100).toFixed(1) + "%");
        artX?.((nx - 0.5) * 15);
        artY?.((ny - 0.5) * 11);
      };
      const reset = (): void => {
        toRotateX(0); toRotateY(0); toZ(0); artX?.(0); artY?.(0);
        graphic?.style.setProperty("--inspect-x", "50%");
        graphic?.style.setProperty("--inspect-y", "50%");
      };
      graphic?.addEventListener("pointermove", onArtworkMove, { passive: true });
      project.addEventListener("pointermove", onProjectMove, { passive: true });
      project.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        project.removeEventListener("pointermove", onProjectMove);
        graphic?.removeEventListener("pointermove", onArtworkMove);
        project.removeEventListener("pointerleave", reset);
        gsap.set(project, { clearProps: "transform,transformPerspective" });
      });
    });
  }

  // An on-demand residue trail: fast pointer movements shed tiny registration marks.
  if (canvas && ctx) {
    const resize = (): void => setCanvasSize();
    const spawn = (x: number, y: number, speed: number, burst = false): void => {
      if (reduced || document.hidden) return;
      const count = burst ? (coarse ? 4 : 9) : Math.min(coarse ? 2 : 5, Math.floor(speed / 0.55));
      if (!count) return;
      const colors = ["rgba(209,161,91,", "rgba(115,141,157,", "rgba(233,226,214,"];
      for (let index = 0; index < count; index++) {
        const angle = Math.random() * Math.PI * 2;
        const kick = (burst ? 1.1 : 0.35) + Math.random() * (burst ? 3.3 : 1.5);
        const life = (coarse ? 240 : 430) + Math.random() * (coarse ? 150 : 450);
        fragments.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * kick - (speed > 1 ? (previousPointer.x - x) * 0.012 : 0),
          vy: Math.sin(angle) * kick - (speed > 1 ? (previousPointer.y - y) * 0.012 : 0),
          life,
          maxLife: life,
          length: 3 + Math.random() * (burst ? 20 : 12),
          angle: angle + Math.random() * 0.5,
          spin: (Math.random() - 0.5) * 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
          width: 0.5 + Math.random() * 1.25,
        });
      }
      if (fragments.length > 130) fragments.splice(0, fragments.length - 130);
      if (!canvasFrame) canvasFrame = requestAnimationFrame(drawFragments);
    };

    let lastFrameAt = performance.now();
    const drawFragments = (timestamp: number): void => {
      canvasFrame = 0;
      if (disposed || !ctx || !canvas || document.hidden) return;
      const dt = clamp((timestamp - lastFrameAt) / 16.667, 0.25, 2.5);
      lastFrameAt = timestamp;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "screen";
      for (let index = fragments.length - 1; index >= 0; index--) {
        const fragment = fragments[index];
        fragment.life -= 16.667 * dt;
        if (fragment.life <= 0) {
          fragments.splice(index, 1);
          continue;
        }
        fragment.x += fragment.vx * dt;
        fragment.y += fragment.vy * dt;
        fragment.vx *= Math.pow(0.965, dt);
        fragment.vy *= Math.pow(0.965, dt);
        fragment.angle += fragment.spin * dt;
        const alpha = clamp(fragment.life / fragment.maxLife) * 0.42;
        const dx = Math.cos(fragment.angle) * fragment.length;
        const dy = Math.sin(fragment.angle) * fragment.length;
        ctx.strokeStyle = fragment.color + alpha.toFixed(3) + ")";
        ctx.lineWidth = fragment.width;
        ctx.beginPath();
        ctx.moveTo(fragment.x - dx * 0.5, fragment.y - dy * 0.5);
        ctx.lineTo(fragment.x + dx * 0.5, fragment.y + dy * 0.5);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      if (fragments.length) canvasFrame = requestAnimationFrame(drawFragments);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onPointerTrail = (event: PointerEvent): void => {
      const timestamp = performance.now();
      const elapsed = Math.max(timestamp - previousPointer.at, 1);
      const dx = event.clientX - previousPointer.x;
      const dy = event.clientY - previousPointer.y;
      const speed = Math.hypot(dx, dy) / elapsed;
      if (timestamp - lastTrailAt > (coarse ? 72 : 24) && speed > (coarse ? 1.2 : 0.35)) {
        spawn(event.clientX, event.clientY, speed);
        lastTrailAt = timestamp;
      }
      previousPointer = { x: event.clientX, y: event.clientY, at: timestamp };
    };
    const onClickTrail = (event: PointerEvent): void => spawn(event.clientX, event.clientY, 1.4, true);
    const onVisibility = (): void => {
      if (!document.hidden) return;
      fragments.length = 0;
      if (canvasFrame) cancelAnimationFrame(canvasFrame);
      canvasFrame = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    window.addEventListener("pointermove", onPointerTrail, { passive: true });
    window.addEventListener("pointerdown", onClickTrail, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onPointerTrail);
      window.removeEventListener("pointerdown", onClickTrail);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (canvasFrame) cancelAnimationFrame(canvasFrame);
      fragments.length = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    });
  }

  // Refresh after web fonts settle so ScrollTrigger and the split text agree on line breaks.
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
  }
  const refreshTimer = window.setTimeout(() => { if (!disposed) ScrollTrigger.refresh(); }, 600);
  cleanups.push(() => window.clearTimeout(refreshTimer));

  const onPageHide = (): void => dispose();
  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    for (const cleanup of cleanups.splice(0)) cleanup();
    if (lenisTicker) gsap.ticker.remove(lenisTicker);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    splits.forEach(split => split.revert());
    gsap.killTweensOf("*");
  };
  window.addEventListener("pagehide", onPageHide, { once: true });
  cleanups.push(() => window.removeEventListener("pagehide", onPageHide));

  return dispose;
}