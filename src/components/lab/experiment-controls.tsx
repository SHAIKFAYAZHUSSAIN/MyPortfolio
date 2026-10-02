"use client";

import { useEffect, useId, useRef, useState } from "react";

export function RangeControl({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  const id = useId();
  return <label className="experiment-range" htmlFor={id}><span>{label}<output htmlFor={id}>{value}</output></span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}

// Shared lifecycle: an open experiment still sleeps when its stage or tab is hidden.
export function useExperimentActivity() {
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateMotion(); updateVisibility();
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (stage.current) observer.observe(stage.current);
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  return { stage, active: visible && tabVisible, reducedMotion };
}

export function useStageSize(stage: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const target = stage.current;
    if (!target) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, Math.min(900, Math.round(entry.contentRect.width)))));
    observer.observe(target);
    return () => observer.disconnect();
  }, [stage]);
  return width;
}
