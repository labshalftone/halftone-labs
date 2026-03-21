"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const callbackUrl = `${origin}/auth/callback${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

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

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-black/[0.12] bg-white hover:bg-zinc-50 transition-colors text-sm font-medium text-ds-dark disabled:opacity-50 mb-5"
          >
            {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-[0.72rem] text-ds-muted font-medium">or</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
