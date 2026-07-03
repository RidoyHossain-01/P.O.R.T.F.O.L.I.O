"use client";

import Image from "next/image";
import { ArrowRight, Download, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/Icons";
import ScrollReveal from "../ScrollReveal";

interface HeroProps {
  fullName?: string | null;
  jobTitle?: string | null;
  profilePhotoUrl?: string | null;
  resumeUrl?: string | null;
  socialLinks?: any[];
}

export default function Hero({
  fullName,
  jobTitle,
  profilePhotoUrl,
  resumeUrl,
  socialLinks = [],
}: HeroProps) {
  const handleScrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (element) {
      const yOffset = -80; // Match header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <GithubIcon className="w-6 h-6" />;
      case "linkedin":
        return <LinkedinIcon className="w-6 h-6" />;
      case "whatsapp":
        return <WhatsappIcon className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Personal Copy and CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 text-left order-2 lg:order-1">
          {/* Small Availability Tag */}
          <ScrollReveal direction="right" delay={0.1} duration={0.6} distance={15}>
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary font-mono text-xs sm:text-sm uppercase tracking-widest w-fit select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Available for new projects
            </div>
          </ScrollReveal>

          {/* Heading with fluid typography */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <ScrollReveal direction="up" delay={0.2} duration={0.6} distance={20}>
              <h1 className="text-[clamp(2.2rem,5.5vw,4.8rem)] font-bold tracking-tight text-foreground leading-[1.08]">
                Hi, I&apos;m <span className="text-primary">{fullName || "Alex Mercer"}</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3} duration={0.6} distance={15}>
              <h2 className="text-[clamp(1.1rem,2.2vw,1.8rem)] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                {jobTitle || "Modern Full Stack Developer"}
              </h2>
            </ScrollReveal>
          </div>

          {/* Large Bio Intro Paragraph */}
          <ScrollReveal direction="up" delay={0.4} duration={0.6} distance={15}>
            <p className="text-[clamp(0.95rem,1.4vw,1.25rem)] text-muted-foreground leading-relaxed font-sans max-w-2xl">
              I shape high-performance database architectures and translate them into responsive, micro-animated digital interfaces. Dedicated to creating recruiter-friendly web applications that prioritize accessibility, semantic structures, and speed.
            </p>
          </ScrollReveal>

          {/* Sturdy CTA Buttons */}
          <ScrollReveal direction="up" delay={0.5} duration={0.6} distance={15}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4.5 mt-2">
              <button
                onClick={handleScrollToContact}
                className="inline-flex items-center justify-center gap-3 px-8 py-4.5 bg-foreground text-background hover:opacity-90 transition-all rounded-xl font-mono text-xs sm:text-sm uppercase tracking-widest font-bold cursor-pointer hover:translate-x-1 active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                Let&apos;s Connect
                <ArrowRight className="w-4 h-4" />
              </button>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4.5 border border-border-custom hover:border-primary hover:text-primary transition-all rounded-xl font-mono text-xs sm:text-sm uppercase tracking-widest font-bold bg-card shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Get Resume
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Social icons row below CTAs */}
          <ScrollReveal direction="up" delay={0.6} duration={0.6} distance={10}>
            <div className="flex items-center gap-6 mt-6 border-t border-border-custom/50 pt-6 text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground/80">Connect:</span>
              <div className="flex items-center gap-5">
                {socialLinks.length === 0 ? (
                  <>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:scale-115 transition-all duration-200"
                      aria-label="GitHub Profile"
                    >
                      <GithubIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:scale-115 transition-all duration-200"
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-6 h-6" />
                    </a>
                  </>
                ) : (
                  socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:scale-115 transition-all duration-200"
                      aria-label={link.platformName}
                    >
                      {renderSocialIcon(link.icon)}
                    </a>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Right Column: Large Professional Avatar Display */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <ScrollReveal direction="left" delay={0.3} duration={0.8} distance={30}>
            <div className="relative w-72 h-72 sm:w-[360px] sm:h-[360px] xl:w-[420px] xl:h-[420px] rounded-3xl overflow-hidden border border-border-custom bg-card shadow-2xl p-4">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border-custom/30">
                <Image
                  src={profilePhotoUrl || "/profile_placeholder.png"}
                  alt={fullName || "Developer Portrait"}
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, (max-width: 1200px) 360px, 420px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-100 hover:scale-103"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
