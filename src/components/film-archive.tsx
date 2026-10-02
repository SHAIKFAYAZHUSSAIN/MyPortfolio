"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, type JSAnimation } from "animejs";
import type { Film } from "@/data/portfolio";
import { ActionLink, MediaFrame, Section, SectionHeading } from "./ui";

function FilmFrame({ film, index }: { film: Film; index: number }) {
  const frame = useRef<HTMLAnchorElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = frame.current;
    const image = layer.current;
    if (!surface || !image) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let animation: JSAnimation | undefined;
    let raf = 0;
    const reset = () => {
      cancelAnimationFrame(raf);
      animation?.revert();
      image.style.removeProperty("transform");
    };
    const move = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 4;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        animation?.cancel();
        animation = animate(image, { x, y, duration: 550, ease: "outCubic" });
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      animation?.cancel();
      if (!motion.matches) { reset(); return; }
      animation = animate(image, { x: 0, y: 0, duration: 650, ease: "outCubic" });
    };
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    motion.addEventListener("change", reset);
    return () => {
      reset();
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", reset);
    };
  }, []);

  return <article className={`archive-film archive-film--${index + 1}`} aria-labelledby={`film-${film.slug}`}>
    <div className="archive-slate"><span>Film / 0{index + 1}</span><span>{film.year} <span aria-hidden="true">—</span> Short film</span></div>
    <a ref={frame} className="archive-screen" href={film.watchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${film.title} on YouTube (opens in a new tab)`}>
      <div ref={layer} className="archive-parallax"><div className="archive-scale"><MediaFrame src={film.image} alt={film.imageAlt} /></div></div>
      <span className="archive-play" aria-hidden="true">Play film <span>↗</span></span>
    </a>
    <div className="archive-caption"><div className="archive-title"><p className="metadata">{film.role}</p><h3 id={`film-${film.slug}`}><Link href={`/films/${film.slug}`}>{film.title}</Link></h3></div><div className="archive-actions"><Link className="action" href={`/films/${film.slug}`} aria-label={`Explore ${film.title}`}>Explore film <span aria-hidden="true">↗</span></Link><ActionLink href={film.watchUrl} external aria-label={`Watch ${film.title} on YouTube (opens in a new tab)`}>Watch</ActionLink></div></div>
    <div className="archive-extra"><p>{film.description}</p><span className="archive-recognition">{film.recognition}</span></div>
  </article>;
}

export function FilmArchive({ films }: { films: Film[] }) {
  return <Section id="work" labelledBy="films-heading" className="archive-section"><SectionHeading index="01" eyebrow="The film archive" title="Three films. One voice." id="films-heading"><p>A collection of short films.<br />Written and directed by Fayaz Shaik.</p><a className="quiet-link" href="#code">Continue to code ↓</a></SectionHeading><div className="archive-collection">{films.map((film, index) => <FilmFrame film={film} index={index} key={film.slug} />)}</div><div className="archive-end"><span>End of collection / 03 films</span><a className="action" href="#code">Next: built in code <span aria-hidden="true">↓</span></a></div></Section>;
}
