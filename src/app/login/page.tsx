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

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect width="18" height="18" rx="3" fill="#0A66C2"/>
      <path d="M4.5 7H6.5V13.5H4.5V7ZM5.5 4C4.95 4 4.5 4.45 4.5 5C4.5 5.55 4.95 6 5.5 6C6.05 6 6.5 5.55 6.5 5C6.5 4.45 6.05 4 5.5 4Z" fill="white"/>
      <path d="M8 7H9.9V7.9C10.2 7.35 10.95 7 11.75 7C13.4 7 14 8.05 14 9.65V13.5H12V10.1C12 9.4 11.75 9 11.1 9C10.4 9 10 9.45 10 10.1V13.5H8V7Z" fill="white"/>
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
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") ?? "");
  const mergeError = error.toLowerCase().includes("already") || error.toLowerCase().includes("exists") || error.toLowerCase().includes("registered");

  const getCallbackUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/auth/callback${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getCallbackUrl() },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  const handleLinkedIn = async () => {
    setLinkedinLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo: getCallbackUrl() },
    });
    if (error) { setError(error.message); setLinkedinLoading(false); }
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

          {/* Social logins */}
          <div className="flex flex-col gap-2.5 mb-5">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || linkedinLoading || loading}
              className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-black/[0.12] bg-white hover:bg-zinc-50 transition-colors text-sm font-medium text-ds-dark disabled:opacity-50"
            >
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleLinkedIn}
              disabled={googleLoading || linkedinLoading || loading}
              className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-black/[0.12] bg-white hover:bg-zinc-50 transition-colors text-sm font-medium text-ds-dark disabled:opacity-50"
            >
              {linkedinLoading ? <Loader2 size={16} className="animate-spin" /> : <LinkedInIcon />}
              Continue with LinkedIn
            </button>
          </div>

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
              <div className={`text-sm px-3 py-2.5 rounded-xl border ${mergeError ? "text-amber-700 bg-amber-50 border-amber-100" : "text-red-600 bg-red-50 border-red-100"}`}>
                {mergeError ? (
                  <>
                    <p className="font-semibold mb-1">Account already exists</p>
                    <p>An account with this email was created with a password. Sign in with your email below, then link Google or LinkedIn from <strong>Account Settings → Connected Accounts</strong>.</p>
                  </>
                ) : error}
              </div>
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
