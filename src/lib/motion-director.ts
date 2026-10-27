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

  // Lenis supplies physical-feeling wheel inertia on desktop. Touch keeps native scroll.
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
    lenis.on("scroll", ScrollTrigger.update);
    lenisTicker = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);
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
      const reset = (): void => { toRotateX(0); toRotateY(0); toZ(0); };
      project.addEventListener("pointermove", onProjectMove, { passive: true });
      project.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        project.removeEventListener("pointermove", onProjectMove);
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