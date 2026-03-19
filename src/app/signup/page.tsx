"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    if (!url || url.includes("placeholder")) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables, then redeploy.");
      setLoading(false);
      return;
    }
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name },
          emailRedirectTo: `${origin}/onboarding`,
        },
      });
      if (error) setError(error.message);
      else setSent(true);
    } catch {
      setError("Network error — check your Supabase URL is correct and the project is active.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal nav */}
      <nav className="h-14 flex items-center px-6 border-b border-black/[0.05]">
        <Link
          href="/"
          className="text-base text-ds-dark"
          style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
        >
          Halftone Labs
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto mb-5 flex items-center justify-center">
                <CheckCircle size={26} className="text-emerald-500" />
              </div>
              <h1
                className="text-2xl text-ds-dark mb-2"
                style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
              >
                Check your email
              </h1>
              <p className="text-ds-body text-sm mb-6 leading-relaxed">
                We&apos;ve sent a confirmation link to{" "}
                <strong className="text-ds-dark">{form.email}</strong>. Click it to
                activate your account and set up your store.
              </p>
              <Link
                href="/login"
                className="text-brand font-semibold text-sm hover:text-brand-dark transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Sign-up form ── */
            <>
              <div className="mb-8">
                <h1
                  className="text-3xl text-ds-dark mb-1"
                  style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
                >
                  Create account
                </h1>
                <p className="text-ds-body text-sm">
                  Track all your orders in one place.
                </p>
              </div>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div>
                  <label className="ds-label mb-1.5 block">Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    className="field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ds-label mb-1.5 block">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@brand.com"
                    className="field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ds-label mb-1.5 block">Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Min 8 characters"
                    minLength={8}
                    className="field"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-brand w-full justify-center py-3 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-ds-body mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-brand font-semibold hover:text-brand-dark transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
