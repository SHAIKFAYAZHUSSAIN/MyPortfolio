/** One motion vocabulary. Anime uses milliseconds; scroll choreography uses seconds. */
export const motion = {
  duration: { micro: 240, reveal: 820, calm: 1100, opening: 3200 },
  ease: { reveal: "outQuart", settle: "outCubic", calm: "outSine" },
  query: {
    reduce: "(prefers-reduced-motion: reduce)",
    pointer: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    cinema: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  },
} as const;

/** Event-driven camera response. RAF stops when settled, offscreen or hidden. */
export function bindDrift(surface: HTMLElement, layer: HTMLElement, travel = 12) {
  const query = matchMedia(motion.query.pointer);
  let raf = 0, x = 0, y = 0, targetX = 0, targetY = 0;
  const reset = () => {
    cancelAnimationFrame(raf); raf = 0;
    x = y = targetX = targetY = 0;
    layer.style.removeProperty("translate");
  };
  const tick = () => {
    x += (targetX - x) * .095;
    y += (targetY - y) * .095;
    layer.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .06) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  const move = (event: PointerEvent) => {
    if (!query.matches || event.pointerType !== "mouse" || document.hidden) return;
    const rect = surface.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * travel * 2;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * travel;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const leave = () => { targetX = targetY = 0; if (!raf && query.matches) raf = requestAnimationFrame(tick); };
  const visibility = () => { if (document.hidden) reset(); };
  const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) reset(); });
  observer.observe(surface);
  surface.addEventListener("pointermove", move);
  surface.addEventListener("pointerleave", leave);
  surface.addEventListener("focusin", reset);
  query.addEventListener("change", reset);
  document.addEventListener("visibilitychange", visibility);
  return () => {
    reset(); observer.disconnect();
    surface.removeEventListener("pointermove", move);
    surface.removeEventListener("pointerleave", leave);
    surface.removeEventListener("focusin", reset);
    query.removeEventListener("change", reset);
    document.removeEventListener("visibilitychange", visibility);
  };
}
