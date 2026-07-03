import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const STATIC_PROJECTS = [
  {
    name: "Finance Analytics Dashboard",
    slug: "finance-analytics",
    description: "A next-generation financial tracking and transaction intelligence portal with dynamic charting.",
    image: "/project1.png",
    tags: ["Next.js", "React", "PostgreSQL", "Prisma"],
  },
  {
    name: "Interactive Code Workspace",
    slug: "code-workspace",
    description: "A lightweight, web-based integrated development playground supporting live sandboxed previews.",
    image: "/project2.png",
    tags: ["TypeScript", "Tailwind CSS", "Monaco Editor"],
  },
  {
    name: "Geometric Motion Website",
    slug: "motion-agency",
    description: "A premium 3D design and layout showcase using scroll-linked spatial transformations.",
    image: "/project3.png",
    tags: ["Three.js", "WebGL", "GSAP", "Lenis"],
  },
];

interface ProjectsProps {
  projects?: any[];
}

export default function Projects({ projects = [] }: ProjectsProps) {
  // Format database items if they exist
  const listToRender =
    projects.length > 0
      ? projects.map((p) => ({
          name: p.name,
          slug: p.slug,
          description: p.description,
          image: p.coverImage || "/project1.png",
          tags: p.techStack || [],
        }))
      : STATIC_PROJECTS;

  return (
    <section id="projects" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 flex flex-col gap-16">
        
        {/* Header Block */}
        <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
          <div className="flex justify-between items-end border-b border-border-custom/50 pb-6">
            <div>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
                05 / Portfolio
              </span>
              <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
                Featured Projects
              </h2>
              <div className="h-[2px] w-24 bg-primary mt-6" />
            </div>
            <span className="hidden lg:block font-mono text-xs sm:text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Case Studies: {listToRender.length} Published
            </span>
          </div>
        </ScrollReveal>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {listToRender.map((proj, idx) => (
            <ScrollReveal
              key={proj.slug}
              direction="up"
              delay={(idx % 3) * 0.08}
              duration={0.6}
              distance={20}
              className="flex"
            >
              <Link
                href={`/projects/${proj.slug}`}
                className="group flex flex-col border border-border-custom bg-card rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex-1 shadow-sm"
              >
                {/* Card Image Container (Larger Scale Aspect ratio) */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-background border-b border-border-custom/30">
                  <Image
                    src={proj.image}
                    alt={proj.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-background/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                </div>

                {/* Card Content - Generous Spacing */}
                <div className="p-8 sm:p-10 flex flex-col gap-6 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-xl sm:text-2xl leading-tight group-hover:text-primary transition-colors font-sans text-foreground">
                      {proj.name}
                    </h3>
                    <div className="p-2.5 rounded-full border border-border-custom/80 group-hover:border-primary group-hover:bg-primary/5 transition-all shrink-0">
                      <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-foreground group-hover:text-primary" />
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans flex-1">
                    {proj.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 pt-5 border-t border-border-custom/50">
                    {proj.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-background border border-border-custom text-muted-foreground select-none hover:text-primary hover:border-primary/45 transition-colors duration-250"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
