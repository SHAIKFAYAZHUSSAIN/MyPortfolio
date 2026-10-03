"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, createTimeline } from "animejs";
import { motion } from "@/lib/motion";

const WORDS = [
  "LOADING",
  "FILMING",
  "SHOOTING",
  "CAPTURING",
  "CUTTING",
  "EDITING",
  "CODING",
  "BUILDING",
  "EXPERIMENTING",
  "CREATING",
] as const;

export function OpeningSplash() {
  const rootRef = useRef<HTMLElement>(null);
  const finishRef = useRef<() => void>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Bypass immediately on reduced motion, deep link, restored scroll, or returning session
    const preference = window.matchMedia(motion.query.reduce);
    if (preference.matches || window.scrollY > 40 || window.location.hash) {
      document.documentElement.classList.remove("splash-pending");
      return;
    }
    try {
      if (sessionStorage.getItem("portfolio_splash_seen") === "1") {
        document.documentElement.classList.remove("splash-pending");
        return;
      }
    } catch {
      document.documentElement.classList.remove("splash-pending");
      return;
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    if (!root) return;

    let finished = false;
    let revealDispatched = false;

    const dispatchReveal = () => {
      if (revealDispatched) return;
      revealDispatched = true;
      document.documentElement.classList.remove("splash-pending");
      try {
        sessionStorage.setItem("portfolio_splash_seen", "1");
      } catch {}
      window.dispatchEvent(new CustomEvent("splash:reveal"));
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      dispatchReveal();

      // Cinematic exit cut: camera push & dissolve
      animate(root, {
        opacity: [1, 0],
        scale: [1, 1.025],
        duration: 440,
        ease: "outQuad",
        onComplete: () => {
          setMounted(false);
        },
      });
    };

    finishRef.current = finish;

    // Keyboard & pointer interactions immediately restore the page
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Tab", " ", "Enter"].includes(event.key)) finish();
    };
    const onPointer = (event: PointerEvent) => {
      // Don't intercept clicks inside explicit buttons (they handle themselves)
      if ((event.target as HTMLElement).closest(".splash-skip-btn")) return;
      finish();
    };
    const onScroll = () => {
      if (window.scrollY > 40) finish();
    };

    window.addEventListener("keydown", onKey);
    root.addEventListener("pointerdown", onPointer, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Track asset/page loading
    let isPageLoaded = document.readyState === "complete";
    const onLoad = () => {
      isPageLoaded = true;
    };
    if (!isPageLoaded) window.addEventListener("load", onLoad, { once: true });

    // Query elements
    const wordEls = root.querySelectorAll<HTMLElement>(".splash-word[data-index]");
    const finalWordEl = root.querySelector<HTMLElement>(".splash-word--final");
    const counterEl = root.querySelector<HTMLElement>(".splash-index-current");
    const progressEl = root.querySelector<HTMLElement>(".splash-progress-bar");
    const timecodeEl = root.querySelector<HTMLElement>(".hud-timecode");
    const taglineEl = root.querySelector<HTMLElement>(".splash-tagline-text");

    const tl = createTimeline({ autoplay: false });

    // Durations per word (ms)
    const durations = [240, 240, 240, 240, 240, 240, 240, 240, 280, 360];
    let currentTime = 0;

    WORDS.forEach((word, index) => {
      const el = wordEls[index];
      const duration = durations[index];
      const inDuration = 130;
      const outDuration = 110;

      // Update HUD & progress at step onset
      tl.call(() => {
        if (counterEl) counterEl.textContent = String(index + 1).padStart(2, "0");
        if (progressEl) progressEl.style.width = `${((index + 1) / (WORDS.length + 1)) * 100}%`;
        if (timecodeEl) timecodeEl.textContent = `00:00:0${index + 1}:12`;
      }, currentTime);

      if (el) {
        // Masked vertical reveal
        tl.add(el, {
          y: ["106%", "0%"],
          opacity: [0, 1],
          duration: inDuration,
          ease: "outCubic",
        }, currentTime);

        // Masked vertical exit cut
        tl.add(el, {
          y: ["0%", "-106%"],
          opacity: [1, 0],
          duration: outDuration,
          ease: "inCubic",
        }, currentTime + duration - outDuration);
      }

      currentTime += duration;
    });

    // Final Identity resolve: FAYAZ SHAIK & FILM × CODE × CURIOSITY
    const finalStartTime = currentTime;
    const finalHold = 540;

    tl.call(() => {
      if (counterEl) counterEl.textContent = "01";
      if (progressEl) progressEl.style.width = "100%";
      if (timecodeEl) timecodeEl.textContent = "00:00:01:00";
      if (taglineEl) taglineEl.classList.add("splash-tagline-text--resolved");
    }, finalStartTime);

    if (finalWordEl) {
      tl.add(finalWordEl, {
        y: ["106%", "0%"],
        opacity: [0, 1],
        duration: 300,
        ease: motion.ease.reveal,
      }, finalStartTime);
    }

    // Cut into the homepage hero
    tl.call(() => {
      finish();
    }, finalStartTime + finalHold);

    // Hard failsafe in case timeline or RAF gets suspended
    const failsafe = window.setTimeout(finish, currentTime + finalHold + 900);

    tl.play();

    return () => {
      finish();
      window.clearTimeout(failsafe);
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoad);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <aside
      ref={rootRef}
      className="opening-splash"
      role="region"
      aria-label="Opening title sequence"
      aria-live="polite"
      data-active="true"
    >
      <div className="sr-only">
        Opening title sequence: Fayaz Shaik — Film, Code, Curiosity.
      </div>

      {/* Cinematic atmosphere background */}
      <div className="splash-bg" aria-hidden="true">
        <div className="splash-atmosphere-wrap">
          <Image
            src="/images/spectre.jpg"
            alt=""
            fill
            priority
            className="splash-atmosphere"
            sizes="100vw"
          />
        </div>
        <div className="splash-vignette" />
        <div className="splash-glow" />
        <div className="splash-grain" />
      </div>

      {/* Viewfinder corner brackets */}
      <div className="splash-reticle splash-reticle--tl" aria-hidden="true" />
      <div className="splash-reticle splash-reticle--tr" aria-hidden="true" />
      <div className="splash-reticle splash-reticle--bl" aria-hidden="true" />
      <div className="splash-reticle splash-reticle--br" aria-hidden="true" />

      {/* Top HUD */}
      <div className="splash-hud splash-hud--top" aria-hidden="true">
        <div className="splash-hud-left">
          <span className="splash-rec">
            <span className="splash-rec-dot" />
            REC
          </span>
          <span className="splash-hud-sep">//</span>
          <span className="splash-hud-val">24 FPS</span>
        </div>
        <div className="splash-hud-center">
          <span className="splash-hud-val">SCENE 01 / TAKE 01</span>
        </div>
        <div className="splash-hud-right">
          <span className="splash-hud-val">TC </span>
          <span className="splash-hud-mono hud-timecode">00:00:00:00</span>
        </div>
      </div>

      {/* Center Stage */}
      <div className="splash-center">
        {/* Index Indicator */}
        <div className="splash-index-wrap" aria-hidden="true">
          <span className="splash-index-label">
            <span className="splash-index-accent splash-index-current">01</span>
            <span className="splash-index-slash"> / </span>
            <span className="splash-index-total">10</span>
          </span>
          <span className="splash-index-line" />
        </div>

        {/* Masked Typography Word Slot */}
        <div className="splash-word-stage">
          <div className="splash-word-mask">
            {WORDS.map((word, index) => (
              <span
                key={word}
                className="splash-word"
                data-index={index}
                aria-hidden="true"
              >
                {word}
              </span>
            ))}
            <span
              className="splash-word splash-word--final"
              data-final="true"
              aria-hidden="true"
            >
              FAYAZ SHAIK
            </span>
          </div>
        </div>

        {/* Tagline / Identity */}
        <div className="splash-tagline-wrap" aria-hidden="true">
          <span className="splash-tagline splash-tagline-text">
            <span className="splash-tag-part">FILM</span>
            <span className="splash-tag-sep">×</span>
            <span className="splash-tag-part">CODE</span>
            <span className="splash-tag-sep">×</span>
            <span className="splash-tag-part">CURIOSITY</span>
          </span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="splash-hud splash-hud--bottom">
        <div className="splash-hud-left" aria-hidden="true">
          <span className="splash-hud-val">CINEMATOGRAPHY &amp; CODE</span>
        </div>
        <div className="splash-hud-center" aria-hidden="true">
          <div className="splash-progress-track">
            <div className="splash-progress-bar" />
          </div>
        </div>
        <div className="splash-hud-right">
          <button
            type="button"
            className="splash-skip-btn"
            onClick={() => finishRef.current?.()}
            aria-label="Skip title sequence"
          >
            <span>SKIP INTRO</span>
            <span className="splash-skip-key" aria-hidden="true">[ESC]</span>
            <span className="splash-skip-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
