import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { MotionDirector } from "@/components/motion-director";
import "./globals.css";
import "./art-direction.css";
import "./motion.css";

export const metadata: Metadata = {
  title: "Fayaz Shaik — Filmmaker × Developer × Vibecoder",
  description: "Turning ideas into experiences. Selected films, code projects and creative experiments by Fayaz Shaik.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<MotionDirector /></body></html>;
}
