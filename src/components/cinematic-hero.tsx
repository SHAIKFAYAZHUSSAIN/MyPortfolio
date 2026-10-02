"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { createTimeline, stagger } from "animejs";
import { ActionLink, Container } from "./ui";

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Deep links and restored scroll positions should never replay an introduction.
    if (preference.matches || window.scrollY > 40 || window.location.hash) return;
    const words = hero.querySelectorAll<HTMLElement>(".title-word");
    const supporting = hero.querySelectorAll<HTMLElement>(".hero-support");
    const image = hero.querySelector<HTMLElement>(".cinema-image");
    const header = document.querySelector<HTMLElement>(".site-header");
    const targets = [...words, ...supporting, ...(image ? [image] : []), ...(header ? [header] : [])];
    const timeline = createTimeline({ autoplay: false });
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      timeline.revert();
      targets.forEach(element => { element.style.removeProperty("opacity"); element.style.removeProperty("transform"); });
    };
    try {
      targets.forEach(element => { element.style.opacity = "0"; });
      timeline.add(words, { opacity: [0, 1], y: ["105%", "0%"], duration: 1300, delay: stagger(125), ease: "outQuart" }, 240);
      if (image) timeline.add(image, { opacity: [0, 1], scale: [1.035, 1], duration: 3100, ease: "outSine" }, 650);
      timeline.add(supporting, { opacity: [0, 1], y: [10, 0], duration: 1000, delay: stagger(120), ease: "outCubic" }, 1450);
      if (header) timeline.add(header, { opacity: [0, 1], duration: 900, ease: "outSine" }, 2050);
      timeline.call(finish, 3900);
      timeline.play();
    } catch { finish(); }
    // Interaction immediately restores all controls; the introduction never blocks navigation.
    const onKey = (event: KeyboardEvent) => { if (["Tab", "Escape", "PageDown", "End", " "].includes(event.key)) finish(); };
    const onPreference = () => { if (preference.matches) finish(); };
    const onScroll = () => { if (window.scrollY > 40) finish(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", finish, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    preference.addEventListener("change", onPreference);
    const failSafe = window.setTimeout(finish, 4500);
    return () => {
      finish();
      window.clearTimeout(failSafe);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("scroll", onScroll);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return <section ref={root} className="cinematic-hero" id="top" aria-labelledby="hero-title">
    <div className="cinema-image" aria-hidden="true"><Image src="/images/fayaz.png" alt="" fill priority sizes="(max-width: 639px) 100vw, 60vw" /></div>
    <div className="cinema-shade" aria-hidden="true" />
    <Container className="cinema-content">
      <div className="cinema-top hero-support"><p className="eyebrow">Fayaz Shaik <span aria-hidden="true">/</span> Selected works</p><span className="cinema-edition">A personal collection — 01</span></div>
      <div className="cinema-title-group">
        <p className="cinema-identity hero-support">Filmmaker × Developer × Vibecoder</p>
        <h1 id="hero-title" aria-label="I make films. I build things.">
          <span className="title-line" aria-hidden="true">{["I", "MAKE", "FILMS."].map(word => <span className="word-mask" key={word}><span className="title-word">{word}</span></span>)}</span>
          <span className="title-line title-line--second" aria-hidden="true">{["I", "BUILD", "THINGS."].map(word => <span className="word-mask" key={word}><span className="title-word">{word}</span></span>)}</span>
        </h1>
      </div>
      <div className="cinema-bottom"><div className="cinema-intro hero-support"><p>Turning ideas into experiences.</p><span>Stories on screen. Ideas in code.</span></div><div className="hero-support"><ActionLink href="#work" variant="outline">Explore the work</ActionLink></div></div>
      <div className="cinema-footer hero-support"><span>Film × Code × Experiments</span><a href="#work">Begin the next scene <span aria-hidden="true">↓</span></a></div>
    </Container>
  </section>;
}
