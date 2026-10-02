"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, type JSAnimation } from "animejs";
import type { CodeProject } from "@/data/portfolio";
import { ActionLink, Section, SectionHeading } from "./ui";

export function CodeArchive({ projects, githubUrl }: { projects: CodeProject[]; githubUrl: string }) {
  const collection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = collection.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations: JSAnimation[] = [];
    // Content is visible by default; animation is an optional, one-time enhancement.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || entry.target.contains(document.activeElement)) continue;
        const title = entry.target.querySelector<HTMLElement>(".tech-title-text");
        if (title) animations.push(animate(title, { y: [14, 0], opacity: [.35, 1], duration: 900, ease: "outCubic" }));
      }
    }, { threshold: .2 });
    root.querySelectorAll(".tech-copy").forEach(element => observer.observe(element));
    const settle = () => { animations.forEach(animation => animation.revert()); animations.length = 0; };
    const onPreference = () => { if (preference.matches) settle(); };
    root.addEventListener("focusin", settle);
    preference.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      settle();
      root.removeEventListener("focusin", settle);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return <Section id="code" labelledBy="code-heading" className="technology-section">
    <SectionHeading index="02" eyebrow="Creative technology archive" title={<>Things <em>I build.</em></>} id="code-heading"><p>Ideas, made tangible.<br />Interfaces to explore. Systems to make sense of things.</p><a href="#lab" className="quiet-link">Continue to the lab ↓</a></SectionHeading>
    <div className="technology-intro"><span>Selected development / 03 projects</span><span>From concept to interface</span></div>
    <div className="technology-collection" ref={collection}>{projects.map((project, index) => <article className={`tech-project tech-project--${index + 1}`} key={project.slug} aria-labelledby={`code-${project.slug}`}>
      <div className="tech-copy"><div className="tech-index"><span>0{index + 1}</span><span>{project.category}</span></div><h3 id={`code-${project.slug}`}><span className="tech-title-text">{project.title}</span></h3><p className="tech-description">{project.description}</p>
        <div className="tech-metadata"><p className="eyebrow">{project.technologyScope ?? "Built with"}</p><ul aria-label={`${project.title} technologies`}>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
        <div className="tech-links"><ActionLink href={project.url} external aria-label={`Explore ${project.title} live (opens in a new tab)`}>Live project</ActionLink><ActionLink href={project.repositoryUrl ?? githubUrl} external aria-label={project.repositoryUrl ? `${project.title} source on GitHub (opens in a new tab)` : "Fayaz’s GitHub profile (opens in a new tab)"}>{project.repositoryUrl ? "GitHub source" : "GitHub profile"}</ActionLink></div>
      </div>
      <figure className="tech-figure"><a className="tech-visual" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.title} interface (opens in a new tab)`}><div className="tech-image"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1567px) 52vw, 820px" /></div><span className="tech-explore" aria-hidden="true">Explore project ↗</span></a><figcaption><span>{project.visualCaption}</span><span>Interface capture</span></figcaption></figure>
    </article>)}</div>
    <div className="technology-footer"><p>More ideas. More iterations.</p><ActionLink href={githubUrl} external>Explore my GitHub</ActionLink></div>
  </Section>;
}
