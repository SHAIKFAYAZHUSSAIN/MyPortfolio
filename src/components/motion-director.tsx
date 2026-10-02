"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, createTimeline, stagger, type JSAnimation } from "animejs";
import { bindDrift, motion } from "@/lib/motion";

export function MotionDirector() {
  const cursor = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    const preference = matchMedia(motion.query.reduce);
    const active = new Set<{ revert: () => unknown }>();
    const seen = new WeakSet<Element>();
    const reveal = (element: HTMLElement) => {
      if (seen.has(element)) return;
      seen.add(element);
      if (preference.matches || element.contains(document.activeElement)) return;
      const words = element.querySelectorAll<HTMLElement>(".motion-word");
      const duration = element.hasAttribute("data-motion-calm") ? motion.duration.calm : motion.duration.reveal;
      const animation = animate(words, {
        y: ["106%", "0%"], opacity: [.35, 1], duration,
        delay: stagger(55), ease: motion.ease.reveal,
        onComplete: () => { animation.revert(); active.delete(animation); },
      });
      active.add(animation);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { observer.unobserve(entry.target); reveal(entry.target as HTMLElement); } });
    }, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll<HTMLElement>(".motion-text").forEach(element => observer.observe(element));

    // Images and metadata have their own low-amplitude entrance; prose stays static.
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        imageObserver.unobserve(entry.target);
        if (preference.matches || entry.target.contains(document.activeElement)) return;
        const image = entry.target.querySelector(".tech-image");
        const metadata = entry.target.querySelector(".tech-index");
        const timeline = createTimeline({ onComplete: () => { timeline.revert(); active.delete(timeline); } });
        if (image) timeline.add(image, { clipPath: ["inset(8% 0 90% 0)", "inset(0% 0 0% 0)"], opacity: [.4,1], duration: motion.duration.reveal, ease: motion.ease.reveal }, 0);
        if (metadata) timeline.add(metadata, { y: [8,0], opacity: [.3,1], duration: motion.duration.reveal, ease: motion.ease.settle }, 180);
        active.add(timeline);
      });
    }, { threshold: .12 });
    root.querySelectorAll(".tech-project").forEach(element => imageObserver.observe(element));
    const drifts: (() => void)[] = [];
    root.querySelectorAll<HTMLElement>(".experiment-launch").forEach(surface => {
      const layer = surface.querySelector<HTMLElement>(".lab-poster > div, .lab-poster svg, .lab-poster > img");
      if (layer) drifts.push(bindDrift(surface, layer, 5));
    });
    const settle = () => { active.forEach(animation => animation.revert()); active.clear(); };
    const onPreference = () => { if (preference.matches) settle(); };
    root.addEventListener("focusin", settle);
    preference.addEventListener("change", onPreference);
    return () => { observer.disconnect(); imageObserver.disconnect(); settle(); drifts.forEach(cleanup => cleanup()); root.removeEventListener("focusin", settle); preference.removeEventListener("change", onPreference); };
  }, [pathname]);

  useEffect(() => {
    const element = cursor.current;
    if (!element) return;
    const ring = element.querySelector<HTMLElement>(".cursor-ring")!;
    const label = element.querySelector<HTMLElement>(".cursor-label")!;
    const preference = matchMedia(motion.query.pointer);
    let animation: JSAnimation | undefined;
    let frame = 0, px = 0, py = 0, currentState = "";
    const hide = () => { element.dataset.visible = "false"; document.documentElement.classList.remove("cinematic-cursor"); cancelAnimationFrame(frame); frame = 0; };
    const change = (state: string) => {
      if (state === currentState) return;
      currentState = state; label.textContent = state ? `${state} →` : "";
      animation?.cancel();
      animation = animate(ring, { width: state ? 86 : 12, height: state ? 34 : 12, borderRadius: state ? "18px" : "6px", duration: motion.duration.micro, ease: motion.ease.settle });
      element.dataset.state = state ? "action" : "default";
    };
    const updateFrame = () => {
      frame = 0;
      const target = document.elementFromPoint(px, py);
      if (!target || target.closest("dialog,input,textarea,select,[contenteditable]")) { hide(); return; }
      element.style.transform = `translate3d(${px}px,${py}px,0)`;
      change(target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "");
    };
    const move = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!preference.matches || event.pointerType !== "mouse" || target.closest("dialog,input,textarea,select,[contenteditable]")) { hide(); return; }
      px = event.clientX; py = event.clientY;
      document.documentElement.classList.add("cinematic-cursor");
      element.dataset.visible = "true";
      if (!frame) frame = requestAnimationFrame(updateFrame);
    };
    // Content can move underneath a stationary pointer while scrolling.
    const scroll = () => { if (element.dataset.visible === "true" && preference.matches && !frame) frame = requestAnimationFrame(updateFrame); };
    const key = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", key);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", hide);
    return () => { hide(); animation?.revert(); document.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", hide); document.removeEventListener("keydown", key); window.removeEventListener("blur", hide); window.removeEventListener("scroll", scroll, true); document.removeEventListener("visibilitychange", visibility); preference.removeEventListener("change", hide); };
  }, [pathname]);

  return <div ref={cursor} className="cinema-cursor" data-visible="false" aria-hidden="true"><span className="cursor-ring"><span className="cursor-label" /></span></div>;
}
