"use client";

import { useEffect, useRef, useState } from "react";
import { RangeControl, useExperimentActivity, useStageSize } from "./experiment-controls";

export default function SignalSlice() {
  const { stage, active, reducedMotion } = useExperimentActivity();
  const width = useStageSize(stage);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [strength, setStrength] = useState(20);
  const [position, setPosition] = useState(50);
  const [follow, setFollow] = useState(false);
  useEffect(() => {
    const portrait = new window.Image();
    portrait.onload = () => setImage(portrait);
    portrait.onerror = () => setFailed(true);
    portrait.src = "/images/fayaz.png";
    return () => { portrait.onload = null; portrait.onerror = null; };
  }, []);
  useEffect(() => { if (reducedMotion) setFollow(false); }, [reducedMotion]);
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx || !image || !active) return;
    const height = Math.round(width * .58);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#0b0d0f"; ctx.fillRect(0, 0, width, height);
    const imageHeight = height; const imageWidth = imageHeight * image.naturalWidth / image.naturalHeight;
    const startX = (width - imageWidth) / 2;
    for (let slice = 0; slice < 80; slice++) {
      const t = slice / 80;
      const offset = Math.sin(t * 32 + position * .075) * Math.sin(t * Math.PI) * strength * width / 600;
      ctx.drawImage(image, 0, t * image.naturalHeight, image.naturalWidth, image.naturalHeight / 80, startX + offset, t * height, imageWidth, height / 80 + 1);
    }
  }, [image, width, active, strength, position]);
  return <><div ref={stage} className="experiment-stage slice-stage" onPointerMove={event => { if (!follow || reducedMotion || event.pointerType !== "mouse") return; const bounds = event.currentTarget.getBoundingClientRect(); setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)))); }}><canvas ref={canvas} role="img" aria-label={`Fayaz's portrait distorted into horizontal strips, displacement ${strength}, phase ${position}`} />{!image && <p className="canvas-message" role="status">{failed ? "The portrait could not load. Close and reopen to retry." : "Loading portrait…"}</p>}<span className="stage-caption">Portrait / Reassembled</span></div><div className="experiment-controls"><RangeControl label="Displacement" value={strength} min={0} max={60} onChange={setStrength} /><RangeControl label="Phase" value={position} min={0} max={100} onChange={setPosition} /><div className="experiment-buttons"><button className="lab-button" onClick={() => { setStrength(0); setPosition(50); setFollow(false); }}>Restore portrait</button><button className="lab-button" disabled={reducedMotion} aria-pressed={follow} onClick={() => setFollow(value => !value)}>{follow ? "Pointer follows: on" : "Pointer follows: off"}</button></div></div><p className="experiment-note">Adjust the sliders on any device. Optional pointer control responds to mouse movement. No camera, upload or external processing.</p></>;
}
