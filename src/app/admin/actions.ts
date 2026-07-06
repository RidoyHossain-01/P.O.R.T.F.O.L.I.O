"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { Readable } from "stream";

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
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary conditionally
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to upload a Buffer directly to Cloudinary using its writable upload_stream
function uploadToCloudinaryStream(buffer: Buffer, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    Readable.from(buffer).pipe(stream);
  });
}

// Real uploader action for resume PDF & profile photo (and projects images)
export async function uploadFileAction(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  // ---- AUDIT & DEBUG LOGS ----
  console.log("---- UPLOADER AUDIT & DEBUG LOGS ----");
  console.log("File is instance of File:", file instanceof File);
  console.log("File Name:", file.name);
  console.log("File Type:", file.type);
  console.log("File Size (reported):", file.size);
  
  for (const [key, value] of formData.entries()) {
    console.log(`[FORM_DATA] key=${key}, type=${typeof value}, isFile=${value instanceof File}`);
    if (value instanceof File) {
      console.log(`[FORM_DATA] file.name=${value.name}, file.size=${value.size}`);
    }
  }

  // File size validation (limit to 10MB)
  const maxLimit = 10 * 1024 * 1024;
  if (file.size > maxLimit) {
    throw new Error(`File size exceeds the limit of ${maxLimit / (1024 * 1024)}MB.`);
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  try {
    // Read arrayBuffer and convert to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log(`[UPLOADER] arrayBuffer.byteLength: ${arrayBuffer.byteLength}`);
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[UPLOADER] buffer.byteLength: ${buffer.byteLength}`);

    // Verify buffer length is greater than 0
    if (buffer.length === 0) {
      throw new Error(`The parsed buffer for file '${file.name}' is empty (0 bytes). This occurs if the file was not serialized correctly or Next.js body limits were exceeded.`);
    }

    if (isPdf) {
      // PDF uploads MUST use Cloudinary. If Cloudinary is not configured, throw a descriptive error.
      if (!isCloudinaryConfigured) {
        throw new Error("Cloudinary credentials are not configured. PDF uploads require Cloudinary to be set up.");
      }

      console.log(`[UPLOADER] Uploading PDF '${file.name}' (${buffer.length} bytes) to Cloudinary raw storage...`);

      let originalName = file.name.replace(/\s+/g, "_");
      if (!originalName.toLowerCase().endsWith(".pdf")) {
        originalName += ".pdf";
      }

      const result = await uploadToCloudinaryStream(buffer, {
        folder: "developer-portfolio",
        resource_type: "raw",
        public_id: `${Date.now()}_${originalName}`,
      });

      console.log(`[UPLOADER] PDF Cloudinary upload successful. URL: ${result.secure_url}`);
      return { url: result.secure_url, success: true };
    }

    // For images, use Cloudinary if configured, otherwise fall back to local disk
    if (isCloudinaryConfigured) {
      console.log(`[UPLOADER] Uploading image '${file.name}' (${buffer.length} bytes) to Cloudinary...`);

      const result = await uploadToCloudinaryStream(buffer, {
        folder: "developer-portfolio",
        resource_type: "image",
      });

      console.log(`[UPLOADER] Image Cloudinary upload successful. URL: ${result.secure_url}`);
      return { url: result.secure_url, success: true };
    } else {
      console.warn("[UPLOADER] Cloudinary not configured. Falling back to local filesystem storage for image.");
      
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = file.name.replace(/\s+/g, "_");
      const uniqueFileName = `${Date.now()}_${fileName}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      await fs.writeFile(filePath, buffer);

      const finalUrl = `/uploads/${uniqueFileName}`;
      console.log(`[UPLOADER] Local filesystem image upload successful. URL: ${finalUrl}`);
      return { url: finalUrl, success: true };
    }
  } catch (error: any) {
    console.error("[UPLOADER] File upload pipeline crashed:", error);
    throw new Error(`File upload failed: ${error.message || error}`);
  }
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

function getCloudinaryPublicId(url: string): string | null {
  if (!url.includes("res.cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  
  const subParts = parts[1].split("/");
  if (subParts[0].startsWith("v")) {
    subParts.shift();
  }
  return subParts.join("/");
}

export async function updateResumeUrl(url: string) {
  await requireAuth();
  
  try {
    // Get all previous resumes to delete their Cloudinary assets
    const previousResumes = await prisma.resume.findMany();
    
    for (const prev of previousResumes) {
      if (prev.url && isCloudinaryConfigured) {
        const publicId = getCloudinaryPublicId(prev.url);
        if (publicId) {
          console.log(`[CLOUDINARY] Deleting old resume asset: ${publicId}`);
          await cloudinary.uploader.destroy(publicId, { resource_type: "raw" }).catch(err => {
            console.error(`[CLOUDINARY] Failed to destroy asset ${publicId}:`, err);
          });
        }
      }
    }
  } catch (err) {
    console.error("[UPLOADER] Failed to clean up previous resumes:", err);
  }

  // Clear all current resumes to avoid DB growth
  await prisma.resume.deleteMany();

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
  // Send email notification to the administrator via Gmail SMTP Nodemailer
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || gmailUser;

    if (!gmailUser || !gmailAppPassword) {
      console.warn("[MAIL] Email sending skipped: GMAIL_USER or GMAIL_APP_PASSWORD is not configured.");
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      // Get metadata (IP, User-Agent, Date/Time)
      const dateStr = new Date().toLocaleString("en-US", { timeZoneName: "short" });
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || "Unknown";
      const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "Unknown";

      console.log(`[MAIL] Attempting to send notification to Admin (${toEmail})...`);

      const adminMailOptions = {
        from: `"${data.name}" <${gmailUser}>`, // Display visitor's name, but send from verified user
        to: toEmail,
        replyTo: data.email,
        subject: `New Portfolio Contact — ${data.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <p style="margin-top: 0; font-weight: bold; font-size: 16px; color: #8a7355;">New portfolio message received</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
            <p><strong>Name:</strong><br/>${data.name}</p>
            <p><strong>Email:</strong><br/>${data.email}</p>
            <p><strong>Subject:</strong><br/>${data.subject || "No Subject"}</p>
            <p><strong>Message:</strong><br/>${data.content.replace(/\n/g, "<br/>")}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
            <p style="font-size: 11px; color: #888;">
              <strong>Metadata:</strong><br/>
              Date/Time: ${dateStr}<br/>
              IP: ${ip}<br/>
              User-Agent: ${userAgent}
            </p>
          </div>
        `,
      };

      await transporter.sendMail(adminMailOptions);
      console.log("[MAIL] Admin notification sent successfully.");

      // Send auto-reply to the visitor
      console.log(`[MAIL] Attempting to send auto-reply to Visitor (${data.email})...`);
      const visitorMailOptions = {
        from: `"Ridoy Hossain" <${gmailUser}>`,
        to: data.email,
        subject: `Thank you for reaching out! — Ridoy Hossain`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <p style="margin-top: 0; font-weight: bold; font-size: 16px; color: #8a7355;">Hello ${data.name},</p>
            <p>Thank you for getting in touch. I have successfully received your message and will review it as soon as possible.</p>
            <p>Here is a copy of your message for reference:</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 3px solid #8a7355; margin: 15px 0; font-style: italic;">
              ${data.content.replace(/\n/g, "<br/>")}
            </div>
            <p>Best regards,<br/><strong>Ridoy Hossain</strong><br/>Full Stack Developer</p>
          </div>
        `,
      };

      await transporter.sendMail(visitorMailOptions);
      console.log("[MAIL] Auto-reply sent successfully.");
    }
  } catch (error: any) {
    console.error("[MAIL] Email pipeline failed:", error);
    throw new Error(`Email delivery failed: ${error.message || error}`);
  }

  return msg;
}

