"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

// Helper to enforce authorization
async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized access. Session not found.");
  }
  return session;
}

// ----------------------------------------------------
// 1. Settings / Profile Actions
// ----------------------------------------------------
export async function getSettings() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.settings.create({
      data: {
        id: "global_settings",
        fullName: "Alex Mercer",
        jobTitle: "Modern Full Stack Developer",
        aboutMe: "Building fast, accessible, and responsive web products.",
        contactEmail: "alex.mercer@domain.com",
      },
    });
  }
  return settings;
}

export async function updateSettings(data: {
  fullName?: string;
  jobTitle?: string;
  aboutMe?: string;
  contactEmail?: string;
  profilePhotoUrl?: string;
}) {
  await requireAuth();
  const settings = await prisma.settings.update({
    where: { id: "global_settings" },
    data,
  });
  revalidatePath("/");
  return settings;
}

import fs from "fs/promises";
import path from "path";

// Real uploader action for resume PDF & profile photo
export async function uploadFileAction(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = file.name.replace(/\s+/g, "_");
  const uniqueFileName = `${Date.now()}_${fileName}`;
  const filePath = path.join(uploadsDir, uniqueFileName);

  await fs.writeFile(filePath, buffer);

  const finalUrl = `/uploads/${uniqueFileName}`;
  return { url: finalUrl, success: true };
}

// ----------------------------------------------------
// 2. Skill Categories CRUD
// ----------------------------------------------------
export async function getSkillCategories() {
  return prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
}

export async function createSkillCategory(data: { name: string; order: number }) {
  await requireAuth();
  const cat = await prisma.skillCategory.create({ data });
  revalidatePath("/");
  return cat;
}

export async function updateSkillCategory(id: string, data: { name?: string; order?: number }) {
  await requireAuth();
  const cat = await prisma.skillCategory.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return cat;
}

export async function deleteSkillCategory(id: string) {
  await requireAuth();
  const cat = await prisma.skillCategory.delete({ where: { id } });
  revalidatePath("/");
  return cat;
}

// ----------------------------------------------------
// 3. Skills CRUD
// ----------------------------------------------------
export async function createSkill(data: { name: string; categoryId: string; order: number }) {
  await requireAuth();
  const skill = await prisma.skill.create({ data });
  revalidatePath("/");
  return skill;
}

export async function updateSkill(id: string, data: { name?: string; categoryId?: string; order?: number }) {
  await requireAuth();
  const skill = await prisma.skill.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return skill;
}

export async function deleteSkill(id: string) {
  await requireAuth();
  const skill = await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  return skill;
}

// ----------------------------------------------------
// 4. Experience CRUD
// ----------------------------------------------------
export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createExperience(data: {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string;
  order: number;
}) {
  await requireAuth();
  const exp = await prisma.experience.create({ data });
  revalidatePath("/");
  return exp;
}

export async function updateExperience(
  id: string,
  data: {
    company?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date | null;
    description?: string;
    order?: number;
  }
) {
  await requireAuth();
  const exp = await prisma.experience.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return exp;
}

export async function deleteExperience(id: string) {
  await requireAuth();
  const exp = await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  return exp;
}

// ----------------------------------------------------
// 5. Education CRUD
// ----------------------------------------------------
export async function getEducations() {
  return prisma.education.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createEducation(data: {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string;
  order: number;
}) {
  await requireAuth();
  const edu = await prisma.education.create({ data });
  revalidatePath("/");
  return edu;
}

export async function updateEducation(
  id: string,
  data: {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date | null;
    description?: string;
    order?: number;
  }
) {
  await requireAuth();
  const edu = await prisma.education.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return edu;
}

export async function deleteEducation(id: string) {
  await requireAuth();
  const edu = await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  return edu;
}

// ----------------------------------------------------
// 6. Projects CRUD
// ----------------------------------------------------
export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createProject(data: {
  name: string;
  slug: string;
  coverImage?: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveDemoLink?: string;
  challenges?: string;
  futureImprovements?: string;
  isPublished?: boolean;
  order: number;
}) {
  await requireAuth();
  const proj = await prisma.project.create({ data });
  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  return proj;
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    slug?: string;
    coverImage?: string;
    description?: string;
    techStack?: string[];
    githubLink?: string;
    liveDemoLink?: string;
    challenges?: string;
    futureImprovements?: string;
    isPublished?: boolean;
    order?: number;
  }
) {
  await requireAuth();
  const proj = await prisma.project.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  if (data.slug) {
    revalidatePath(`/projects/${data.slug}`);
  }
  return proj;
}

