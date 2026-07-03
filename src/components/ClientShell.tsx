"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import SmoothScroll from "./SmoothScroll";
import { ThemeProvider } from "./ThemeProvider";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease" }}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </div>
    </ThemeProvider>
  );
}
