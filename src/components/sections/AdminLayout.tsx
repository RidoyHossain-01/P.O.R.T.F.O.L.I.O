"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  FileCode,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Timelines", href: "/admin/timelines", icon: GraduationCap },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border-custom px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm tracking-wider uppercase font-bold">Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 border border-border-custom rounded hover:bg-background"
            aria-label="Toggle Sidebar Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Frame - Responsive */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border-custom flex flex-col z-35 transition-transform duration-300 md:transform-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } pt-16 md:pt-0`}
      >
        {/* Desktop Logo Header */}
        <div className="hidden md:flex h-16 items-center gap-2 px-8 border-b border-border-custom">
          <FileCode className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm tracking-wider uppercase font-bold">Admin Panel</span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 font-mono text-xs uppercase tracking-wider">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg border transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-inner"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer actions */}
        <div className="p-4 border-t border-border-custom flex flex-col gap-2">
          <div className="hidden md:flex justify-between items-center px-4 mb-2">
            <span className="text-[10px] uppercase font-mono text-muted-foreground">Dark mode</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-lg border border-transparent font-mono text-xs uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace viewport */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
