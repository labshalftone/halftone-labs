"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

  const inputCls = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <Navbar />

      {/* Hero */}
      <div className="bg-zinc-900 pt-14">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500 mb-3">Halftone Labs</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[0.95] mb-4" style={{ letterSpacing: "-0.05em" }}>
              Get in touch
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Questions about your order, a design, or just want to say hi? Fill in the form and we&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3"
        >
          {sent ? (
            <div className="bg-white rounded-3xl border border-zinc-100 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-zinc-900 mb-2" style={{ letterSpacing: "-0.03em" }}>Message sent!</h2>
              <p className="text-zinc-500 text-sm">
                We&apos;ll reply to <strong>{form.email}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-100 p-8 flex flex-col gap-5">
              <h2 className="font-black text-zinc-900 text-lg" style={{ letterSpacing: "-0.03em" }}>Send us a message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Topic</label>
                <select required value={form.topic} onChange={set("topic")} className={inputCls}>
                  <option value="" disabled>Select a topic…</option>
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us what's on your mind…"
                  className={`${inputCls} resize-none`}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Sending…</>
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
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col gap-4">
            <h3 className="font-black text-zinc-900 text-sm" style={{ letterSpacing: "-0.02em" }}>Direct contact</h3>
            <a href="mailto:hello@halftonelabs.in" className="flex items-center gap-3 text-sm text-zinc-600 hover:text-orange-500 transition-colors group">
              <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              hello@halftonelabs.in
            </a>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We reply within 24 hours on business days (Mon–Sat, IST).
            </p>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col gap-3">
            <h3 className="font-black text-zinc-900 text-sm mb-1" style={{ letterSpacing: "-0.02em" }}>Quick links</h3>
            {[
              { label: "Track your order", href: "/track" },
              { label: "Shipping policy", href: "/shipping-policy" },
              { label: "Return & refund policy", href: "/return-policy" },
              { label: "How it works", href: "/how-it-works" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="flex items-center justify-between text-sm text-zinc-600 hover:text-orange-500 transition-colors group">
                <span>{label}</span>
                <svg className="w-3.5 h-3.5 text-zinc-300 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Hours */}
          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Response time</p>
            <p className="font-black text-white text-lg" style={{ letterSpacing: "-0.03em" }}>Within 24 hrs</p>
            <p className="text-zinc-400 text-xs mt-1">Mon – Sat · India Standard Time</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
