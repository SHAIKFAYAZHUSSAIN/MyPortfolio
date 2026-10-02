import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function Section({ id, children, className = "", labelledBy }: { id: string; children: ReactNode; className?: string; labelledBy: string }) {
  return <section id={id} className={`section ${className}`} aria-labelledby={labelledBy}><Container>{children}</Container></section>;
}

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

type ActionLinkProps = ComponentProps<"a"> & { variant?: "text" | "outline" | "solid"; external?: boolean };
export function ActionLink({ children, variant = "text", external = false, className = "", ...props }: ActionLinkProps) {
  return <a {...props} className={`action action--${variant} ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}<Arrow />{external && <span className="sr-only"> (opens in a new tab)</span>}</a>;
}

export function MediaFrame({ src, alt, portrait = false, priority = false, sizes }: { src: string; alt: string; portrait?: boolean; priority?: boolean; sizes?: string }) {
  return <div className={`media-frame${portrait ? " media-frame--portrait" : ""}`}><Image src={src} alt={alt} fill priority={priority} sizes={sizes ?? "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1567px) calc(100vw - 128px), 1440px"} /></div>;
}

export function SectionHeading({ index, eyebrow, title, id, children }: { index: string; eyebrow: string; title: ReactNode; id: string; children?: ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow"><span className="index">{index}</span>{eyebrow}</p><h2 id={id}>{title}</h2></div>{children && <div className="section-intro">{children}</div>}</div>;
}
