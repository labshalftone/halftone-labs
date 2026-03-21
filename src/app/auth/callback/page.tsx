"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = searchParams.get("code");
    const redirect = searchParams.get("redirect") ?? "/account";

    async function routeUser(userId: string) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("onboarding_completed_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (!profile || !profile.onboarding_completed_at) {
        const after = redirect !== "/account"
          ? `/onboarding?after=${encodeURIComponent(redirect)}`
          : "/onboarding";
        router.replace(after);
      } else {
        router.replace(redirect);
      }
    }

    async function finish() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }
      }

      // Try to get the user — may be null briefly on implicit OAuth flow
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await routeUser(user.id);
        return;
      }

      // Fallback: wait for onAuthStateChange to fire with the session
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          subscription.unsubscribe();
          await routeUser(session.user.id);
        } else if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          subscription.unsubscribe();
          router.replace("/login");
        }
      });

      // Safety timeout — if nothing fires in 5s, give up
      setTimeout(() => {
        subscription.unsubscribe();
        router.replace("/login");
      }, 5000);
    }

    finish();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="w-8 h-8 rounded-full border-2 border-black/[0.08] border-t-brand animate-spin"
        />
        <p className="text-sm text-ds-muted" style={{ letterSpacing: "-0.01em" }}>
          Signing you in…
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
