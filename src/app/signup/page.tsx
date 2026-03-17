"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm font-bold bg-white focus:outline-none focus:border-halftone-purple transition-colors";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="h-14 flex items-center px-6 border-b border-black/[0.04]">
        <Link href="/" className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: "#9e6c9e15" }}>✓</div>
              <h1 className="text-2xl mb-2" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Check your email</h1>
              <p className="text-halftone-muted text-sm font-bold mb-6">We&apos;ve sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.</p>
              <Link href="/login" className="text-halftone-purple font-bold underline underline-offset-2 text-sm">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl mb-1" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Create account</h1>
              <p className="text-halftone-muted text-sm font-bold mb-8">Track all your orders in one place.</p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div>
                  <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Name</label>
                  <input required type="text" placeholder="Your name" className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Email</label>
                  <input required type="email" placeholder="you@brand.com" className={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted block mb-1.5">Password</label>
                  <input required type="password" placeholder="Min 8 characters" minLength={8} className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>

                {error && <p className="text-sm font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all" style={{ background: "#9e6c9e", fontWeight: 900 }}>
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </form>

              <p className="text-center text-sm font-bold text-halftone-muted mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-halftone-purple underline underline-offset-2">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
