"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
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
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
      } else if (signInData.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarding_completed_at")
          .eq("user_id", signInData.user.id)
          .maybeSingle();
        if (!profile || !profile.onboarding_completed_at) {
          // Onboarding not done — must complete it first;
          // the redirect will be picked up by the onboarding completion handler
          router.push("/onboarding");
        } else {
          // Return user to wherever they came from (e.g. /pricing to auto-trigger checkout)
          router.push(redirect);
        }
      }
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
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl text-ds-dark mb-1"
              style={{ fontWeight: 700, letterSpacing: "-0.05em" }}
            >
              Sign in
            </h1>
            <p className="text-ds-body text-sm">
              Track your orders and manage your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                placeholder="••••••••"
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
                <><Loader2 size={15} className="animate-spin" /> Signing in…</>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center">
            <p className="text-sm text-ds-body">
              No account?{" "}
              <Link
                href={`/signup${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="text-brand font-semibold hover:text-brand-dark transition-colors"
              >
                Create one
              </Link>
            </p>
            <p className="text-sm text-ds-body">
              <Link href="/track" className="text-ds-muted hover:text-ds-dark transition-colors">
                Track order without an account →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
