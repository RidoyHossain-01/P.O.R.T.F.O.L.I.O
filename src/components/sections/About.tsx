import ScrollReveal from "../ScrollReveal";

interface AboutProps {
  aboutMe?: string | null;
}

export default function About({ aboutMe }: AboutProps) {
  return (
    <section id="about" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Title Section */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
            <div>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
                01 / Background
              </span>
              <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
                About Me
              </h2>
              <div className="h-[2px] w-24 bg-primary mt-6" />
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Bio Narrative and Values */}
        <div className="lg:col-span-8 flex flex-col gap-10 text-muted-foreground leading-relaxed">
          <ScrollReveal direction="up" delay={0.2} duration={0.8} distance={20}>
            {aboutMe ? (
              <p className="whitespace-pre-line text-foreground font-semibold text-[clamp(1.1rem,2vw,1.6rem)] leading-relaxed">
                {aboutMe}
              </p>
            ) : (
              <div className="flex flex-col gap-8 text-[clamp(0.95rem,1.4vw,1.15rem)]">
                {/* Impactful opening sentence */}
                <p className="text-foreground font-semibold text-[clamp(1.2rem,2.4vw,1.8rem)] leading-[1.3] font-sans">
                  I write clean code that scales. I believe in software crafted with mathematical precision, accessible structures, and lightning-fast loading speeds.
                </p>
                
                {/* Secondary details */}
                <p className="leading-relaxed">
                  I look at software engineering as a digital workshop. Every component, database schema connection, API request, and micro-animation is hand-refined to fulfill a specific functional purpose. I balance speed, aesthetics, and usability to design digital products that leave a lasting impression.
                </p>
                <p className="leading-relaxed">
                  With a background spanning both frontend layout logic and backend databases, I construct systems that are cohesive from database queries to browser render frames. I respect layout guidelines, keyboard focus traps, and media queries like reduced motion to build websites that are truly inclusive.
                </p>
              </div>
            )}
          </ScrollReveal>

          {/* Quick value grids - Premium layout */}
          <ScrollReveal direction="up" delay={0.3} duration={0.8} distance={20}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-border-custom font-mono text-xs uppercase mt-6">
              <div className="border border-border-custom bg-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <span className="text-primary text-sm font-bold block mb-2">Accessibility First</span>
                <p className="text-xs text-muted-foreground font-sans normal-case leading-relaxed">
                  Building with native semantic HTML tags, keyboard navigation, and aria parameters so pages remain fully navigable for all users.
                </p>
              </div>
              <div className="border border-border-custom bg-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <span className="text-primary text-sm font-bold block mb-2">Optimized Execution</span>
                <p className="text-xs text-muted-foreground font-sans normal-case leading-relaxed">
                  Eliminating layout shifts (CLS), lazy-loading assets, and minifying bundle payloads to sustain exceptional performance scoreboards.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
