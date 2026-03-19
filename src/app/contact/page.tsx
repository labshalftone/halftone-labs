"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Loader2, CheckCircle, Mail, ChevronRight } from "lucide-react";

const TOPICS = [
  "Order enquiry",
  "Design help",
  "Bulk / wholesale",
  "Shipping & tracking",
  "Returns & defects",
  "Custom collab",
  "Something else",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Email us directly at hello@halftonelabs.in");
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-10 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="ds-label ds-label-brand mb-4 block">Halftone Labs</span>
          <h1
            className="text-5xl md:text-6xl text-ds-dark leading-[0.95] mb-4"
            style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
          >
            <span className="h-fade">Get in </span>
            <span className="h-bold">touch.</span>
          </h1>
          <p className="text-ds-body text-lg max-w-md leading-relaxed">
            Questions about your order, a design, or just want to say hi? Fill in the form and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3"
        >
          {sent ? (
            <div className="ds-card p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto mb-5 flex items-center justify-center">
                <CheckCircle size={26} className="text-emerald-500" />
              </div>
              <h2
                className="text-xl text-ds-dark mb-2"
                style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
              >
                Message sent!
              </h2>
              <p className="text-ds-body text-sm">
                We&apos;ll reply to <strong className="text-ds-dark">{form.email}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ds-card p-8 flex flex-col gap-5">
              <h2
                className="font-semibold text-ds-dark text-lg"
                style={{ letterSpacing: "-0.03em" }}
              >
                Send us a message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="ds-label">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ds-label">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className="field"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ds-label">Topic</label>
                <select required value={form.topic} onChange={set("topic")} className="field">
                  <option value="" disabled>Select a topic…</option>
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ds-label">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us what's on your mind…"
                  className="field resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-brand w-full justify-center py-3.5 disabled:opacity-50"
              >
                {sending ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending…</>
                ) : "Send message →"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 flex flex-col gap-5"
        >
          {/* Contact details */}
          <div className="ds-card p-6 flex flex-col gap-4">
            <h3
              className="font-semibold text-ds-dark text-sm"
              style={{ letterSpacing: "-0.02em" }}
            >
              Direct contact
            </h3>
            <a
              href="mailto:hello@halftonelabs.in"
              className="flex items-center gap-3 text-sm text-ds-body hover:text-brand transition-colors group"
            >
              <span className="w-9 h-9 rounded-xl bg-brand-8 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-12 transition-colors">
                <Mail size={16} className="text-brand" />
              </span>
              hello@halftonelabs.in
            </a>
            <p className="text-xs text-ds-muted leading-relaxed">
              We reply within 24 hours on business days (Mon–Sat, IST).
            </p>
          </div>

          {/* Quick links */}
          <div className="ds-card p-6 flex flex-col gap-3">
            <h3
              className="font-semibold text-ds-dark text-sm mb-1"
              style={{ letterSpacing: "-0.02em" }}
            >
              Quick links
            </h3>
            {[
              { label: "Track your order", href: "/track" },
              { label: "Shipping policy", href: "/shipping-policy" },
              { label: "Return & refund policy", href: "/return-policy" },
              { label: "How it works", href: "/how-it-works" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between text-sm text-ds-body hover:text-brand transition-colors group"
              >
                <span>{label}</span>
                <ChevronRight size={14} className="text-ds-muted group-hover:text-brand transition-colors" />
              </Link>
            ))}
          </div>

          {/* Response time */}
          <div className="bg-ds-dark rounded-2xl p-6">
            <span className="ds-label text-white/30 mb-2 block">Response time</span>
            <p
              className="font-semibold text-white text-lg"
              style={{ letterSpacing: "-0.03em" }}
            >
              Within 24 hrs
            </p>
            <p className="text-white/40 text-xs mt-1">Mon – Sat · India Standard Time</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
