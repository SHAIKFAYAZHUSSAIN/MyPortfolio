"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Film } from "@/data/portfolio";
import { bindDrift } from "@/lib/motion";
import { MotionText } from "./motion-text";
import { ActionLink, MediaFrame, Section, SectionHeading } from "./ui";

function FilmFrame({ film, index }: { film: Film; index: number }) {
  const frame = useRef<HTMLAnchorElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (frame.current && layer.current) return bindDrift(frame.current, layer.current, 5);
  }, []);

  return <article className={`archive-film archive-film--${index + 1}`} data-title={film.title} aria-labelledby={`film-${film.slug}`}>
    <div className="archive-slate"><span>Shot / 0{index + 1}</span><span>{film.year} <span aria-hidden="true">—</span> Short film</span></div>
    <a ref={frame} data-cursor="WATCH" className="archive-screen" href={film.watchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${film.title} on YouTube (opens in a new tab)`}>
      <Image className="archive-atmosphere" src={film.image} alt="" fill sizes="100vw" />
      <div ref={layer} className="archive-parallax"><div className="shot-drift"><div className="archive-scale"><MediaFrame src={film.image} alt={film.imageAlt} sizes="(max-width: 639px) calc(100vw - 72px), (max-width: 1440px) 88vw, 1280px" /></div></div></div>
      <div className="archive-poster-type" aria-hidden="true"><span>A film by Fayaz Shaik</span><strong><MotionText>{film.title}</MotionText></strong><span>Written & directed / {film.year}</span></div>
      <span className="archive-play" aria-hidden="true">Play film <span>↗</span></span>
    </a>
    <div className="archive-caption"><div className="archive-title"><p className="metadata">{film.role}</p><h3 id={`film-${film.slug}`}><Link href={`/films/${film.slug}`}><MotionText>{film.title}</MotionText></Link></h3></div><div className="archive-actions"><Link className="action" href={`/films/${film.slug}`} aria-label={`Explore ${film.title}`}>Explore film <span aria-hidden="true">↗</span></Link><ActionLink data-cursor="WATCH" href={film.watchUrl} external aria-label={`Watch ${film.title} on YouTube (opens in a new tab)`}>Watch</ActionLink></div></div>
    <div className="archive-extra"><p>{film.description}</p><span className="archive-recognition">{film.recognition}</span></div>
    {index < 2 && <div className="shot-cut" aria-hidden="true"><span />Cut / 0{index + 2}<span /></div>}
  </article>;
}

export function FilmArchive({ films }: { films: Film[] }) {
  const reel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = reel.current;
    if (!root) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      import("@/lib/film-sequence").then(module => {
        if (!disposed) cleanup = module.installFilmSequence(root);
      }).catch(() => { /* The complete static archive remains usable. */ });
    }, { rootMargin: "500px" });
    observer.observe(root);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); };
  }, []);

  return <Section id="work" labelledBy="films-heading" className="archive-section"><SectionHeading index="01" eyebrow="The film archive / 2025" title="Films." id="films-heading"><p>Three films. One voice.<br />Written and directed by Fayaz Shaik.</p><a className="quiet-link" href="#code">Continue to code ↓</a></SectionHeading><div ref={reel} className="film-reel"><div className="shot-track" aria-hidden="true"><span>Shot <b className="shot-current">01</b> / 03</span><span className="shot-name">{films[0]?.title}</span><span className="shot-progress"><span /></span><span>Written & directed / Fayaz Shaik</span></div><div className="archive-collection">{films.map((film, index) => <FilmFrame film={film} index={index} key={film.slug} />)}</div><div className="archive-end"><div className="medium-cut" aria-hidden="true"><span className="cut-grid" /><span className="cut-from">Film</span><span className="cut-line" /><span className="cut-word">Cut to <em>code.</em></span><span className="cut-caption">A different medium. The same curiosity.</span></div><span>End of collection / 03 films</span><a className="action" href="#code">Next: built in code <span aria-hidden="true">↓</span></a></div></div></Section>;
}