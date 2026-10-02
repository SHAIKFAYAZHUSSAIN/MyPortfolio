"use client";

import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "./ui";

export function FilmPlayer({ title, image, imageAlt, watchUrl }: { title: string; image: string; imageAlt: string; watchUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const videoId = new URL(watchUrl).pathname.slice(1);
  useEffect(() => { if (playing) iframe.current?.focus(); }, [playing]);
  return <div className="film-player">{playing ? <iframe ref={iframe} src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`} title={`Watch ${title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="film-player-launch" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}><MediaFrame src={image} alt={imageAlt} /><span className="film-player-label"><span aria-hidden="true">▷</span> Play {title}</span></button>}</div>;
}
