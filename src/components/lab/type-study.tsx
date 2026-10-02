"use client";

import { useRef, useState } from "react";
import { RangeControl, useStageSize } from "./experiment-controls";

export default function TypeStudy() {
  const stage = useRef<HTMLDivElement>(null);
  const width = useStageSize(stage);
  const [text, setText] = useState("WHAT IF");
  const [bend, setBend] = useState(26);
  const [spacing, setSpacing] = useState(3);
  const letters = Array.from(text || " ");
  return <><div ref={stage} className="experiment-stage type-stage" role="img" aria-label={`Typography study: ${text || "empty"}, curve ${bend}, spacing ${spacing}`}><div className="type-baseline" aria-hidden="true" /><div className="type-sculpture" style={{ fontSize: Math.min(110, (width - 36) / (letters.length * .8 + Math.max(0, letters.length - 1) * spacing * .05)), gap: `${spacing * .05}em` }} aria-hidden="true">{letters.map((letter, index) => <span key={index} style={{ transform: `translateY(${-Math.sin((index / Math.max(1, letters.length - 1)) * Math.PI) * bend}px)` }}>{letter === " " ? "\u00a0" : letter}</span>)}</div><span className="stage-caption">Language, with a different shape.</span></div><div className="experiment-controls"><label className="experiment-text">Your phrase<input maxLength={18} value={text} onChange={event => setText(Array.from(event.target.value).slice(0, 18).join(""))} /></label><RangeControl label="Curve" value={bend} min={-50} max={70} onChange={setBend} /><RangeControl label="Spacing" value={spacing} min={0} max={10} onChange={setSpacing} /><button className="lab-button" onClick={() => { setText("WHAT IF"); setBend(26); setSpacing(3); }}>Reset study</button></div><p className="experiment-note">Type up to 18 characters. Use the sliders or arrow keys to reshape the baseline.</p></>;
}

