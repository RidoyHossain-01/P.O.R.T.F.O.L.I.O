export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default async function Home() {
  // Query database entries concurrently for optimal load performance
  const [settings, resume, socialLinks, skillCategories, experiences, educations, projects] = await Promise.all([
    prisma.settings.findFirst(),
    prisma.resume.findFirst({ where: { isActive: true } }),
    prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: { skills: { orderBy: { order: "asc" } } },
    }),
    prisma.experience.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.education.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main landing segments */}
      <main className="flex-1">
        <Hero
          fullName={settings?.fullName}
          jobTitle={settings?.jobTitle}
          profilePhotoUrl={settings?.profilePhotoUrl}
          resumeUrl={resume?.url}
          socialLinks={socialLinks}
        />
        <About aboutMe={settings?.aboutMe} />
        <Skills categories={skillCategories} />
        <Experience experiences={experiences} />
        <Education educations={educations} />
        <Projects projects={projects} />
        <Contact
          contactEmail={settings?.contactEmail}
          socialLinks={socialLinks}
        />
      </main>

      {/* Document Footer */}
      <footer className="py-24 border-t border-border-custom bg-card text-center text-xs sm:text-sm font-mono text-muted-foreground transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="tracking-wide">
            &copy; {new Date().getFullYear()} {settings?.fullName || "Alex Mercer"}. Designed & Crafted with pride.
          </div>
          <div className="flex gap-6 uppercase tracking-widest text-[10px] sm:text-xs">
            <a href="#about" className="hover:text-primary transition-colors py-1">Top</a>
            <a href="/login" className="hover:text-primary transition-colors py-1">Admin Panel</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
