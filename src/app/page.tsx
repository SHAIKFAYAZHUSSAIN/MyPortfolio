import { MotionText } from "@/components/motion-text";
import { LabSection } from "@/components/lab/lab-section";
import { CodeArchive } from "@/components/code-archive";
import { FilmArchive } from "@/components/film-archive";
import { CinematicHero } from "@/components/cinematic-hero";
import { ActionLink, Container, MediaFrame, Section } from "@/components/ui";
import { films, profile, projects } from "@/data/portfolio";

export default function Home() {
  return <><main id="main">
    <CinematicHero />

    <FilmArchive films={films} />

    <CodeArchive projects={projects} githubUrl={profile.socials[0].url} />

    <LabSection />

    <Section id="about" labelledBy="about-heading" className="about-section"><div className="about-layout"><div className="portrait-column"><MediaFrame src="/images/fayaz.png" alt="Fayaz Shaik wearing a dark shirt and sunglasses, lit against a dark background" portrait sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 42vw, 560px" /><p className="metadata portrait-caption">Fayaz Shaik / Behind the work</p></div><div className="about-copy"><p className="eyebrow"><span className="index">04</span>About</p><h2 id="about-heading"><MotionText calm>Film.<br />Code.<br /><em>Curiosity.</em></MotionText></h2><span className="section-rule" aria-hidden="true" /><p className="about-manifesto metadata">One curiosity. Different mediums.</p><p className="about-lead">I’m Fayaz. I write and direct films, build digital projects, and explore where the two meet.</p><p className="muted">Filmmaker × Developer × Vibecoder. Turning ideas into experiences, one project at a time.</p><div className="education"><p className="eyebrow">Currently studying</p><p>{profile.college}</p><span className="metadata">Expected graduation / {profile.graduationYear}</span></div><ActionLink href={profile.socials[2].url} external>Connect on LinkedIn</ActionLink></div></div></Section>

    <Section id="contact" labelledBy="contact-heading" className="contact-section"><p className="eyebrow"><span className="index">05</span>The next scene</p><span className="section-rule" aria-hidden="true" /><div className="contact-heading"><h2 id="contact-heading"><MotionText calm>Let&apos;s make<br /><em>something.</em></MotionText></h2><a data-cursor="TALK" className="contact-arrow" href={`mailto:${profile.email}`} aria-label={`Email Fayaz at ${profile.email}`}>↗</a></div><a data-cursor="TALK" className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><div className="contact-bottom"><p>Start with a conversation.</p><div className="social-links">{profile.socials.map(social => <ActionLink href={social.url} external key={social.label}>{social.label}</ActionLink>)}</div></div></Section>
  </main><footer className="site-footer"><Container className="footer-inner"><span>© {new Date().getFullYear()} Fayaz Shaik</span><span>Film × Code × Experiments</span><a href="#top">Back to top ↑</a></Container></footer></>;
}




