export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";
import { prisma } from "@/lib/prisma";

// Static mock data fallback for initial showcase items
const PROJECTS_DATA_FALLBACK: Record<
  string,
  {
    name: string;
    description: string;
    coverImage: string;
    techStack: string[];
    githubLink: string;
    liveDemoLink: string;
    challenges: string;
    futureImprovements: string;
    role: string;
    timeline: string;
  }
> = {
  "finance-analytics": {
    name: "Finance Analytics Dashboard",
    description:
      "A next-generation financial tracking and transaction intelligence portal. Designed for real-time monitoring of investments, transaction audits, and portfolio balances. It compiles thousands of records per second to deliver comprehensive analytics reports to users.",
    coverImage: "/project1.png",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    challenges:
      "Implementing real-time data streaming and WebSockets without degrading rendering pipelines was a challenge. Managed custom state caches in React to handle intensive updates and optimized rendering times under 12ms per event frame.",
    futureImprovements:
      "Integrating automated AI forecasting models to predict monthly budget excesses and automatically categorizing complex transaction statements.",
    role: "Lead Full-Stack Developer",
    timeline: "3 Months (Q1 2026)",
  },
  "code-workspace": {
    name: "Interactive Code Workspace",
    description:
      "A lightweight, web-based integrated development playground supporting multi-file editing, syntax highlighting, and live sandboxed previews. Built to aid coding educators in providing real-time code reviews and exercises.",
    coverImage: "/project2.png",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Monaco Editor", "Docker"],
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    challenges:
      "Sandboxing user-submitted JavaScript code securely without exposing sensitive browser cookies or session data. Solved this using isolated iframe layers and cross-origin security isolation policies.",
    futureImprovements:
      "Adding multi-user collaboration via WebRTC peer networks and integrated AI assistance modules for live code correction.",
    role: "Core Systems Engineer",
    timeline: "2 Months (Q2 2026)",
  },
  "motion-agency": {
    name: "Geometric Motion Website",
    description:
      "A premium 3D graphic design and layout showcasing portal. Utilizes WebGL, custom shader rendering, and inertial scroll-linked transformations to deliver an immersive narrative visual experience for a high-end creative agency.",
    coverImage: "/project3.png",
    techStack: ["Next.js", "Three.js", "React Three Fiber", "GSAP", "Lenis", "Tailwind CSS"],
    githubLink: "https://github.com",
    liveDemoLink: "https://example.com",
    challenges:
      "Optimizing complex GLTF mesh files and shader calculations to maintain a consistent 60 FPS on lower-end mobile devices. Implemented dynamic asset level-of-detail triggers and progressive canvas resolution scaling.",
    futureImprovements:
      "Adding full immersive VR/AR preview systems and dynamic audio feedback tied to cursor and scrolling timelines.",
    role: "Creative technologist",
    timeline: "1 Month (Q3 2026)",
  },
};

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  
  // 1. Query dynamic database projects
  let dbProject = await prisma.project.findUnique({
    where: { slug: resolvedParams.slug },
  });

  let projectToRender;

  if (dbProject) {
    projectToRender = {
      name: dbProject.name,
      description: dbProject.description,
      coverImage: dbProject.coverImage || "/project1.png",
      techStack: dbProject.techStack,
      githubLink: dbProject.githubLink || "#",
      liveDemoLink: dbProject.liveDemoLink || "#",
      challenges: dbProject.challenges || "No challenges details registered.",
      futureImprovements: dbProject.futureImprovements || "No future developments registered.",
      role: "Lead Full-Stack Developer", // Default field values
      timeline: "Dynamic",
    };
  } else {
    // 2. Fall back to static map if not found in db
    projectToRender = PROJECTS_DATA_FALLBACK[resolvedParams.slug];
  }

  if (!projectToRender) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Header bar - Spacious */}
      <header className="sticky top-0 z-50 w-full border-b border-border-custom bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-base tracking-[0.2em] uppercase font-bold hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            RH / PORTFOLIO
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container - Visual Scale Optimized */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-16">
        
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10 font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Title */}
        <div className="mb-10">
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block">
            Project Case Study
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            {projectToRender.name}
          </h1>
        </div>

        {/* Project Cover Image - Premium Rounded-2xl */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border-custom mb-16 bg-card shadow-lg">
          <Image
            src={projectToRender.coverImage}
            alt={projectToRender.name}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border-custom mb-16">
          {/* Column 1: Details */}
          <div className="md:col-span-4 flex flex-col gap-6 font-mono text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground uppercase tracking-widest block mb-2 font-bold text-[10px] sm:text-xs">
                Role / Scope
              </span>
              <span className="text-foreground font-sans font-semibold text-base">
                {projectToRender.role}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-widest block mb-2 font-bold text-[10px] sm:text-xs">
                Timeline
              </span>
              <span className="text-foreground font-sans font-semibold text-base">
                {projectToRender.timeline}
              </span>
            </div>
          </div>

          {/* Column 2: Tech Stack */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <span className="font-mono text-xs sm:text-sm text-muted-foreground uppercase tracking-widest block font-bold text-[10px] ">
              Technologies Used
            </span>
            <div className="flex flex-wrap gap-2.5">
              {projectToRender.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 text-xs font-mono rounded-lg bg-card border border-border-custom text-muted-foreground select-none"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Long Form Content */}
        <div className="flex flex-col gap-12 max-w-4xl text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
          {/* Section 1: Overview */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
              Project Overview
            </h2>
            <p>{projectToRender.description}</p>
          </section>

          {/* Section 2: Challenges */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
              Key Challenges & Resolutions
            </h2>
            <p>{projectToRender.challenges}</p>
          </section>

          {/* Section 3: Future Improvements */}
          <section className="flex flex-col gap-4 font-sans">
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
              Future Developments
            </h2>
            <p>{projectToRender.futureImprovements}</p>
          </section>

          {/* Links CTAs */}
          <div className="flex flex-wrap gap-4 pt-10 border-t border-border-custom">
            <a
              href={projectToRender.liveDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-[0.98] transition-all text-xs uppercase tracking-widest font-mono font-bold"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Live Site
            </a>
            <a
              href={projectToRender.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border border-border-custom bg-card text-foreground rounded-lg hover:bg-border-custom active:scale-[0.98] transition-all text-xs uppercase tracking-widest font-mono font-bold"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub Repository
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border-custom text-center text-xs sm:text-sm font-mono text-muted-foreground">
        &copy; {new Date().getFullYear()} RH Portfolio. Case studies section.
      </footer>
    </div>
  );
}
