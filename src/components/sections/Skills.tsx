import ScrollReveal from "../ScrollReveal";

const STATIC_SKILLS = [
  {
    category: "Frontend",
    skills: ["Next.js", "React 19", "Tailwind CSS", "HTML5", "CSS3", "Radix UI"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "Auth.js (NextAuth)", "Prisma ORM", "REST APIs"],
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "Neon DB", "MySQL", "Redis"],
  },
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL"],
  },
  {
    category: "Tools",
    skills: ["Git / GitHub", "Docker", "Cloudinary", "Resend", "npm / Yarn"],
  },
  {
    category: "AI",
    skills: ["Gemini Developer API", "Prompt Engineering", "Vector DBs", "LangChain"],
  },
  {
    category: "DevOps",
    skills: ["Vercel", "AWS S3", "GitHub Actions", "CI / CD Pipelines"],
  },
];

interface SkillsProps {
  categories?: any[];
}

export default function Skills({ categories = [] }: SkillsProps) {
  // Determine source list
  const listToRender =
    categories.length > 0
      ? categories.map((cat) => ({
          category: cat.name,
          skills: cat.skills ? cat.skills.map((s: any) => s.name) : [],
        }))
      : STATIC_SKILLS;

  return (
    <section id="skills" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 flex flex-col gap-16">
        
        {/* Title Block with fluid scale */}
        <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
          <div>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
              02 / Expertise
            </span>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
              Technical Skills
            </h2>
            <div className="h-[2px] w-24 bg-primary mt-6" />
          </div>
        </ScrollReveal>

        {/* Categories Grid with Staggered Scroll Reveal & Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {listToRender.map((item, idx) => (
            <ScrollReveal
              key={item.category}
              direction="up"
              delay={(idx % 3) * 0.08}
              duration={0.6}
              distance={20}
            >
              <div className="border border-border-custom bg-card rounded-2xl p-8 sm:p-10 flex flex-col gap-6 hover:border-primary hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 h-full shadow-sm">
                <h3 className="font-mono text-sm sm:text-base uppercase tracking-widest text-primary font-bold border-b border-border-custom/50 pb-4">
                  {item.category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {item.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-background border border-border-custom hover:border-primary hover:text-primary transition-all duration-200 select-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
