"use client";

import { useState, FormEvent } from "react";
import { Mail, Send, CheckCircle2, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/Icons";
import { submitContactMessage } from "@/app/admin/actions";
import ScrollReveal from "../ScrollReveal";

interface ContactProps {
  contactEmail?: string | null;
  socialLinks?: any[];
}

export default function Contact({ contactEmail, socialLinks = [] }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactMessage({
        name,
        email,
        content: message,
      });

      setSending(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to deliver message. Please try again.");
      setSending(false);
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <GithubIcon className="w-5 h-5 text-muted-foreground" />;
      case "linkedin":
        return <LinkedinIcon className="w-5 h-5 text-muted-foreground" />;
      case "whatsapp":
        return <WhatsappIcon className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Globe className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <section id="contact" className="py-24 border-b border-border-custom bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 flex flex-col gap-16">
        
        {/* Section Heading */}
        <ScrollReveal direction="right" delay={0.1} duration={0.8} distance={25}>
          <div>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 block font-bold">
              06 / Connect
            </span>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight uppercase leading-none text-foreground">
              Get in Touch
            </h2>
            <div className="h-[2px] w-24 bg-primary mt-6" />
          </div>
        </ScrollReveal>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Communication Spotlights (Rami Mizyed inspired style) */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            <ScrollReveal direction="right" delay={0.2} duration={0.8} distance={20}>
              <div className="flex flex-col gap-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Send an email
                </h3>
                <a
                  href={`mailto:${contactEmail || "alex.mercer@domain.com"}`}
                  className="text-[clamp(1.2rem,2.8vw,2.2rem)] font-bold tracking-tight text-foreground hover:text-primary transition-colors break-all font-sans block leading-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                >
                  {contactEmail || "alex.mercer@domain.com"}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3} duration={0.8} distance={20}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-md">
                Have an interesting opening, a design challenge, or want to build a premium web application together? Shoot me an email or use this form. I generally reply within 24 hours.
              </p>
            </ScrollReveal>

            {/* Social channels cleanly listed beside it */}
            <ScrollReveal direction="right" delay={0.4} duration={0.8} distance={15}>
              <div className="flex flex-col gap-4 pt-8 border-t border-border-custom max-w-md">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Follow my work
                </h3>
                <div className="grid grid-cols-2 gap-6 text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground">
                  {socialLinks.length === 0 ? (
                    <>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1"
                      >
                        <GithubIcon className="w-5 h-5 text-muted-foreground" />
                        GitHub
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1"
                      >
                        <LinkedinIcon className="w-5 h-5 text-muted-foreground" />
                        LinkedIn
                      </a>
                    </>
                  ) : (
                    socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1"
                      >
                        {renderSocialIcon(link.icon)}
                        {link.platformName}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interaction Form - Premium Minimalist */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="left" delay={0.2} duration={0.8} distance={20}>
              <div className="border border-border-custom bg-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-sm">
                {success && (
                  <div className="flex items-center gap-3 border border-green-500/20 bg-green-500/10 text-green-500 rounded-xl p-5 text-xs mb-8 font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Message received successfully!</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 text-red-500 rounded-xl p-5 text-xs mb-8 font-mono uppercase tracking-wider">
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs uppercase">
                    <label htmlFor="form-name" className="text-muted-foreground font-bold">Your Name</label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 text-sm sm:text-base bg-background border border-border-custom rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans normal-case text-foreground"
                      disabled={sending}
                    />
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs uppercase">
                    <label htmlFor="form-email" className="text-muted-foreground font-bold">Email Address</label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 text-sm sm:text-base bg-background border border-border-custom rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans normal-case text-foreground"
                      disabled={sending}
                    />
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs uppercase">
                    <label htmlFor="form-message" className="text-muted-foreground font-bold">Message</label>
                    <textarea
                      id="form-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let's build a premium portfolio together..."
                      className="w-full px-4 py-3.5 text-sm sm:text-base bg-background border border-border-custom rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans normal-case resize-none text-foreground"
                      disabled={sending}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 mt-2 bg-foreground text-background hover:bg-foreground/90 transition-all rounded-xl flex items-center justify-center gap-3 cursor-pointer text-xs sm:text-sm uppercase tracking-widest font-mono font-bold shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
