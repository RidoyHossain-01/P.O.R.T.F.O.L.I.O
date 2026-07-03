"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-2 rounded-full border border-border-custom bg-card text-foreground transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-[#d4af37] transition-transform duration-500 rotate-0" />
        ) : (
          <Moon className="w-5 h-5 text-[#8a7355] transition-transform duration-500 rotate-0" />
        )}
      </div>
    </button>
  );
}
