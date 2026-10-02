import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "./motion";

/** Loaded near Films. Native scroll; no pins or synthetic scroll driver. */
export function installFilmSequence(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const counter = root.querySelector<HTMLElement>(".shot-current");
  const name = root.querySelector<HTMLElement>(".shot-name");
  const progress = root.querySelector<HTMLElement>(".shot-progress span");
  const shots = [...root.querySelectorAll<HTMLElement>(".archive-film")];
  const activate = (shot: HTMLElement, index: number) => {
    shots.forEach(item => item.toggleAttribute("data-current", item === shot));
    if (counter) counter.textContent = `0${index + 1}`;
    if (name) name.textContent = shot.dataset.title ?? "";
  };
  media.add(motion.query.cinema, () => {
    shots.forEach((shot, index) => {
      const screen = shot.querySelector(".archive-screen");
      const image = shot.querySelector(".shot-drift");
      if (!screen || !image) return;
      ScrollTrigger.create({ trigger: shot, start: "top 55%", end: "bottom 55%", onEnter: () => activate(shot,index), onEnterBack: () => activate(shot,index) });
      gsap.fromTo(image, { yPercent: 1.2, scale: 1.025 }, { yPercent: -1.2, scale: 1, ease: "none", scrollTrigger: { trigger: screen, start: "top bottom", end: "bottom top", scrub: .65 } });
      gsap.fromTo(screen, { clipPath: "inset(3% 1% 3% 1%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: screen, start: "top 95%", end: "top 25%", scrub: .4 } });
    });
    if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.querySelector(".archive-collection"), start: "top 55%", end: "bottom 55%", scrub: true } });
    const cut = root.querySelector(".medium-cut");
    if (cut) {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: cut, start: "top 88%", end: "bottom 28%", scrub: .4 } });
      timeline.fromTo(cut.querySelector(".cut-line"), { scaleX: .05 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0);
      timeline.fromTo(cut.querySelector(".cut-word"), { clipPath: "inset(0% 100% 0% 0%)", x: -18 }, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1, ease: "power2.out" }, .25);
      timeline.fromTo(cut.querySelector(".cut-grid"), { opacity: 0, scaleX: .9 }, { opacity: .28, scaleX: 1, duration: 1 }, .6);
    }
  }, root);
  let disposed = false;
  document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
  return () => {
    disposed = true; media.revert();
    shots.forEach(shot => shot.removeAttribute("data-current"));
    if (counter) counter.textContent = "01";
    if (name) name.textContent = shots[0]?.dataset.title ?? "";
  };
}
