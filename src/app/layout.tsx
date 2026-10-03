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

const splashPendingScript = `try{if(window.location.pathname==='/'&&!sessionStorage.getItem('portfolio_splash_seen')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.scrollY<=40&&!window.location.hash){document.documentElement.classList.add('splash-pending');window.setTimeout(()=>document.documentElement.classList.remove('splash-pending'),5000);}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=ZCOOL+KuaiLe&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: splashPendingScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
        <MotionDirector />
      </body>
    </html>
  );
}