export async function deleteProject(id: string) {
  await requireAuth();
  const proj = await prisma.project.findUnique({ where: { id } });
  const result = await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  if (proj) {
    revalidatePath(`/projects/${proj.slug}`);
  }
  return result;
}

// ----------------------------------------------------
// 7. Social Links CRUD
// ----------------------------------------------------
export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    orderBy: { displayOrder: "asc" },
  });
}

export async function createSocialLink(data: {
  platformName: string;
  icon: string;
  url: string;
  displayOrder: number;
  isVisible?: boolean;
}) {
  await requireAuth();
  const link = await prisma.socialLink.create({ data });
  revalidatePath("/");
  return link;
}

export async function updateSocialLink(
  id: string,
  data: {
    platformName?: string;
    icon?: string;
    url?: string;
    displayOrder?: number;
    isVisible?: boolean;
  }
) {
  await requireAuth();
  const link = await prisma.socialLink.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return link;
}

export async function deleteSocialLink(id: string) {
  await requireAuth();
  const link = await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
  return link;
}

// ----------------------------------------------------
// 8. Contact Messages CRUD
// ----------------------------------------------------
export async function getMessages() {
  await requireAuth();
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageAsRead(id: string) {
  await requireAuth();
  const msg = await prisma.message.update({
    where: { id },
    data: { isRead: true },
  });
  return msg;
}

export async function deleteMessage(id: string) {
  await requireAuth();
  const msg = await prisma.message.delete({ where: { id } });
  return msg;
}

// ----------------------------------------------------
// 9. Resume management
// ----------------------------------------------------
export async function getActiveResume() {
  return prisma.resume.findFirst({
    where: { isActive: true },
  });
}

export async function updateResumeUrl(url: string) {
  await requireAuth();
  
  // Set all current resumes to inactive
  await prisma.resume.updateMany({
    data: { isActive: false },
  });

  const resume = await prisma.resume.create({
    data: {
      url,
      isActive: true,
    },
  });
  revalidatePath("/");
  return resume;
}

// ----------------------------------------------------
// 10. Admin Password update
// ----------------------------------------------------
import bcrypt from "bcryptjs";
export async function updateAdminPassword(password: string) {
  const session = await requireAuth();
  if (!session.user?.email) {
    throw new Error("No admin email in session");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  return { success: true };
}

// ----------------------------------------------------
// 11. Public Contact Form Action
// ----------------------------------------------------
export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  content: string;
}) {
  const msg = await prisma.message.create({
    data,
  });

  // Send email notification to the administrator via Resend
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (resendApiKey && receiverEmail) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Portfolio Form <onboarding@resend.dev>",
        to: receiverEmail,
        replyTo: data.email,
        subject: `New Portfolio Contact — ${data.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <p style="margin-top: 0; font-weight: bold;">New portfolio message received</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
            <p><strong>Name:</strong><br/>${data.name}</p>
            <p><strong>Email:</strong><br/>${data.email}</p>
            <p><strong>Subject:</strong><br/>${data.subject || "No Subject"}</p>
            <p><strong>Message:</strong><br/>${data.content.replace(/\n/g, "<br/>")}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
          </div>
        `,
      });
    } else {
      console.warn("Resend email notification skipped: RESEND_API_KEY or CONTACT_RECEIVER_EMAIL environment variables are not configured.");
    }
  } catch (error) {
    // Log error to server console without breaking form submission flow
    console.error("Resend email notification failed:", error);
  }

  return msg;
}

