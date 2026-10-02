"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { experiments, type Experiment } from "@/data/portfolio";
import { Section } from "../ui";

const loading = () => <p className="experiment-loading" role="status">Opening the experiment…</p>;
const registry: Record<Experiment["engine"], ComponentType> = {
  "type-study": dynamic(() => import("./type-study"), { loading }),
  interference: dynamic(() => import("./interference"), { loading }),
  "signal-slice": dynamic(() => import("./signal-slice"), { loading }),
};

function ExperimentPreview({ engine }: { engine: Experiment["engine"] }) {
  if (engine === "type-study") return <div className="lab-poster lab-poster--type" aria-hidden="true"><span className="poster-coordinate">Aa / 01</span><div><span>WHAT</span><span>IF<span className="poster-question">?</span></span></div><span className="poster-footer">Letters with room to move.</span></div>;
  if (engine === "interference") return <div className="lab-poster lab-poster--field" aria-hidden="true"><span className="poster-coordinate">Wave / 02</span><svg viewBox="0 0 400 300" fill="none">{Array.from({ length: 27 }, (_, i) => <path key={i} d={`M -10 ${35+i*9} C 100 ${-45+i*7}, 140 ${335-i*4}, 240 ${140+i*2} S 330 ${15+i*10}, 410 ${65+i*7}`} stroke={i % 5 === 0 ? "#d3d8ad" : "#637d80"} strokeWidth="1" />)}</svg><span className="poster-footer">Order, slightly interrupted.</span></div>;
  return <div className="lab-poster lab-poster--slice" aria-hidden="true"><Image src="/images/fayaz.png" alt="" fill sizes="(max-width: 639px) 100vw, 33vw" /><span className="poster-coordinate">Signal / 03</span><span className="slice-band slice-band--one" /><span className="slice-band slice-band--two" /><span className="poster-footer">A familiar face. Another frequency.</span></div>;
}

function ExperimentDialog({ experiment, onClose }: { experiment: Experiment; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const Demo = registry[experiment.engine];
  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    modal.showModal(); close.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; modal.close(); };
  }, []);
  return <dialog ref={dialog} className="experiment-dialog" aria-labelledby="experiment-title" aria-describedby="experiment-description" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}><div className="experiment-dialog-head"><span className="eyebrow">The lab / {experiment.category}</span><button ref={close} className="lab-button" onClick={onClose} aria-label="Close experiment">Close ×</button></div><h2 id="experiment-title">{experiment.title}</h2><p id="experiment-description" className="experiment-description">{experiment.description}</p><Demo /></dialog>;
}

export function LabSection() {
  const [selected, setSelected] = useState<Experiment | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const close = () => { setSelected(null); requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true })); };
  return <><Section id="lab" labelledBy="lab-heading" className="playground-section"><div className="playground-heading"><div><p className="eyebrow"><span className="index">03</span>The lab <span className="lab-stamp">Open to possibility</span></p><h2 id="lab-heading">The <em>Lab.</em></h2></div><div className="playground-intro"><p>I build things because<br />I want to see what happens.</p><span>Small studies in type, image and motion.<br />Open one. Change something.</span></div></div><div className="lab-shelf">{experiments.map((experiment, index) => <article className="experiment-card" key={experiment.slug}><button className="experiment-launch" aria-haspopup="dialog" aria-label={`Open ${experiment.title} experiment`} onClick={event => { trigger.current = event.currentTarget; setSelected(experiment); }}><ExperimentPreview engine={experiment.engine} /><span className="experiment-open">Open experiment <span aria-hidden="true">↗</span></span></button><div className="experiment-card-meta"><span>Study / 0{index + 1}</span><span>{experiment.category}</span></div><h3>{experiment.title}</h3><p>{experiment.description}</p></article>)}</div><div className="lab-colophon"><span>Always a work in progress.</span><span>Three studies. No right answers.</span></div></Section>{selected && <ExperimentDialog experiment={selected} onClose={close} />}</>;
}
