"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, createTimeline, stagger, type JSAnimation } from "animejs";
import { bindDrift, motion } from "@/lib/motion";

export function MotionDirector() {
  const cursor = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    const preference = matchMedia(motion.query.reduce);
    if (preference.matches) return;

    const isDesktop = matchMedia("(min-width: 1024px)").matches;
    const isMobile = !matchMedia("(min-width: 768px)").matches;
    const active = new Set<{ revert: () => unknown }>();
    const seen = new WeakSet<Element>();
    const observers: IntersectionObserver[] = [];

    const track = <T extends { revert: () => unknown }>(item: T): T => {
      active.add(item);
      return item;
    };

    // Generic fallback for any standalone motion-text not handled in a section sequence
    const revealText = (element: HTMLElement) => {
      if (seen.has(element)) return;
      seen.add(element);
      if (element.contains(document.activeElement)) return;
      const words = element.querySelectorAll<HTMLElement>(".motion-word");
      if (!words.length) return;
      const duration = element.hasAttribute("data-motion-calm") ? motion.duration.calm : motion.duration.reveal;
      const anim = animate(words, {
        y: ["106%", "0%"], opacity: [.35, 1], duration,
        delay: stagger(isMobile ? 35 : 55), ease: motion.ease.reveal,
        onComplete: () => { anim.revert(); active.delete(anim); },
      });
      track(anim);
    };

    // 1. CODE SECTION CHOREOGRAPHY
    // Eyebrow -> Heading -> Section intro -> Project cards sequentially -> image slightly before copy -> settle
    const codeSection = root.querySelector<HTMLElement>("#code");
    if (codeSection) {
      const codeHeading = codeSection.querySelector<HTMLElement>(".section-heading");
      const codeEyebrow = codeHeading?.querySelector<HTMLElement>(".eyebrow");
      const codeRule = codeHeading?.querySelector<HTMLElement>(".section-rule");
      const codeTitle = codeHeading?.querySelector<HTMLElement>(".motion-text");
      const codeWords = codeHeading?.querySelectorAll<HTMLElement>(".motion-word");
      const codeIntro = codeHeading?.querySelector<HTMLElement>(".section-intro");
      const techIntro = codeSection.querySelector<HTMLElement>(".technology-intro");
      const collection = codeSection.querySelector<HTMLElement>(".technology-collection");
      const cards = [...codeSection.querySelectorAll<HTMLElement>(".tech-project")];

      if (codeTitle) seen.add(codeTitle);

      if (codeHeading) {
        const headObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          headObserver.disconnect();
          if (preference.matches || codeSection.contains(document.activeElement)) return;

          const tl = createTimeline({ onComplete: () => { tl.revert(); active.delete(tl); } });
          track(tl);

          if (codeEyebrow) {
            tl.add(codeEyebrow, { opacity: [0, 1], y: [isMobile ? 6 : 10, 0], duration: 600, ease: motion.ease.settle }, 0);
          }
          if (codeRule) {
            tl.add(codeRule, { scaleX: [0, 1], duration: 750, ease: motion.ease.reveal }, 60);
          }
          if (codeWords && codeWords.length) {
            tl.add(codeWords, { y: ["106%", "0%"], opacity: [.35, 1], duration: motion.duration.reveal, delay: stagger(isMobile ? 35 : 60), ease: motion.ease.reveal }, 120);
          }
          if (codeIntro) {
            tl.add(codeIntro, { opacity: [0, 1], y: [isMobile ? 4 : 8, 0], duration: 600, ease: motion.ease.settle }, 240);
          }
          if (techIntro) {
            tl.add(techIntro, { opacity: [0, 1], y: [isMobile ? 4 : 6, 0], duration: 550, ease: motion.ease.settle }, 320);
          }
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        headObserver.observe(codeHeading);
        observers.push(headObserver);
      }

      if (collection && cards.length) {
        if (isDesktop) {
          const cardsObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            cardsObserver.disconnect();
            if (preference.matches || collection.contains(document.activeElement)) return;

            const tl = createTimeline({ onComplete: () => { tl.revert(); active.delete(tl); } });
            track(tl);

            cards.forEach((card, index) => {
              const image = card.querySelector<HTMLElement>(".tech-image");
              const copy = card.querySelectorAll<HTMLElement>(".tech-index, h3, .tech-description, .tech-metadata, .tech-links");
              const start = index * 200;

              if (image) {
                tl.add(image, {
                  clipPath: ["inset(8% 0 85% 0)", "inset(0% 0 0% 0)"],
                  opacity: [.35, 1],
                  y: [14, 0],
                  duration: motion.duration.reveal,
                  ease: motion.ease.reveal,
                }, start);
              }
              if (copy.length) {
                tl.add(copy, {
                  opacity: [0, 1],
                  y: [10, 0],
                  duration: motion.duration.reveal,
                  delay: stagger(35),
                  ease: motion.ease.settle,
                }, start + 130);
              }
            });
          }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
          cardsObserver.observe(collection);
          observers.push(cardsObserver);
        } else {
          cards.forEach(card => {
            const cardObserver = new IntersectionObserver(([entry]) => {
              if (!entry.isIntersecting) return;
              cardObserver.disconnect();
              if (preference.matches || card.contains(document.activeElement)) return;

              const image = card.querySelector<HTMLElement>(".tech-image");
              const copy = card.querySelectorAll<HTMLElement>(".tech-index, h3, .tech-description, .tech-metadata, .tech-links");
              const tl = createTimeline({ onComplete: () => { tl.revert(); active.delete(tl); } });
              track(tl);

              if (image) {
                tl.add(image, {
                  clipPath: ["inset(5% 0 70% 0)", "inset(0% 0 0% 0)"],
                  opacity: [.4, 1],
                  y: [8, 0],
                  duration: 650,
                  ease: motion.ease.reveal,
                }, 0);
              }
              if (copy.length) {
                tl.add(copy, {
                  opacity: [0, 1],
                  y: [6, 0],
                  duration: 650,
                  delay: stagger(25),
                  ease: motion.ease.settle,
                }, 90);
              }
            }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
            cardObserver.observe(card);
            observers.push(cardObserver);
          });
        }
      }
    }

    // 2. ABOUT SECTION CHOREOGRAPHY
    // Calm reveal: 1. Heading begins low-opacity/offset -> 2. Heading resolves -> 3. Portrait reveals -> 4. Biography appears -> 5. Details appear last
    const aboutSection = root.querySelector<HTMLElement>("#about");
    if (aboutSection) {
      const aboutEyebrow = aboutSection.querySelector<HTMLElement>(".about-copy .eyebrow");
      const aboutRule = aboutSection.querySelector<HTMLElement>(".section-rule");
      const aboutTitle = aboutSection.querySelector<HTMLElement>(".about-copy .motion-text");
      const aboutWords = aboutSection.querySelectorAll<HTMLElement>("#about-heading .motion-word");
      const portrait = aboutSection.querySelector<HTMLElement>(".portrait-column .media-frame");
      const caption = aboutSection.querySelector<HTMLElement>(".portrait-caption");
      const manifesto = aboutSection.querySelector<HTMLElement>(".about-manifesto");
      const lead = aboutSection.querySelector<HTMLElement>(".about-lead");
      const muted = aboutSection.querySelector<HTMLElement>(".about-copy > .muted");
      const education = aboutSection.querySelector<HTMLElement>(".education");
      const connect = aboutSection.querySelector<HTMLElement>(".about-copy > .action");

      if (aboutTitle) seen.add(aboutTitle);

      const aboutObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        aboutObserver.disconnect();
        if (preference.matches || aboutSection.contains(document.activeElement)) return;

        const tl = createTimeline({ onComplete: () => { tl.revert(); active.delete(tl); } });
        track(tl);

        // 1 & 2. Eyebrow arrives softly; Heading begins low-opacity & offset, resolves calmly
        if (aboutEyebrow) {
          tl.add(aboutEyebrow, { opacity: [0, 1], y: [isMobile ? 4 : 6, 0], duration: 650, ease: motion.ease.calm }, 0);
        }
        if (aboutRule) {
          tl.add(aboutRule, { scaleX: [0, 1], duration: 800, ease: motion.ease.calm }, 60);
        }
        if (aboutWords && aboutWords.length) {
          tl.add(aboutWords, {
            opacity: [.18, 1],
            y: ["55%", "0%"],
            duration: motion.duration.calm,
            delay: stagger(isMobile ? 45 : 85),
            ease: motion.ease.calm,
          }, 100);
        }
        // 3. Portrait reveals with photographic calm (not overanimated)
        if (portrait) {
          tl.add(portrait, {
            opacity: [.25, 1],
            scale: [1.02, 1],
            duration: motion.duration.calm,
            ease: motion.ease.calm,
          }, isMobile ? 50 : 440);
        }
        if (caption) {
          tl.add(caption, { opacity: [0, 1], duration: 650, ease: motion.ease.calm }, isMobile ? 250 : 640);
        }
        // 4. Biography appears
        const bioElements = [manifesto, lead, muted].filter((el): el is HTMLElement => !!el);
        if (bioElements.length) {
          tl.add(bioElements, {
            opacity: [0, 1],
            y: [isMobile ? 4 : 8, 0],
            duration: 800,
            delay: stagger(isMobile ? 40 : 90),
            ease: motion.ease.calm,
          }, isMobile ? 320 : 680);
        }
        // 5. Supporting details appear last
        const detailElements = [education, connect].filter((el): el is HTMLElement => !!el);
        if (detailElements.length) {
          tl.add(detailElements, {
            opacity: [0, 1],
            y: [isMobile ? 4 : 6, 0],
            duration: 750,
            delay: stagger(isMobile ? 35 : 80),
            ease: motion.ease.calm,
          }, isMobile ? 500 : 980);
        }
      }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
      aboutObserver.observe(aboutSection);
      observers.push(aboutObserver);
    }

    // 4. CONTACT SECTION CHOREOGRAPHY
    // Final scene: 1. Background atmosphere -> 2. Large heading -> 3. Supporting copy -> 4. Contact link/arrow
    const contactSection = root.querySelector<HTMLElement>("#contact");
    if (contactSection) {
      const contactEyebrow = contactSection.querySelector<HTMLElement>(".contact-section > .eyebrow");
      const contactRule = contactSection.querySelector<HTMLElement>(".section-rule");
      const contactTitle = contactSection.querySelector<HTMLElement>(".contact-heading .motion-text");
      const contactWords = contactSection.querySelectorAll<HTMLElement>("#contact-heading .motion-word");
      const arrow = contactSection.querySelector<HTMLElement>(".contact-arrow");
      const email = contactSection.querySelector<HTMLElement>(".email-link");
      const bottom = contactSection.querySelector<HTMLElement>(".contact-bottom p");
      const socials = contactSection.querySelectorAll<HTMLElement>(".social-links .action");

      if (contactTitle) seen.add(contactTitle);

      const contactObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        contactObserver.disconnect();
        if (preference.matches || contactSection.contains(document.activeElement)) return;

        const tl = createTimeline({ onComplete: () => { tl.revert(); active.delete(tl); } });
        track(tl);

        // 1. Atmosphere & eyebrow
        if (contactEyebrow) {
          tl.add(contactEyebrow, { opacity: [0, 1], y: [isMobile ? 4 : 8, 0], duration: 600, ease: motion.ease.settle }, 0);
        }
        if (contactRule) {
          tl.add(contactRule, { scaleX: [0, 1], duration: 750, ease: motion.ease.settle }, 60);
        }
        // 2. Large heading
        if (contactWords && contactWords.length) {
          tl.add(contactWords, {
            y: ["106%", "0%"],
            opacity: [.25, 1],
            duration: 900,
            delay: stagger(isMobile ? 45 : 85),
            ease: motion.ease.reveal,
          }, 140);
        }
        // 3. Supporting copy
        if (email) {
          tl.add(email, { opacity: [0, 1], y: [isMobile ? 6 : 10, 0], duration: 750, ease: motion.ease.settle }, 440);
        }
        if (bottom) {
          tl.add(bottom, { opacity: [0, 1], y: [isMobile ? 4 : 8, 0], duration: 700, ease: motion.ease.settle }, 520);
        }
        // 4. Contact link/arrow: final frame of a film (NO bounce, NO giant scale, NO pulse)
        if (arrow) {
          tl.add(arrow, { opacity: [0, 1], y: [isMobile ? 4 : 6, 0], duration: 800, ease: motion.ease.calm }, 640);
        }
        if (socials.length) {
          tl.add(socials, { opacity: [0, 1], y: [isMobile ? 2 : 4, 0], duration: 600, delay: stagger(isMobile ? 25 : 45), ease: motion.ease.settle }, 700);
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      contactObserver.observe(contactSection);
      observers.push(contactObserver);
    }

    // Generic observer for any other .motion-text (e.g. standalone text)
    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          textObserver.unobserve(entry.target);
          revealText(entry.target as HTMLElement);
        }
      });
    }, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll<HTMLElement>(".motion-text").forEach(element => {
      if (!seen.has(element)) textObserver.observe(element);
    });
    observers.push(textObserver);

    const settle = () => { active.forEach(animation => animation.revert()); active.clear(); };
    const onPreference = () => { if (preference.matches) settle(); };
    root.addEventListener("focusin", settle);
    preference.addEventListener("change", onPreference);

    return () => {
      observers.forEach(obs => obs.disconnect());
      settle();
      root.removeEventListener("focusin", settle);
      preference.removeEventListener("change", onPreference);
    };
  }, [pathname]);

  useEffect(() => {
    const element = cursor.current;
    if (!element) return;
    const ring = element.querySelector<HTMLElement>(".cursor-ring")!;
    const label = element.querySelector<HTMLElement>(".cursor-label")!;
    const preference = matchMedia(motion.query.pointer);
    let animation: JSAnimation | undefined;
    let frame = 0, px = 0, py = 0, currentState = "";
    const hide = () => { element.dataset.visible = "false"; document.documentElement.classList.remove("cinematic-cursor"); cancelAnimationFrame(frame); frame = 0; };
    const change = (state: string) => {
      if (state === currentState) return;
      currentState = state; label.textContent = state ? `${state} →` : "";
      animation?.cancel();
      animation = animate(ring, { width: state ? 86 : 12, height: state ? 34 : 12, borderRadius: state ? "18px" : "6px", duration: motion.duration.micro, ease: motion.ease.settle });
      element.dataset.state = state ? "action" : "default";
    };
    const updateFrame = () => {
      frame = 0;
      const target = document.elementFromPoint(px, py);
      if (!target || target.closest("dialog,input,textarea,select,[contenteditable]")) { hide(); return; }
      element.style.transform = `translate3d(${px}px,${py}px,0)`;
      change(target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "");
    };
    const move = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!preference.matches || event.pointerType !== "mouse" || target.closest("dialog,input,textarea,select,[contenteditable]")) { hide(); return; }
      px = event.clientX; py = event.clientY;
      document.documentElement.classList.add("cinematic-cursor");
      element.dataset.visible = "true";
      if (!frame) frame = requestAnimationFrame(updateFrame);
    };
    // Content can move underneath a stationary pointer while scrolling.
    const scroll = () => { if (element.dataset.visible === "true" && preference.matches && !frame) frame = requestAnimationFrame(updateFrame); };
    const key = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", key);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", hide);
    return () => { hide(); animation?.revert(); document.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", hide); document.removeEventListener("keydown", key); window.removeEventListener("blur", hide); window.removeEventListener("scroll", scroll, true); document.removeEventListener("visibilitychange", visibility); preference.removeEventListener("change", hide); };
  }, [pathname]);

  return <div ref={cursor} className="cinema-cursor" data-visible="false" aria-hidden="true"><span className="cursor-ring"><span className="cursor-label" /></span></div>;
}
