"use client";

import Image from "next/image";
import { MotionText } from "./motion-text";

import type { CodeProject } from "@/data/portfolio";
import { ActionLink, Section, SectionHeading } from "./ui";

export function CodeArchive({ projects, githubUrl }: { projects: CodeProject[]; githubUrl: string }) {
  return <Section id="code" labelledBy="code-heading" className="technology-section">
    <SectionHeading index="02" eyebrow="Creative technology archive" title={<>Things <em>I build.</em></>} id="code-heading"><p>Ideas, made tangible.<br />Interfaces to explore. Systems to make sense of things.</p><a href="#lab" className="quiet-link">Continue to the lab ↓</a></SectionHeading>
    <div className="technology-intro"><span>Selected development / 03 projects</span><span>From concept to interface</span></div>
    <div className="technology-collection">{projects.map((project, index) => <article className={`tech-project tech-project--${index + 1}`} key={project.slug} aria-labelledby={`code-${project.slug}`}>
      <div className="tech-copy"><div className="tech-index"><span>0{index + 1}</span><span>{project.category}</span></div><h3 id={`code-${project.slug}`}><MotionText>{project.title}</MotionText></h3><p className="tech-description">{project.description}</p>
        <div className="tech-metadata"><p className="eyebrow">{project.technologyScope ?? "Built with"}</p><ul aria-label={`${project.title} technologies`}>{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
        <div className="tech-links"><ActionLink data-cursor="EXPLORE" href={project.url} external aria-label={`Explore ${project.title} live (opens in a new tab)`}>Live project</ActionLink><ActionLink data-cursor="EXPLORE" href={project.repositoryUrl ?? githubUrl} external aria-label={project.repositoryUrl ? `${project.title} source on GitHub (opens in a new tab)` : "Fayaz’s GitHub profile (opens in a new tab)"}>{project.repositoryUrl ? "GitHub source" : "GitHub profile"}</ActionLink></div>
      </div>
      <figure className="tech-figure"><a data-cursor="EXPLORE" className="tech-visual" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.title} interface (opens in a new tab)`}><div className="tech-image"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1567px) 52vw, 820px" /></div><span className="tech-explore" aria-hidden="true">Explore project ↗</span></a><figcaption><span>{project.visualCaption}</span><span>Interface capture</span></figcaption></figure>
    </article>)}</div>
    <div className="technology-footer"><p>More ideas. More iterations.</p><ActionLink href={githubUrl} external>Explore my GitHub</ActionLink></div>
  </Section>;
}
