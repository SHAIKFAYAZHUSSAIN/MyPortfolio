export interface Film {
  slug: string;
  title: string;
  year: number;
  role: string;
  image: string;
  imageAlt: string;
  watchUrl: string;
  recognition: string;
  description: string;
  credits: { role: string; name: string }[];
  stills: { src: string; alt: string; caption?: string }[];
}

export interface CodeProject {
  slug: string;
  title: string;
  category: string;
  description: string;
  url: string;
  repositoryUrl?: string;
  technologies: string[];
  technologyScope?: string;
  image: string;
  imageAlt: string;
  visualCaption: string;
}

export interface Experiment {
  slug: string;
  title: string;
  category: "Film" | "Interfaces" | "Creative coding" | "AI experiments";
  description: string;
  status: "Exploring" | "Prototype" | "Released";
  publishedAt: string;
  url?: string;
  engine: "type-study" | "interference" | "signal-slice";
}

export const profile = {
  name: "Fayaz Shaik",
  tagline: "Turning ideas into experiences",
  email: "sfayazh15@gmail.com",
  college: "G Pulla Reddy Engineering College, Kurnool",
  graduationYear: 2028,
  socials: [
    { label: "GitHub", url: "https://github.com/SHAIKFAYAZHUSSAIN" },
    { label: "Instagram", url: "https://www.instagram.com/fayazshaik3024/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/fayazshaikhussain-cse" },
  ],
};

export const films: Film[] = [
  { slug: "dope", title: "DOPE", year: 2025, role: "Writer & Director", image: "/images/dope.jpg", imageAlt: "DOPE film artwork: a photographic collage of people looking at their phones", watchUrl: "https://youtu.be/bAgRQopBmPo", recognition: "First Prize / UDAAN 2k25 / College level", description: "A 2025 short film written and directed by Fayaz Shaik. Awarded first prize at UDAAN 2k25 at college level.", credits: [{ role: "Writer", name: "Fayaz Shaik" }, { role: "Director", name: "Fayaz Shaik" }], stills: [] },
  { slug: "one-last-dose", title: "One Last Dose", year: 2025, role: "Writer & Director", image: "/images/one-last-dose.jpg", imageAlt: "One Last Dose title in purple light on a black background", watchUrl: "https://youtu.be/M3Q4NO0KUMs", recognition: "First Prize / District level", description: "A 2025 short film written and directed by Fayaz Shaik. Awarded first prize at district level.", credits: [{ role: "Writer", name: "Fayaz Shaik" }, { role: "Director", name: "Fayaz Shaik" }], stills: [] },
  { slug: "spectre", title: "Spectre", year: 2025, role: "Writer & Director", image: "/images/spectre.jpg", imageAlt: "Spectre film artwork with a dramatically lit portrait and blue title", watchUrl: "https://youtu.be/4NWxP0tp5mk", recognition: "Independent film", description: "An independent short film from 2025, written and directed by Fayaz Shaik.", credits: [{ role: "Writer", name: "Fayaz Shaik" }, { role: "Director", name: "Fayaz Shaik" }], stills: [] },
];

export const projects: CodeProject[] = [
  { slug: "guidex", title: "GuideX", category: "Travel / Concept demo", description: "A travel guide that turns destination, budget and trip length into an itinerary concept. Built to make planning feel more approachable.", url: "https://guidex-lyart.vercel.app/", repositoryUrl: "https://github.com/SHAIKFAYAZHUSSAIN/guidex", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"], image: "/images/projects/guidex.webp", imageAlt: "GuideX live interface with the headline Travel Different Not Harder and yellow editorial typography", visualCaption: "GuideX / Travel planning concept" },
  { slug: "cityflow", title: "CityFlow", category: "Urban networks", description: "Hyderabad Urban Corridor Network. An interface for exploring corridor traffic, commuter navigation and infrastructure planning.", url: "https://cityflow-dqv8.onrender.com/", technologies: ["HTML", "CSS", "JavaScript"], technologyScope: "Front end", image: "/images/projects/cityflow.webp", imageAlt: "CityFlow executive mission control interface showing the Hyderabad Urban Corridor Network and operational portals", visualCaption: "CityFlow / Mission control interface" },
  { slug: "maanaksetu", title: "MaanakSetu", category: "SIH / Standards intelligence", description: "Analyzes tender requirements and maps them to applicable Indian Standards, allied references, certifications and regulatory requirements.", url: "https://maanaksetu.vercel.app/", repositoryUrl: "https://github.com/SHAIKFAYAZHUSSAIN/MaanakSetu", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"], image: "/images/projects/maanaksetu.webp", imageAlt: "MaanakSetu public demo workspace for turning procurement requirements into standards-ready specifications", visualCaption: "MaanakSetu / Public demo workspace" },
];

export const experiments: Experiment[] = [
  { slug: "type-study", engine: "type-study", title: "Type, untamed.", category: "Interfaces", description: "A phrase becomes a form. Bend the baseline, open the spacing, and make it your own.", status: "Prototype", publishedAt: "2026-10-02" },
  { slug: "interference", engine: "interference", title: "Between the lines.", category: "Creative coding", description: "A field of lines shaped by overlapping waves. Change the density, find a pattern, let it move.", status: "Prototype", publishedAt: "2026-10-02" },
  { slug: "signal-slice", engine: "signal-slice", title: "Signal / self.", category: "Creative coding", description: "A portrait pulled into horizontal fragments. Explore the point where an image becomes a signal.", status: "Prototype", publishedAt: "2026-10-02" },
];
