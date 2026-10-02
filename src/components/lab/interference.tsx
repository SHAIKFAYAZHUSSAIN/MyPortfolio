"use client";

import { useEffect, useRef, useState } from "react";
import { RangeControl, useExperimentActivity, useStageSize } from "./experiment-controls";

export default function Interference() {
  const { stage, active, reducedMotion } = useExperimentActivity();
  const width = useStageSize(stage);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState(32);
  const [amplitude, setAmplitude] = useState(35);
  const [seed, setSeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const phase = useRef(0);
  useEffect(() => { if (reducedMotion) setPlaying(false); }, [reducedMotion]);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context || !active) return;
    const height = Math.round(width * .58);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    let raf = 0;
    let last = 0;
    const draw = () => {
      context.fillStyle = "#0b1012"; context.fillRect(0, 0, width, height);
      context.lineWidth = .8;
      for (let row = 0; row < density; row++) {
        context.beginPath();
        context.strokeStyle = row % 5 === 0 ? "#d3d8ad" : "#637d80";
        for (let x = 0; x <= width; x += 5) {
          const nx = x / width;
          const envelope = Math.sin(nx * Math.PI);
          const wave = Math.sin(nx * 10 + row * .16 + seed * .7 + phase.current) + Math.cos(nx * 6 - row * .13 - phase.current * .6);
          const y = height * .15 + (row / (density - 1)) * height * .7 + wave * amplitude * .55 * envelope;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      }
    };
    const tick = (time: number) => {
      if (time - last >= 1000 / 30) { phase.current += Math.min(time - (last || time), 50) * .0003; last = time; draw(); }
      raf = requestAnimationFrame(tick);
    };
    draw();
    if (playing && !reducedMotion) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, density, amplitude, seed, playing, active, reducedMotion]);
  const save = () => { if (!canvas.current) return; const link = document.createElement("a"); link.download = `fayaz-line-study-${seed}.png`; link.href = canvas.current.toDataURL("image/png"); link.click(); };
  return <><div ref={stage} className="experiment-stage field-stage"><canvas ref={canvas} role="img" aria-label={`Generative interference pattern with ${density} lines, amplitude ${amplitude}, variation ${seed}`} /><span className="stage-caption">Variation {String(seed).padStart(2, "0")} / {playing && active && !reducedMotion ? "In motion" : "Still frame"}</span></div><div className="experiment-controls"><RangeControl label="Lines" value={density} min={16} max={56} onChange={setDensity} /><RangeControl label="Amplitude" value={amplitude} min={0} max={60} onChange={setAmplitude} /><div className="experiment-buttons"><button className="lab-button" onClick={() => setSeed(value => value + 1)}>New variation</button><button className="lab-button" disabled={reducedMotion} aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "Pause motion" : "Play motion"}</button><button className="lab-button" onClick={save}>Save frame ↓</button></div></div><p className="experiment-note">{reducedMotion ? "Reduced motion is on. Explore still variations with the sliders." : "Motion starts only when you choose Play, and pauses when the experiment is out of view."}</p></>;
}
