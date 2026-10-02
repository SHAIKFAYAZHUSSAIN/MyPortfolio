import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { films } from "@/data/portfolio";
import { ActionLink, Container, MediaFrame } from "@/components/ui";
import { FilmPlayer } from "@/components/film-player";

type FilmPageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return films.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const film = films.find(film => film.slug === slug);
  if (!film) notFound();
  return { title: `${film.title} (${film.year}) — Fayaz Shaik`, description: film.description };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { slug } = await params;
  const index = films.findIndex(film => film.slug === slug);
  if (index === -1) notFound();
  const film = films[index];
  const next = films[(index + 1) % films.length];

  return <main id="main" className="film-detail"><Container>
    <div className="film-detail-top"><Link className="action" href="/#work">← Back to films</Link><span className="metadata">Film / 0{index + 1}</span></div>
    <header className="film-detail-heading"><p className="eyebrow">{film.year} <span aria-hidden="true">/</span> A film by Fayaz Shaik</p><h1>{film.title}</h1><div className="film-detail-meta"><span>{film.role}</span><span>{film.recognition}</span></div></header>
    <MediaFrame src={film.image} alt={film.imageAlt} priority />
    <div className="film-detail-story"><section aria-labelledby="description-heading"><p className="eyebrow">The film</p><h2 id="description-heading">{film.title}, {film.year}.</h2><p className="film-description">{film.description}</p><ActionLink href={film.watchUrl} external variant="outline">Watch on YouTube</ActionLink></section><section aria-labelledby="credits-heading" className="film-credits"><h2 id="credits-heading">Credits</h2><dl>{film.credits.map(credit => <div key={credit.role}><dt>{credit.role}</dt><dd>{credit.name}</dd></div>)}</dl></section></div>
    <section className="film-screening" aria-labelledby="screening-heading"><div className="film-screening-heading"><h2 id="screening-heading">Watch the film.</h2><span className="metadata">{film.title} / {film.year}</span></div><FilmPlayer title={film.title} image={film.image} imageAlt={film.imageAlt} watchUrl={film.watchUrl} /><div className="film-screening-footer"><p>Press play to load the YouTube player.</p><ActionLink href={film.watchUrl} external>Open on YouTube</ActionLink></div></section>
    {film.stills.length > 0 && <section className="film-stills" aria-labelledby="stills-heading"><h2 id="stills-heading">Selected frames.</h2>{film.stills.map(still => <figure key={still.src}><MediaFrame src={still.src} alt={still.alt} />{still.caption && <figcaption>{still.caption}</figcaption>}</figure>)}</section>}
    <nav className="film-detail-navigation" aria-label="Film navigation"><Link className="action" href="/#work">← All films</Link><Link className="next-film" href={`/films/${next.slug}`}><span className="eyebrow">Next film</span><span>{next.title} <span aria-hidden="true">↗</span></span></Link></nav>
  </Container></main>;
}
