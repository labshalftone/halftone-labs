"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  "Order Placed":     "#9e6c9e",
  "Design Confirmed": "#9e6c9e",
  "In Production":    "#f15533",
  "Quality Check":    "#f15533",
  "Shipped":          "#2196F3",
  "Delivered":        "#4CAF50",
};

type Order = {
  id: string;
  ref: string;
  product_name: string;
  color: string;
  size: string;
  print_tier: string;
  total: number;
  status: string;
  created_at: string;
  milestones: { id: string; title: string; description: string; created_at: string }[];
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; user_metadata: { name?: string } } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user as typeof user);

      // Fetch orders by email via track API (reuse it for each order would be inefficient)
      // Instead fetch via a direct API call
      const res = await fetch(`/api/account/orders?email=${encodeURIComponent(session.user.email ?? "")}&userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-halftone-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>Halftone Labs</Link>
          <div className="flex items-center gap-5">
            <Link href="/studio" className="text-[0.78rem] font-bold text-halftone-muted hover:text-halftone-dark transition-colors">Studio</Link>
            <button onClick={handleSignOut} className="text-[0.78rem] font-bold text-halftone-muted hover:text-halftone-dark transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-[800px] mx-auto px-6 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-purple mb-1">My Account</p>
          <h1 className="text-3xl mb-1" style={{ fontWeight: 900, letterSpacing: "-0.05em" }}>
            {user?.user_metadata?.name ?? "Your Orders"}
          </h1>
          <p className="text-halftone-muted text-sm font-bold mb-8">{user?.email}</p>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-black/10 rounded-2xl">
            <p className="text-halftone-muted font-bold mb-4">No orders yet.</p>
            <Link href="/studio" className="px-5 py-2.5 rounded-full text-white text-sm font-bold" style={{ background: "#9e6c9e" }}>
              Go to Studio →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
                {/* Order header */}
                <button className="w-full text-left p-5 hover:bg-halftone-light transition-colors" onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-base" style={{ fontWeight: 900 }}>#{order.ref}</p>
                          <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-bold"
                            style={{ background: (STATUS_COLORS[order.status] ?? "#9e6c9e") + "15", color: STATUS_COLORS[order.status] ?? "#9e6c9e" }}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[0.78rem] font-bold text-halftone-muted">{order.product_name} · {order.color} · Size {order.size}</p>
                        <p className="text-[0.7rem] font-bold text-halftone-muted mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg" style={{ fontWeight: 900 }}>₹{order.total}</p>
                      <p className="text-[0.65rem] text-halftone-muted font-bold mt-0.5">{selected?.id === order.id ? "▲ Hide" : "▼ Details"}</p>
                    </div>
                  </div>
                </button>

                {/* Expanded milestone timeline */}
                <AnimatePresence>
                  {selected?.id === order.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-black/[0.05]">
                      <div className="p-5">
                        <p className="text-[0.62rem] font-bold uppercase tracking-widest text-halftone-muted mb-4">Order Timeline</p>
                        {order.milestones.map((m, i) => (
                          <div key={m.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: "#9e6c9e" }} />
                              {i < order.milestones.length - 1 && <div className="w-px flex-1 my-1" style={{ background: "rgba(158,108,158,0.2)", minHeight: 20 }} />}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm font-bold">{m.title}</p>
                              {m.description && <p className="text-[0.75rem] text-halftone-muted font-bold">{m.description}</p>}
                              <p className="text-[0.62rem] text-halftone-muted/60 font-bold mt-0.5">
                                {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <Link href={`/track?ref=${order.ref}&email=${user?.email}`}
                          className="mt-2 text-[0.75rem] font-bold text-halftone-purple underline underline-offset-2">
                          Full tracking page →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
