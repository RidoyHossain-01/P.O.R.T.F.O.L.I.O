"use client";

import React, { useState, useEffect } from "react";
import { getMessages, markMessageAsRead, deleteMessage } from "../actions";
import { Loader2, Trash2, MailOpen, Mail, User, Clock, ShieldAlert } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id: string) => {
    setSaving(true);
    try {
      await markMessageAsRead(id);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      alert("Failed to mark message as read.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message permanently?")) return;
    setSaving(true);
    try {
      await deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete message.");
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
        <h1 className="text-2xl font-bold uppercase tracking-tight">Inbox Messages</h1>
        <p className="text-sm text-muted-foreground">Read and manage submitted contact messages.</p>
      </div>

      {/* Messages list */}
      <div className="flex flex-col gap-4 font-mono text-xs max-w-4xl">
        {messages.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-custom rounded-lg bg-card text-muted-foreground">
            Your inbox is empty. No messages received.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`border border-border-custom bg-card rounded-lg p-6 flex flex-col gap-4 shadow-sm transition-all duration-200 relative ${
                !msg.isRead ? "border-l-4 border-l-primary" : ""
              }`}
            >
              {/* Top Row: Sender Info & Actions */}
              <div className="flex justify-between items-start gap-4 border-b border-border-custom pb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-sans font-bold text-sm text-foreground normal-case">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{msg.name}</span>
                    {!msg.isRead && (
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-primary">{msg.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 items-center text-[10px] text-muted-foreground mr-2 font-sans normal-case">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1 border-l border-border-custom pl-3">
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        disabled={saving}
                        className="text-muted-foreground hover:text-foreground p-1.5 border border-transparent rounded hover:bg-background transition-colors cursor-pointer"
                        title="Mark as Read"
                      >
                        <MailOpen className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={saving}
                      className="text-red-500 hover:bg-red-500/10 p-1.5 border border-transparent rounded transition-colors cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {msg.subject && (
                <div className="font-sans font-bold text-xs text-foreground uppercase tracking-wide">
                  Subject: {msg.subject}
                </div>
              )}

              {/* Message Content Body */}
              <p className="text-xs text-muted-foreground font-sans normal-case whitespace-pre-line leading-relaxed">
                {msg.content}
              </p>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
