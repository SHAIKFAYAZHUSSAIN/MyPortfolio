"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "./ui";

const links = [{ href: "/#work", label: "Work" }, { href: "/#lab", label: "Lab" }, { href: "/#about", label: "About" }, { href: "/#contact", label: "Contact" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); }
    }
    document.addEventListener("keydown", escape);
    const query = window.matchMedia("(min-width: 640px)");
    const close = () => setOpen(false);
    query.addEventListener("change", close);
    return () => { document.removeEventListener("keydown", escape); query.removeEventListener("change", close); };
  }, [open]);
  return <header className="site-header"><Container className="header-inner"><a className="wordmark" href="/#top" onClick={() => setOpen(false)} aria-label="Fayaz Shaik, back to top">Fayaz Shaik<span aria-hidden="true">.</span></a><span className="header-note">Independent perspective</span><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? "Close −" : "Menu +"}</button><nav id="primary-nav" aria-label="Primary navigation" className={open ? "navigation is-open" : "navigation"}>{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span aria-hidden="true">↗</span></a>)}</nav></Container></header>;
}


