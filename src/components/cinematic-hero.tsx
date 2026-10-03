"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { films } from "@/data/portfolio";
import { createTimeline, stagger } from "animejs";
import { ActionLink, Container } from "./ui";
import { bindDrift, motion } from "@/lib/motion";

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = root.current;
    const image = hero?.querySelector<HTMLElement>(".cinema-image");
    if (hero && image) return bindDrift(hero, image, 18);
  }, []);

  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const preference = window.matchMedia(motion.query.reduce);
    // Deep links and restored scroll positions should never replay an introduction.
    if (preference.matches || window.scrollY > 40 || window.location.hash) return;
    const words = hero.querySelectorAll<HTMLElement>(".title-word");
    const metadata = hero.querySelectorAll<HTMLElement>(".cinema-top, .cinema-identity");
    const supporting = hero.querySelectorAll<HTMLElement>(".cinema-bottom .hero-support, .cinema-footer");
    const image = hero.querySelector<HTMLElement>(".cinema-image");
    const reel = hero.querySelector<HTMLElement>(".cinema-reel");
    const grain = hero.querySelector<HTMLElement>(".hero-grain");
    const header = document.querySelector<HTMLElement>(".site-header");
    const targets = [...words, ...metadata, ...supporting, ...[image, reel, grain, header].filter((element): element is HTMLElement => !!element)];
    const timeline = createTimeline({ autoplay: false });
    let finished = false;
    let startTimer: number | undefined;
    let started = false;
    const startHero = () => {
      if (started || finished) return;
      started = true;
      timeline.play();
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      hero.removeAttribute("data-opening");
      timeline.revert();
      targets.forEach(element => { element.style.removeProperty("opacity"); element.style.removeProperty("transform"); });
    };
    try {
      hero.dataset.opening = "true";
      targets.forEach(element => { element.style.opacity = "0"; });
      if (grain) timeline.add(grain, { opacity: [0, .07], duration: 600, ease: motion.ease.calm }, 0);
      timeline.add(metadata, { opacity: [0,1], duration: 650, delay: stagger(90), ease: motion.ease.calm }, 160);
      timeline.add(words, { opacity: [0, 1], y: ["106%", "0%"], duration: motion.duration.reveal, delay: stagger(150), ease: motion.ease.reveal }, 380);
      timeline.add(supporting, { opacity: [0, 1], y: [8, 0], duration: motion.duration.reveal, delay: stagger(100), ease: motion.ease.settle }, 1200);
      if (image) timeline.add(image, { opacity: [0, 1], scale: [1.035, 1], duration: 1750, ease: motion.ease.calm }, 1400);
      if (reel) timeline.add(reel, { opacity: [0,1], y: [12,0], duration: 1000, ease: motion.ease.settle }, 1870);
      if (header) timeline.add(header, { opacity: [0, 1], duration: 650, ease: motion.ease.calm }, 2080);
      timeline.call(finish, motion.duration.opening);

      const isSplashPending = document.documentElement.classList.contains("splash-pending") ||
        !!document.querySelector(".opening-splash[data-active='true']");


      if (isSplashPending) {
        window.addEventListener("splash:reveal", startHero, { once: true });
        startTimer = window.setTimeout(startHero, 4200);
      } else {
        startHero();
      }
    } catch { finish(); }
    // Interaction immediately restores all controls; the introduction never blocks navigation.
    const onKey = (event: KeyboardEvent) => { if (["Tab", "Escape", "PageDown", "End", " "].includes(event.key)) finish(); };
    const onPreference = () => { if (preference.matches) finish(); };
    const onScroll = () => { if (window.scrollY > 40) finish(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", finish, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    preference.addEventListener("change", onPreference);
    const failSafe = window.setTimeout(finish, 4000 + motion.duration.opening + 600);
    return () => {
      finish();
      window.clearTimeout(failSafe);
      window.clearTimeout(startTimer);
      window.removeEventListener("splash:reveal", startHero);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("scroll", onScroll);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return <section ref={root} className="cinematic-hero" id="top" aria-labelledby="hero-title">
    <div className="cinema-image" aria-hidden="true"><Image src="/images/fayaz.png" alt="" fill priority sizes="(max-width: 639px) 100vw, 60vw" /></div>
    <div className="cinema-shade" aria-hidden="true" />
    <div className="hero-grain" aria-hidden="true" />
    <Container className="cinema-content">
      <div className="cinema-top hero-support"><p className="eyebrow">Fayaz Shaik <span aria-hidden="true">/</span> Selected works</p><span className="cinema-edition">Independent films / Digital experiences</span></div>
      <div className="cinema-title-group">
        <p className="cinema-identity hero-support">Filmmaker × Developer × Vibecoder</p>
        <h1 id="hero-title" aria-label="I make films. I build things.">
          <span className="title-line" aria-hidden="true"><span className="title-prelude word-mask"><span className="title-word">I MAKE</span></span><span className="title-subject word-mask"><span className="title-word">FILMS.</span></span></span>
          <span className="title-line title-line--second" aria-hidden="true"><span className="title-prelude word-mask"><span className="title-word">I BUILD</span></span><span className="title-subject word-mask"><span className="title-word">THINGS.</span></span></span>
        </h1>
      </div>
      <div className="cinema-bottom"><div className="cinema-intro hero-support"><p>Turning ideas into experiences.</p><span>Stories on screen. Ideas in code.</span></div><div className="hero-support"><ActionLink href="#work" variant="outline">Explore the work</ActionLink></div></div>
      <nav className="cinema-reel hero-support" aria-label="Selected films">{films.map((film, index) => <Link href={`/films/${film.slug}`} key={film.slug} aria-label={`Explore ${film.title}`}><span className="reel-frame"><Image src={film.image} alt="" fill sizes="(max-width: 639px) 30vw, 200px" /></span><span className="reel-caption">0{index + 1} / {film.title}</span></Link>)}</nav>
      <div className="cinema-footer hero-support"><span>Film × Code × Experiments</span><a href="#work">Begin the next scene <span aria-hidden="true">↓</span></a></div>
    </Container>
  </section>;
}
