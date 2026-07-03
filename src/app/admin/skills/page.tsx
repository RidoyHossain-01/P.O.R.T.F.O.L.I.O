"use client";

import React, { useState, useEffect } from "react";
import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../actions";
import { Loader2, Plus, Trash, Edit2, Check, X, Tag } from "lucide-react";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Category states
  const [newCatName, setNewCatName] = useState("");
  const [newCatOrder, setNewCatOrder] = useState(0);

  // New Skill states
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCatId, setNewSkillCatId] = useState("");
  const [newSkillOrder, setNewSkillOrder] = useState(0);

  // Editing state trackers
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatOrder, setEditingCatOrder] = useState(0);

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState("");
  const [editingSkillOrder, setEditingSkillOrder] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getSkillCategories();
      setCategories(data);
      if (data.length > 0 && !newSkillCatId) {
        setNewSkillCatId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setSaving(true);
    try {
      await createSkillCategory({ name: newCatName, order: Number(newCatOrder) });
      setNewCatName("");
      setNewCatOrder(0);
      await loadCategories();
    } catch (err) {
      alert("Failed to create skill category. Ensure the name is unique.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCatName) return;
    setSaving(true);
    try {
      await updateSkillCategory(id, { name: editingCatName, order: Number(editingCatOrder) });
      setEditingCatId(null);
      await loadCategories();
    } catch (err) {
      alert("Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? Deleting this category will delete all attached skills!")) return;
    setSaving(true);
    try {
      await deleteSkillCategory(id);
      await loadCategories();
    } catch (err) {
      alert("Failed to delete category.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName || !newSkillCatId) return;
    setSaving(true);
    try {
      await createSkill({
        name: newSkillName,
        categoryId: newSkillCatId,
        order: Number(newSkillOrder),
      });
      setNewSkillName("");
      setNewSkillOrder(0);
      await loadCategories();
    } catch (err) {
      alert("Failed to add skill. Ensure name is unique.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (id: string) => {
    if (!editingSkillName) return;
    setSaving(true);
    try {
      await updateSkill(id, { name: editingSkillName, order: Number(editingSkillOrder) });
      setEditingSkillId(null);
      await loadCategories();
    } catch (err) {
      alert("Failed to update skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setSaving(true);
    try {
      await deleteSkill(id);
      await loadCategories();
    } catch (err) {
      alert("Failed to delete skill.");
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
        <h1 className="text-2xl font-bold uppercase tracking-tight">Skills & Categories</h1>
        <p className="text-sm text-muted-foreground">Manage your portfolio technical expertise taxonomy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Categories & attached Skills */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {categories.length === 0 ? (
            <div className="text-center font-mono text-xs text-muted-foreground py-16 border border-dashed border-border-custom rounded-lg bg-card">
              No categories configured yet. Create one on the right.
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
                
                {/* Category Header */}
                <div className="flex justify-between items-center border-b border-border-custom pb-4">
                  {editingCatId === cat.id ? (
                    <div className="flex items-center gap-2 font-mono text-xs max-w-sm">
                      <input
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="px-2 py-1 bg-background border border-border-custom rounded text-foreground text-xs font-sans"
                      />
                      <input
                        type="number"
                        value={editingCatOrder}
                        onChange={(e) => setEditingCatOrder(Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-background border border-border-custom rounded text-foreground text-xs"
                      />
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        disabled={saving}
                        className="text-green-500 hover:bg-green-500/10 p-1 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCatId(null)} className="text-muted-foreground hover:bg-background p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[9px] text-muted-foreground">Order: {cat.order}</span>
                    </div>
                  )}

                  {editingCatId !== cat.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditingCatName(cat.name);
                          setEditingCatOrder(cat.order);
                        }}
                        className="text-muted-foreground hover:text-foreground p-1 border border-transparent hover:border-border-custom rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1 border border-transparent rounded transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Skill Chips List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground font-mono uppercase italic">
                      No skills added to this category.
                    </span>
                  ) : (
                    cat.skills.map((skill: any) => (
                      <div
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-background border border-border-custom"
                      >
                        {editingSkillId === skill.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingSkillName}
                              onChange={(e) => setEditingSkillName(e.target.value)}
                              className="px-1.5 py-0.5 bg-card border border-border-custom rounded text-foreground text-xs font-sans w-24"
                            />
                            <input
                              type="number"
                              value={editingSkillOrder}
                              onChange={(e) => setEditingSkillOrder(Number(e.target.value))}
                              className="w-12 px-1 py-0.5 bg-card border border-border-custom rounded text-foreground text-xs"
                            />
                            <button
                              onClick={() => handleUpdateSkill(skill.id)}
                              disabled={saving}
                              className="text-green-500 hover:bg-green-500/10 rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button onClick={() => setEditingSkillId(null)} className="text-muted-foreground rounded">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Tag className="w-3 h-3 text-muted-foreground" />
                            <span>{skill.name}</span>
                            <span className="text-[8px] text-muted-foreground/60">({skill.order})</span>
                            <button
                              onClick={() => {
                                setEditingSkillId(skill.id);
                                setEditingSkillName(skill.name);
                                setEditingSkillOrder(skill.order);
                              }}
                              className="text-muted-foreground hover:text-foreground ml-1 cursor-pointer"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Right Column: Creation Forms */}
        <div className="flex flex-col gap-6">
          
          {/* Create Category Form */}
          <form onSubmit={handleAddCategory} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
              Create Category
            </h3>
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="catName" className="text-muted-foreground">Category Name</label>
              <input
                id="catName"
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Frontend"
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="catOrder" className="text-muted-foreground">Display Order</label>
              <input
                id="catOrder"
                type="number"
                value={newCatOrder}
                onChange={(e) => setNewCatOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-primary text-primary-foreground font-mono text-xs uppercase font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Category
            </button>
          </form>

          {/* Create Skill Form */}
          <form onSubmit={handleAddSkill} className="border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase font-mono tracking-wide text-primary">
              Add New Skill
            </h3>
            
            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="skillName" className="text-muted-foreground">Skill Name</label>
              <input
                id="skillName"
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Tailwind CSS"
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="skillCat" className="text-muted-foreground">Target Category</label>
              <select
                id="skillCat"
                required
                value={newSkillCatId}
                onChange={(e) => setNewSkillCatId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans text-foreground"
              >
                <option value="" disabled>Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">
              <label htmlFor="skillOrder" className="text-muted-foreground">Skill Order</label>
              <input
                id="skillOrder"
                type="number"
                value={newSkillOrder}
                onChange={(e) => setNewSkillOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary font-sans normal-case text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="w-full py-2 bg-foreground text-background font-mono text-xs uppercase font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Skill
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
