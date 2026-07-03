import ScrollReveal from "../ScrollReveal";

const STATIC_EDUCATION = [
  {
    institution: "Tech State University",
    degree: "Bachelor of Science in Computer Science",
    period: "2018 - 2022",
    details: "Specialized in software engineering principles, databases, and network architectures.",
  },
  {
    institution: "Core Academy",
    degree: "Advanced Software Boot camp Certifications",
    period: "2022",
    details: "Intensive training program focusing on full-stack React systems and server deployments.",
  },
];

interface EducationProps {
  educations?: any[];
}

export default function Education({ educations = [] }: EducationProps) {
  const listToRender =
    educations.length > 0
      ? educations.map((edu) => {
          const startStr = new Date(edu.startDate).getFullYear().toString();
          const endStr = edu.endDate ? new Date(edu.endDate).getFullYear().toString() : "Present";
          
          return {
            institution: edu.institution,
            degree: edu.degree,
            period: `${startStr} - ${endStr}`,
            details: edu.description || `${edu.fieldOfStudy || "Technical Studies"}.`,
          };
        })
      : STATIC_EDUCATION;

  return (
    <section id="education" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Title */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
            <div>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
                04 / Credentials
              </span>
              <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
                Education
              </h2>
              <div className="h-[2px] w-24 bg-primary mt-6" />
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Timeline Cards */}
        <div className="lg:col-span-8 flex flex-col gap-14">
          {listToRender.map((edu, idx) => (
            <ScrollReveal
              key={edu.institution + idx}
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
                    {edu.degree}
                  </h3>
                  <span className="font-mono text-xs sm:text-sm text-primary font-bold tracking-wider">{edu.period}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm uppercase text-muted-foreground tracking-widest font-bold">
                  {edu.institution}
                </div>

                <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                  {edu.details}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
