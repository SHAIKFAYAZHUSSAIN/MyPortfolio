import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fayaz Shaik — Filmmaker × Developer × Vibecoder",
  description: "Turning ideas into experiences. Selected films, code projects and creative experiments by Fayaz Shaik.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}</body></html>;
}
