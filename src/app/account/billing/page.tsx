"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SubscriptionProvider } from "@/lib/subscription-context";
import BillingTab from "@/components/BillingTab";

export default function BillingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login?redirect=/account/billing"); return; }
      setUserId(session.user.id);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-[#f7f7f6]">
        {/* Header */}
        <header className="h-14 bg-white border-b border-black/[0.06] px-6 flex items-center gap-4 sticky top-0 z-10">
          <Link
            href="/account"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <div className="h-4 w-px bg-zinc-200" />
          <h1 className="text-sm font-semibold text-zinc-900">Billing & Plan</h1>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-6 py-10">
          {userId && <BillingTab userId={userId} />}
        </main>
      </div>
    </SubscriptionProvider>
  );
}
