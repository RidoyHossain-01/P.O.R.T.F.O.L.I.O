"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks = useMemo(
    () => [
      { name: "About", id: "about" },
      { name: "Skills", id: "skills" },
      // { name: "Experience", id: "experience" },
      { name: "Projects", id: "projects" },
      { name: "Contact", id: "contact" },
    ],
    []
  );

  // Track active section on scroll
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300; // Trigger threshold

      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
            break;
          }
        }
      }

      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, navLinks]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      setMobileMenuOpen(false);
      const element = document.getElementById(id);
      const header = document.querySelector("header");
      if (element) {
        const headerHeight = header ? header.offsetHeight : 80;
        const yOffset = -headerHeight - 20; // safe breathing room offset
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-custom bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-20 sm:h-24 flex items-center justify-between">
        
        {/* Brand Logo - Premium font scale */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-mono text-sm sm:text-base tracking-[0.25em] uppercase font-bold hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1"
        >
          RH / PORTFOLIO
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`relative py-2 hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded ${
                activeSection === link.id ? "text-foreground font-bold" : ""
              }`}
            >
              {link.name}
              {/* Premium underbar hover animation */}
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                activeSection === link.id ? "scale-x-100" : ""
              }`} />
            </a>
          ))}
          <Link
            href="/login"
            className="px-5 py-2.5 border border-border-custom hover:border-primary hover:text-foreground transition-all rounded-lg font-bold"
          >
            Admin
          </Link>
        </nav>

        {/* Theme Toggle & Mobile Action Button */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-foreground hover:text-primary focus-visible:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Interactive Scroll Progress Indicator bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2.5px] bg-primary transition-all duration-100 ease-out origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile Drawer Menu - Full Screen Overlay */}
      <div
        className={`fixed inset-0 top-20 sm:top-24 z-40 w-full h-[calc(100vh-80px)] bg-background/95 backdrop-blur-xl border-t border-border-custom md:hidden flex flex-col justify-between p-8 transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-6 font-mono text-lg uppercase tracking-widest text-muted-foreground pt-4">
          {navLinks.map((link, idx) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`py-3 hover:text-primary transition-colors flex items-center justify-between border-b border-border-custom/30 ${
                activeSection === link.id ? "text-primary font-bold pl-2 border-l-2 border-primary" : ""
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span>{link.name}</span>
              <span className="text-[10px] opacity-40">0{idx + 1}</span>
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 w-full text-center py-4 border border-border-custom hover:border-primary hover:text-primary transition-colors rounded-xl font-bold font-mono text-sm uppercase tracking-wider"
          >
            Admin Dashboard
          </Link>
        </nav>
        
        {/* Drawer Footer details */}
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 text-center pb-8">
          AM / WORKSHOP &copy; {new Date().getFullYear()}
        </div>
      </div>
    </header>
  );
}
