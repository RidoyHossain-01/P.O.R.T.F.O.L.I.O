"use client";

import React, { useState, useEffect } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../actions";
import { Loader2, Plus, Trash, Edit2, Check, X, Calendar, GraduationCap, Briefcase } from "lucide-react";

type SubTab = "experience" | "education";

export default function AdminTimelinesPage() {
  const [activeTab, setActiveTab] = useState<SubTab>("experience");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states - Experience
  const [expCompany, setExpCompany] = useState("");
  const [expPosition, setExpPosition] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState("");
  const [expOrder, setExpOrder] = useState(0);

  // Form states - Education
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduCurrent, setEduCurrent] = useState(false);
  const [eduDesc, setEduDesc] = useState("");
  const [eduOrder, setEduOrder] = useState(0);

  // Edit trackers
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTimelines();
  }, []);

  async function loadTimelines() {
    try {
      const exps = await getExperiences();
      const edus = await getEducations();
      setExperiences(exps);
      setEducations(edus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany || !expPosition || !expStart) return;

    setSaving(true);
    try {
      await createExperience({
        company: expCompany,
        position: expPosition,
        startDate: new Date(expStart),
        endDate: expCurrent ? null : expEnd ? new Date(expEnd) : null,
        description: expDesc,
        order: Number(expOrder),
      });
      setExpCompany("");
      setExpPosition("");
      setExpStart("");
      setExpEnd("");
      setExpCurrent(false);
      setExpDesc("");
      setExpOrder(0);
      await loadTimelines();
    } catch (err) {
      alert("Failed to add experience milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    setSaving(true);
    try {
      await deleteExperience(id);
      await loadTimelines();
    } catch (err) {
      alert("Failed to delete record.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduInstitution || !eduDegree || !eduStart) return;

    setSaving(true);
    try {
      await createEducation({
        institution: eduInstitution,
        degree: eduDegree,
        fieldOfStudy: eduField,
        startDate: new Date(eduStart),
        endDate: eduCurrent ? null : eduEnd ? new Date(eduEnd) : null,
        description: eduDesc,
        order: Number(eduOrder),
      });
      setEduInstitution("");
      setEduDegree("");
      setEduField("");
      setEduStart("");
      setEduEnd("");
      setEduCurrent(false);
      setEduDesc("");
      setEduOrder(0);
      await loadTimelines();
    } catch (err) {
      alert("Failed to add education milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;
    setSaving(true);
    try {
      await deleteEducation(id);
      await loadTimelines();
    } catch (err) {
      alert("Failed to delete record.");
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
        <h1 className="text-2xl font-bold uppercase tracking-tight">Timeline Management</h1>
        <p className="text-sm text-muted-foreground">Manage experience timeline histories and education milestones.</p>
      </div>

      {/* Tabs Select */}
      <div className="flex border-b border-border-custom font-mono text-xs uppercase tracking-wider gap-4">
        {(["experience", "education"] as SubTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditingId(null);
            }}
            className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-primary text-foreground font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "experience" ? "Work Experience" : "Academic Education"}
          </button>
        ))}
      </div>

      {/* Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Timelines Record list */}
        <div className="lg:col-span-2 flex flex-col gap-6 font-mono text-xs">
          {activeTab === "experience" ? (
            experiences.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border-custom rounded bg-card text-muted-foreground">
                No work experience configured. Add one on the right.
              </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-3 relative shadow-sm">
                  <div className="flex justify-between items-start gap-4 border-b border-border-custom pb-3">
                    <div>
                      <h3 className="font-bold text-sm font-sans normal-case text-foreground">{exp.position}</h3>
                      <span className="text-[10px] text-muted-foreground block">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        Order: {exp.order}
                      </span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1.5 border border-transparent rounded transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-center text-[10px] text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 font-sans normal-case whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))
            )
          ) : educations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-custom rounded bg-card text-muted-foreground">
              No education credentials configured. Add one on the right.
            </div>
          ) : (
            educations.map((edu) => (
              <div key={edu.id} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-3 relative shadow-sm">
                <div className="flex justify-between items-start gap-4 border-b border-border-custom pb-3">
                  <div>
                    <h3 className="font-bold text-sm font-sans normal-case text-foreground">{edu.degree}</h3>
                    <span className="text-[10px] text-muted-foreground block">
                      {edu.institution} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      Order: {edu.order}
                    </span>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-red-500 hover:bg-red-500/10 p-1.5 border border-transparent rounded transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center text-[10px] text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 font-sans normal-case whitespace-pre-line leading-relaxed">
                  {edu.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Timeline CRUD Forms */}
        <div className="flex flex-col">
          {activeTab === "experience" ? (
            <form onSubmit={handleAddExperience} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border-custom pb-3 mb-1">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
                  Add Work Experience
                </h3>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="company" className="text-muted-foreground">Company Name</label>
                <input
                  id="company"
                  type="text"
                  required
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="e.g. Pixel Craft Studio"
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="position" className="text-muted-foreground">Position / Title</label>
                <input
                  id="position"
                  type="text"
                  required
                  value={expPosition}
                  onChange={(e) => setExpPosition(e.target.value)}
                  placeholder="e.g. Lead Developer"
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="startDate" className="text-muted-foreground">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans text-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="endDate" className="text-muted-foreground">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    disabled={expCurrent}
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans text-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] uppercase my-1">
                <input
                  id="isCurrent"
                  type="checkbox"
                  checked={expCurrent}
                  onChange={(e) => setExpCurrent(e.target.checked)}
                  className="w-4 h-4 border-border-custom focus:ring-0 accent-primary cursor-pointer"
                />
                <label htmlFor="isCurrent" className="text-muted-foreground cursor-pointer select-none">
                  Currently work here
                </label>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="expOrder" className="text-muted-foreground">Timeline Order</label>
                <input
                  id="expOrder"
                  type="number"
                  value={expOrder}
                  onChange={(e) => setExpOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="description" className="text-muted-foreground">Achievements / Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="bullet points list in markdown..."
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Milestone
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddEducation} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border-custom pb-3 mb-1">
                <GraduationCap className="w-4.5 h-4.5 text-primary" />
                <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
                  Add Academic Record
                </h3>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="institution" className="text-muted-foreground">Institution / University</label>
                <input
                  id="institution"
                  type="text"
                  required
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="e.g. State University"
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="degree" className="text-muted-foreground">Degree / Certification</label>
                <input
                  id="degree"
                  type="text"
                  required
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="field" className="text-muted-foreground">Field of Study</label>
                <input
                  id="field"
                  type="text"
                  value={eduField}
                  onChange={(e) => setEduField(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="eduStart" className="text-muted-foreground">Start Date</label>
                  <input
                    id="eduStart"
                    type="date"
                    required
                    value={eduStart}
                    onChange={(e) => setEduStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans text-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                  <label htmlFor="eduEnd" className="text-muted-foreground">End Date</label>
                  <input
                    id="eduEnd"
                    type="date"
                    disabled={eduCurrent}
                    value={eduEnd}
                    onChange={(e) => setEduEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans text-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] uppercase my-1">
                <input
                  id="eduCurrent"
                  type="checkbox"
                  checked={eduCurrent}
                  onChange={(e) => setEduCurrent(e.target.checked)}
                  className="w-4 h-4 border-border-custom focus:ring-0 accent-primary cursor-pointer"
                />
                <label htmlFor="eduCurrent" className="text-muted-foreground cursor-pointer select-none">
                  Currently studying here
                </label>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="eduOrder" className="text-muted-foreground">Timeline Order</label>
                <input
                  id="eduOrder"
                  type="number"
                  value={eduOrder}
                  onChange={(e) => setEduOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
                <label htmlFor="eduDesc" className="text-muted-foreground">Academic Achievements / Notes</label>
                <textarea
                  id="eduDesc"
                  rows={4}
                  value={eduDesc}
                  onChange={(e) => setEduDesc(e.target.value)}
                  placeholder="courses completed, GPA highlights, etc..."
                  className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case resize-none text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Credentials
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
