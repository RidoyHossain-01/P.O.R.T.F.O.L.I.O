import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ridoy Hossain |  Full-Stack Developer Portfolio",
    template: "%s | Ridoy Hossain Portfolio"
  },
  description: "A handcrafted software engineer portfolio highlighting custom architectures, experiences, and technical expertise.",
  keywords: ["software engineer", "full stack developer", "next.js portfolio", "web developer portfolio", "react developer"],
  authors: [{ name: "Ridoy Hossain" }],
  creator: "Ridoy Hossain",
  metadataBase: new URL("https://ridoyhossain.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ridoy Hossain | Premium Full-Stack Developer Portfolio",
    description: "A handcrafted software engineer portfolio highlighting custom architectures, experiences, and technical expertise.",
    url: "https://ridoyhossain.dev",
    siteName: "Ridoy Hossain Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ridoy Hossain |  Full-Stack Developer Portfolio",
    description: "A handcrafted software engineer portfolio highlighting custom architectures, experiences, and technical expertise.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

