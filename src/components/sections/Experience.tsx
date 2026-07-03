import ScrollReveal from "../ScrollReveal";

const STATIC_EXPERIENCE = [
  {
    company: "Pixel Craft Agency",
    position: "Senior Full-Stack Engineer",
    period: "2024 - Present",
    description: [
      "Led development of core Next.js web portals generating optimized server-side responses under 100ms.",
      "Established Prisma and PostgreSQL database migrations improving application performance index metrics.",
      "Integrated secure credentials authorization systems safeguarding restricted user access paths.",
    ],
  },
  {
    company: "Alpha Cloud Tech",
    position: "Software Developer",
    period: "2022 - 2024",
    description: [
      "Built responsive dashboard tools with modular React interfaces and custom CSS styling parameters.",
      "Managed REST API routes and third-party webhook receivers for automated notification services.",
      "Coordinated with testing groups to ensure layout adherence to strict accessibility contrast targets.",
    ],
  },
];

interface ExperienceProps {
  experiences?: any[];
}

export default function Experience({ experiences = [] }: ExperienceProps) {
  // Format details
  const listToRender =
    experiences.length > 0
      ? experiences.map((exp) => {
          const startStr = new Date(exp.startDate).getFullYear().toString();
          const endStr = exp.endDate ? new Date(exp.endDate).getFullYear().toString() : "Present";
          
          const bullets = exp.description
            ? exp.description
                .split("\n")
                .map((line: string) => line.replace(/^-\s*/, "").trim())
                .filter((line: string) => line !== "")
            : [];

          return {
            company: exp.company,
            position: exp.position,
            period: `${startStr} - ${endStr}`,
            description: bullets.length > 0 ? bullets : ["No description details provided."],
          };
        })
      : STATIC_EXPERIENCE;

  return (
    <section id="experience" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Title with fluid sizes */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
            <div>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
                03 / History
              </span>
              <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
                Experience
              </h2>
              <div className="h-[2px] w-24 bg-primary mt-6" />
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Timeline Cards with enlarged visual scale */}
        <div className="lg:col-span-8 flex flex-col gap-14">
          {listToRender.map((exp, idx) => (
            <ScrollReveal
              key={exp.company + idx}
              direction="up"
              delay={idx * 0.08}
              duration={0.6}
              distance={20}
            >
              <div className="relative pl-8 sm:pl-12 border-l border-border-custom flex flex-col gap-4 group">
                {/* Timeline Bullet Anchor */}
                <div className="absolute left-[-8px] top-[6px] sm:top-[8px] w-4 h-4 rounded-full bg-border-custom border-2 border-background group-hover:bg-primary group-hover:scale-125 transition-all duration-300 shadow-sm" />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.position}
                  </h3>
                  <span className="font-mono text-xs sm:text-sm text-primary font-bold tracking-wider">{exp.period}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm uppercase text-muted-foreground tracking-widest font-bold">
                  {exp.company}
                </div>

                <ul className="list-disc list-outside pl-5 flex flex-col gap-3 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                  {exp.description.map((bullet: string, bIdx: number) => (
                    <li key={bIdx} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
