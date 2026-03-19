"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
        // Check onboarding status
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarding_completed_at")
          .eq("user_id", signInData.user.id)
          .maybeSingle();

        if (!profile?.onboarding_completed_at) {
          router.push("/onboarding");
        } else {
          router.push("/account");
        }
      }
    } catch {
      setError("Network error — check your Supabase URL is correct and the project is active.");
    }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none focus:border-halftone-purple transition-colors";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="h-14 flex items-center px-6 border-b border-black/[0.04]">
        <Link href="/" className="text-base" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>Halftone Labs</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="text-3xl mb-1" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>Sign in</h1>
          <p className="text-halftone-muted text-sm font-bold mb-8">Track your orders and manage your account.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email</label>
              <input required type="email" placeholder="you@brand.com" className={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Password</label>
              <input required type="password" placeholder="••••••••" className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            {error && <p className="text-sm font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all" style={{ background: "#9e6c9e", fontWeight: 600 }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-halftone-muted mt-6">
            No account?{" "}
            <Link href="/signup" className="text-halftone-purple underline underline-offset-2">Create one</Link>
          </p>
          <p className="text-center text-sm font-bold text-halftone-muted mt-2">
            <Link href="/track" className="text-halftone-dark underline underline-offset-2">Track order without an account →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
