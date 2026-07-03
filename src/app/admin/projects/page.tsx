"use client";

import React, { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadFileAction,
} from "../actions";
import {
  Loader2,
  Plus,
  Trash,
  Edit2,
  Check,
  X,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [techStackInput, setTechStackInput] = useState(""); // Comma separated
  const [githubLink, setGithubLink] = useState("");
  const [liveDemoLink, setLiveDemoLink] = useState("");
  const [challenges, setChallenges] = useState("");
  const [futureImprovements, setFutureImprovements] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setCoverImage("");
    setDescription("");
    setTechStackInput("");
    setGithubLink("");
    setLiveDemoLink("");
    setChallenges("");
    setFutureImprovements("");
    setIsPublished(false);
    setOrder(0);
  };

  const handleEditClick = (proj: any) => {
    setEditingId(proj.id);
    setName(proj.name);
    setSlug(proj.slug);
    setCoverImage(proj.coverImage || "");
    setDescription(proj.description);
    setTechStackInput(proj.techStack ? proj.techStack.join(", ") : "");
    setGithubLink(proj.githubLink || "");
    setLiveDemoLink(proj.liveDemoLink || "");
    setChallenges(proj.challenges || "");
    setFutureImprovements(proj.futureImprovements || "");
    setIsPublished(proj.isPublished || false);
    setOrder(proj.order || 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setSaving(true);
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const projectData = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      coverImage,
      description,
      techStack,
      githubLink,
      liveDemoLink,
      challenges,
      futureImprovements,
      isPublished,
      order: Number(order),
    };

    try {
      if (editingId) {
        await updateProject(editingId, projectData);
      } else {
        await createProject(projectData);
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      alert("Failed to save project. Make sure slug is unique.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setSaving(true);
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      alert("Failed to delete project.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFileAction(formData);
      setCoverImage(res.url);
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateProject(id, { isPublished: !currentStatus });
      await loadProjects();
    } catch (err) {
      alert("Failed to update status.");
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
        <h1 className="text-2xl font-bold uppercase tracking-tight">Project Management</h1>
        <p className="text-sm text-muted-foreground">Add and manage case study showcase items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Projects Lists */}
        <div className="lg:col-span-2 flex flex-col gap-4 font-mono text-xs">
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-custom rounded bg-card text-muted-foreground">
              No projects added yet. Add one on the right.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center gap-4 p-4 border border-border-custom bg-card rounded-lg shadow-sm"
              >
                {/* Cover thumbnail */}
                <div className="relative w-16 h-10 shrink-0 border border-border-custom bg-background rounded overflow-hidden flex items-center justify-center text-[8px] text-muted-foreground select-none">
                  {proj.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={proj.coverImage} alt="" className="object-cover w-full h-full" />
                  ) : (
                    "No image"
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm font-sans normal-case text-foreground truncate">
                    {proj.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    /{proj.slug} • Order: {proj.order}
                  </span>
                </div>

                {/* Status Badges & Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(proj.id, proj.isPublished)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[9px] uppercase font-bold tracking-wider cursor-pointer ${
                      proj.isPublished
                        ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                    }`}
                  >
                    {proj.isPublished ? (
                      <>
                        <Eye className="w-3 h-3" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Draft
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 border-l border-border-custom pl-3">
                    <button
                      onClick={() => handleEditClick(proj)}
                      className="text-muted-foreground hover:text-foreground p-1.5 border border-transparent rounded transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="text-red-500 hover:bg-red-500/10 p-1.5 border border-transparent rounded transition-colors cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Right Column: Forms (Create or Edit) */}
        <form onSubmit={handleSave} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm h-fit">
          <div className="flex justify-between items-center border-b border-border-custom pb-3 mb-1">
            <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
              {editingId ? "Edit Project" : "Create Project"}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="projName" className="text-muted-foreground">Project Name</label>
            <input
              id="projName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Finance Analytics"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="projSlug" className="text-muted-foreground">Slug Identifier</label>
            <input
              id="projSlug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. finance-analytics"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
            />
          </div>

          {/* Cover image uploader */}
          <div className="flex items-center gap-4 border-y border-border-custom py-4 my-1">
            <div className="relative w-12 h-8 shrink-0 border border-border-custom bg-background rounded overflow-hidden flex items-center justify-center text-[7px] text-muted-foreground">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="" className="object-cover w-full h-full" />
              ) : (
                "Preview"
              )}
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[9px] uppercase">
              <span className="text-muted-foreground">Project Cover Image</span>
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-border-custom bg-background text-foreground rounded hover:bg-card active:scale-[0.98] transition-all cursor-pointer font-bold text-[9px]">
                <Upload className="w-3 h-3" />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="techTags" className="text-muted-foreground">Tech Stack (comma separated)</label>
            <input
              id="techTags"
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Next.js, Tailwind CSS, PostgreSQL"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="github" className="text-muted-foreground">GitHub URL</label>
              <input
                id="github"
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="live" className="text-muted-foreground">Live URL</label>
              <input
                id="live"
                type="url"
                value={liveDemoLink}
                onChange={(e) => setLiveDemoLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="order" className="text-muted-foreground">Order Index</label>
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase mt-5">
              <input
                id="publish"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 border-border-custom focus:ring-0 accent-primary cursor-pointer"
              />
              <label htmlFor="publish" className="text-muted-foreground cursor-pointer select-none">
                Publish Project
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="desc" className="text-muted-foreground">Short Description</label>
            <textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="challenges" className="text-muted-foreground">Key Challenges</label>
            <textarea
              id="challenges"
              rows={3}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="what challenges did you solve?"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
            <label htmlFor="improvements" className="text-muted-foreground">Future Improvements</label>
            <textarea
              id="improvements"
              rows={3}
              value={futureImprovements}
              onChange={(e) => setFutureImprovements(e.target.value)}
              placeholder="what is next for this project?"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : editingId ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {editingId ? "Save Project" : "Add Project"}
          </button>
        </form>

      </div>
    </div>
  );
}
