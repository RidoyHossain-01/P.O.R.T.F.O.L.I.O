"use client";

import React, { useState, useEffect } from "react";
import {
  getSettings,
  updateSettings,
  uploadFileAction,
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getActiveResume,
  updateResumeUrl,
  updateAdminPassword,
} from "../actions";
import {
  User,
  Share2,
  Lock,
  Plus,
  Trash,
  Check,
  Loader2,
  Upload,
  Globe,
} from "lucide-react";

type Tab = "profile" | "socials" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings states
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Social Links states
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newOrder, setNewOrder] = useState(0);

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getSettings();
        setFullName(settings.fullName || "");
        setJobTitle(settings.jobTitle || "");
        setAboutMe(settings.aboutMe || "");
        setContactEmail(settings.contactEmail || "");
        setProfilePhotoUrl(settings.profilePhotoUrl || "");

        const resume = await getActiveResume();
        setResumeUrl(resume?.url || "");

        const links = await getSocialLinks();
        setSocialLinks(links);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ fullName, jobTitle, aboutMe, contactEmail, profilePhotoUrl });
      showStatus("success", "Profile settings updated successfully!");
    } catch (err) {
      showStatus("error", "Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  };

  // File Upload handler with frontend logging
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ---- FRONTEND UPLOADER AUDIT LOGS ----
    console.log("---- FRONTEND SETTINGS UPLOADER LOGS ----");
    console.log("Selected file:", file.name, "size:", file.size, "type:", file.type);

    setSaving(true);
    try {
      console.log("Before FormData append - file size:", file.size);
      const formData = new FormData();
      formData.append("file", file);
      
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`Entry key: ${key}, isFile: ${value instanceof File}`);
        if (value instanceof File) {
          console.log(`File name in FormData: ${value.name}, size: ${value.size}`);
        }
      }
      
      const res = await uploadFileAction(formData);
      
      if (type === "photo") {
        setProfilePhotoUrl(res.url);
        await updateSettings({ profilePhotoUrl: res.url });
        showStatus("success", "Profile photo replaced!");
      } else {
        setResumeUrl(res.url);
        await updateResumeUrl(res.url);
        showStatus("success", "Active resume PDF updated!");
      }
    } catch (err) {
      showStatus("error", "File upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform || !newUrl) return;

    setSaving(true);
    try {
      const newLink = await createSocialLink({
        platformName: newPlatform,
        icon: newIcon || "globe",
        url: newUrl,
        displayOrder: Number(newOrder),
        isVisible: true,
      });
      setSocialLinks([...socialLinks, newLink].sort((a, b) => a.displayOrder - b.displayOrder));
      setNewPlatform("");
      setNewIcon("");
      setNewUrl("");
      setNewOrder(0);
      showStatus("success", "Social link added!");
    } catch (err) {
      showStatus("error", "Failed to add social link.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    setSaving(true);
    try {
      await deleteSocialLink(id);
      setSocialLinks(socialLinks.filter((link) => link.id !== id));
      showStatus("success", "Social link deleted!");
    } catch (err) {
      showStatus("error", "Failed to delete social link.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showStatus("error", "Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await updateAdminPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      showStatus("success", "Password updated successfully!");
    } catch (err) {
      showStatus("error", "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Configuration Settings</h1>
        <p className="text-sm text-muted-foreground">Manage details displayed on your portfolio.</p>
      </div>

      {/* Floating Status Notification */}
      {status && (
        <div
          className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-2xl border font-mono text-xs uppercase tracking-wider ${
            status.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Tab Select Header */}
      <div className="flex border-b border-border-custom font-mono text-xs uppercase tracking-wider gap-4">
        {(["profile", "socials", "security"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-primary text-foreground font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-card border border-border-custom rounded-lg p-6 md:p-8">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 max-w-2xl">
            {/* Header */}
            <div>
              <h2 className="text-base font-bold uppercase font-mono tracking-wide mb-1 text-primary">
                Profile Details
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase font-mono">
                FullName, Photo, and Resume settings
              </p>
            </div>

            {/* Profile Photo Uploader */}
            <div className="flex items-center gap-6 border-b border-border-custom pb-6">
              <div className="relative w-20 h-20 rounded-full border border-border-custom bg-background flex items-center justify-center overflow-hidden font-mono text-[9px] text-muted-foreground uppercase">
                {profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePhotoUrl} alt="Photo" className="object-cover w-full h-full" />
                ) : (
                  "No Image"
                )}
              </div>
              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase">
                <span className="text-muted-foreground">Replace Profile Image</span>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-border-custom bg-background text-foreground rounded hover:bg-card active:scale-[0.98] transition-all cursor-pointer font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "photo")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Resume PDF Uploader */}
            <div className="flex items-center gap-6 border-b border-border-custom pb-6">
              <div className="flex flex-col gap-1 font-mono text-xs max-w-sm flex-1">
                <span className="text-muted-foreground uppercase text-[10px]">Active Resume Link</span>
                <span className="truncate bg-background border border-border-custom rounded px-3 py-1.5 font-sans">
                  {resumeUrl || "No resume PDF uploaded"}
                </span>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase">
                <span className="text-muted-foreground">Upload New PDF</span>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-border-custom bg-background text-foreground rounded hover:bg-card active:scale-[0.98] transition-all cursor-pointer font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  Select PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, "resume")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="fullName" className="text-muted-foreground">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="jobTitle" className="text-muted-foreground">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase md:col-span-2">
                <label htmlFor="contactEmail" className="text-muted-foreground">Contact Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase md:col-span-2">
                <label htmlFor="aboutMe" className="text-muted-foreground">About Me Bio</label>
                <textarea
                  id="aboutMe"
                  required
                  rows={4}
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-48 py-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </form>
        )}

        {/* Socials Tab */}
        {activeTab === "socials" && (
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
              <h2 className="text-base font-bold uppercase font-mono tracking-wide mb-1 text-primary">
                Social Profile Channels
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase font-mono">
                Manage references to external profiles
              </p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              {socialLinks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 border border-dashed border-border-custom rounded">
                  No social channels created.
                </div>
              ) : (
                socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex justify-between items-center p-4 border border-border-custom bg-background rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground">{link.platformName}</span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-xs lowercase font-sans">
                        ({link.url})
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-muted-foreground">Order: {link.displayOrder}</span>
                      <button
                        onClick={() => handleDeleteSocial(link.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1.5 border border-transparent rounded transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Channel Form */}
            <form onSubmit={handleAddSocial} className="flex flex-col gap-5 border-t border-border-custom pt-6 max-w-xl">
              <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
                Add Channel
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="platformName" className="text-muted-foreground">Platform Name</label>
                  <input
                    id="platformName"
                    type="text"
                    required
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="e.g. GitHub"
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="icon" className="text-muted-foreground">Icon Key (Lucide)</label>
                  <input
                    id="icon"
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    placeholder="e.g. github"
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase sm:col-span-2">
                  <label htmlFor="url" className="text-muted-foreground">Profile URL</label>
                  <input
                    id="url"
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="displayOrder" className="text-muted-foreground">Display Order</label>
                  <input
                    id="displayOrder"
                    type="number"
                    value={newOrder}
                    onChange={(e) => setNewOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-48 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Channel
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6 max-w-md">
            {/* Header */}
            <div>
              <h2 className="text-base font-bold uppercase font-mono tracking-wide mb-1 text-primary">
                Update Password
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase font-mono">
                Re-hash workspace credentials
              </p>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="newPass" className="text-muted-foreground">New Password</label>
              <input
                id="newPass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="confirmPass" className="text-muted-foreground">Confirm New Password</label>
              <input
                id="confirmPass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-48 py-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              Update Credentials
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
