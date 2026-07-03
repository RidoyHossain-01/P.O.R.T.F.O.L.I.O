export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderGit2, Wrench, Mail, Calendar, ArrowRight } from "lucide-react";


export default async function AdminDashboardOverviewPage() {
  // Query actual metric counts directly from database
  const projectCount = await prisma.project.count();
  const skillCount = await prisma.skill.count();
  const experienceCount = await prisma.experience.count();
  const educationCount = await prisma.education.count();
  const unreadMessagesCount = await prisma.message.count({ where: { isRead: false } });
  
  const recentMessages = await prisma.message.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const settings = await prisma.settings.findFirst();

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold uppercase tracking-tight">System Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {settings?.fullName || "Administrator"}. Here is the current status of your portfolio.
        </p>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        {/* Projects Metric */}
        <div className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Projects</span>
            <FolderGit2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{projectCount}</span>
            <span className="text-[10px] uppercase text-muted-foreground">Created</span>
          </div>
        </div>

        {/* Skills Metric */}
        <div className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Skills</span>
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{skillCount}</span>
            <span className="text-[10px] uppercase text-muted-foreground">Assigned</span>
          </div>
        </div>

        {/* Timelines Metric */}
        <div className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Timelines</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{experienceCount + educationCount}</span>
            <span className="text-[10px] uppercase text-muted-foreground">Milestones</span>
          </div>
        </div>

        {/* Unread Messages Metric */}
        <div className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Unread Messages</span>
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{unreadMessagesCount}</span>
            <span className="text-[10px] uppercase text-muted-foreground">Inbox</span>
          </div>
        </div>
      </div>

      {/* Sub-Layout: Recent Messages and Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Left Column: Recent Messages */}
        <div className="lg:col-span-2 flex flex-col gap-4 border border-border-custom bg-card rounded-lg p-6">
          <div className="flex justify-between items-center border-b border-border-custom pb-4">
            <h2 className="text-md font-bold uppercase tracking-wide">Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="font-mono text-[10px] uppercase tracking-wider hover:text-primary flex items-center gap-1 transition-colors"
            >
              All Messages <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {recentMessages.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-8">
                Your mailbox is empty.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 border border-border-custom bg-background rounded flex flex-col gap-2"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold">{msg.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-primary">{msg.email}</span>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-sans">
                    {msg.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Account Status Details */}
        <div className="flex flex-col gap-4 border border-border-custom bg-card rounded-lg p-6">
          <div className="border-b border-border-custom pb-4">
            <h2 className="text-md font-bold uppercase tracking-wide">Workspace Profile</h2>
          </div>
          
          <div className="flex flex-col gap-4 text-xs font-sans mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase text-muted-foreground">Full Name</span>
              <span className="font-medium">{settings?.fullName || "Not configured"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase text-muted-foreground">Job Title</span>
              <span className="font-medium">{settings?.jobTitle || "Not configured"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase text-muted-foreground">Contact Email</span>
              <span className="font-medium">{settings?.contactEmail || "Not configured"}</span>
            </div>
            <Link
              href="/admin/settings"
              className="mt-4 w-full py-2 bg-foreground text-background font-mono text-xs uppercase text-center rounded hover:opacity-95 font-semibold"
            >
              Edit Settings
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
