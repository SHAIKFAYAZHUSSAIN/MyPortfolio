"use client";

import { useEffect, useState } from "react";

export interface ScriptName {
  lang: string;
  name: string;
  dir?: "rtl" | "ltr";
  fontFamily: string;
  fontWeight?: number | string;
  fontSize?: string;
  letterSpacing?: string;
}

export const SCRIPT_NAMES: ScriptName[] = [
  {
    lang: "en",
    name: "FAYAZ SHAIK",
    fontFamily: "var(--font-display), 'Arial Narrow', Impact, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.075em",
  },
  {
    lang: "ur",
    name: "فیاض شیخ",
    dir: "rtl",
    fontFamily: '"Almarai", -apple-system, BlinkMacSystemFont, Tahoma, sans-serif',
    fontWeight: 400,
    fontSize: "0.96em",
    letterSpacing: "0",
  },
  {
    lang: "ar",
    name: "فياض شيخ",
    dir: "rtl",
    fontFamily: '"Almarai", -apple-system, BlinkMacSystemFont, Tahoma, sans-serif',
    fontWeight: 700,
    fontSize: "0.96em",
    letterSpacing: "0",
  },
  {
    lang: "hi",
    name: "फ़याज़ शेख़",
    fontFamily: '"Noto Sans Devanagari", "Nirmala UI", "Mangal", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "te",
    name: "ఫయాజ్ షేక్",
    fontFamily: '"Gautami", "Kohinoor Telugu", "Nirmala UI", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "bn",
    name: "ফায়াজ শেখ",
    fontFamily: '"Vrinda", "Shonar Bangla", "Nirmala UI", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "ta",
    name: "ஃபயாஸ் ஷேக்",
    fontFamily: '"Latha", "Nirmala UI", "Vijaya", sans-serif',
    fontWeight: 500,
    fontSize: "0.9em",
  },
  {
    lang: "ml",
    name: "ഫയാസ് ഷെയ്ഖ്",
    fontFamily: '"Kartika", "Nirmala UI", sans-serif',
    fontWeight: 500,
    fontSize: "0.9em",
  },
  {
    lang: "kn",
    name: "ಫಯಾಜ್ ಶೇಖ್",
    fontFamily: '"Tunga", "Nirmala UI", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "mr",
    name: "फयाज शेख",
    fontFamily: '"Noto Sans Devanagari", "Nirmala UI", "Mangal", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "gu",
    name: "ફયાઝ શેખ",
    fontFamily: '"Shruti", "Nirmala UI", "Gujarati", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "pa",
    name: "ਫਯਾਜ਼ ਸ਼ੇਖ",
    fontFamily: '"Raavi", "Nirmala UI", "Gurmukhi", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
  {
    lang: "zh",
    name: "法亚兹·谢赫",
    fontFamily: '"ZCOOL KuaiLe", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontWeight: 400,
    fontSize: "0.95em",
    letterSpacing: "0.04em",
  },
  {
    lang: "ja",
    name: "ファヤズ・シェイク",
    fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
    fontWeight: 500,
    fontSize: "0.88em",
    letterSpacing: "0.04em",
  },
  {
    lang: "ko",
    name: "파야즈 셰이크",
    fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", "Nanum Gothic", sans-serif',
    fontWeight: 600,
    fontSize: "0.9em",
    letterSpacing: "0.02em",
  },
  {
    lang: "ru",
    name: "ФАЯЗ ШЕЙХ",
    fontFamily: "var(--font-display), 'Arial Narrow', Impact, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.06em",
  },
  {
    lang: "el",
    name: "ΦΑΓΙΑΖ ΣΕΪΧ",
    fontFamily: "var(--font-display), 'Arial Narrow', Impact, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.06em",
  },
  {
    lang: "he",
    name: "פיאז שייח׳",
    dir: "rtl",
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: 600,
    fontSize: "0.95em",
    letterSpacing: "0",
  },
  {
    lang: "fa",
    name: "فیاض شیخ",
    dir: "rtl",
    fontFamily: '"Almarai", -apple-system, BlinkMacSystemFont, Tahoma, sans-serif',
    fontWeight: 400,
    fontSize: "0.96em",
    letterSpacing: "0",
  },
  {
    lang: "th",
    name: "ฟายาซ เชค",
    fontFamily: '"Leelawadee UI", "Thonburi", sans-serif',
    fontWeight: 500,
    fontSize: "0.92em",
  },
];

interface MultilingualWordmarkProps {
  onClick?: () => void;
}

export function MultilingualWordmark({ onClick }: MultilingualWordmarkProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "exiting" | "entering">("visible");

  useEffect(() => {
    // Respect prefers-reduced-motion: stay static on English
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const HOLD_DURATION = 2000;
    const TRANSITION_DURATION = 500;

    let exitTimer: number;
    let nextTimer: number;
    let frameId: number;
    let isDisposed = false;

    const scheduleNext = () => {
      if (isDisposed || document.hidden || preference.matches) return;

      exitTimer = window.setTimeout(() => {
        if (isDisposed) return;
        setPhase("exiting");

        nextTimer = window.setTimeout(() => {
          if (isDisposed) return;
          setIndex((prev) => (prev + 1) % SCRIPT_NAMES.length);
          setPhase("entering");

          frameId = requestAnimationFrame(() => {
            if (isDisposed) return;
            setPhase("visible");
            scheduleNext();
          });
        }, TRANSITION_DURATION);
      }, HOLD_DURATION);
    };

    scheduleNext();

    const onVisibility = () => {
      if (!document.hidden) {
        window.clearTimeout(exitTimer);
        window.clearTimeout(nextTimer);
        cancelAnimationFrame(frameId);
        setPhase("visible");
        scheduleNext();
      } else {
        window.clearTimeout(exitTimer);
        window.clearTimeout(nextTimer);
        cancelAnimationFrame(frameId);
      }
    };

    const onPreference = () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(nextTimer);
      cancelAnimationFrame(frameId);
      setPhase("visible");
      if (preference.matches) setIndex(0);
      else scheduleNext();
    };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isDisposed = true;
      window.clearTimeout(exitTimer);
      window.clearTimeout(nextTimer);
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  const current = SCRIPT_NAMES[index] || SCRIPT_NAMES[0];

  return (
    <a
      className="wordmark"
      href="/#top"
      onClick={onClick}
      aria-label="Fayaz Shaik, back to top"
    >
      <span className="sr-only">Fayaz Shaik</span>
      <span className="wordmark-track" aria-hidden="true">
        <span
          className="wordmark-text"
          data-phase={phase}
          data-lang={current.lang}
          dir={current.dir || "ltr"}
          style={{
            fontFamily: current.fontFamily,
            fontWeight: current.fontWeight,
            fontSize: current.fontSize,
            letterSpacing: current.letterSpacing,
          }}
        >
          {current.name}
        </span>
        <span className="wordmark-dot">.</span>
      </span>
    </a>
  );
}
