"use client";

import { useState, useEffect } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CountdownTimer({ launchAt, onLaunched }: { launchAt: string; onLaunched?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    function tick() {
      const diff = new Date(launchAt).getTime() - Date.now();
      if (diff <= 0) {
        setLaunched(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onLaunched?.();
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchAt, onLaunched]);

  if (!timeLeft) return null;
  if (launched) return (
    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      Live now
    </div>
  );

  const units = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="text-center">
            <div className="bg-zinc-900 text-white font-black text-lg leading-none px-3 py-2 rounded-xl min-w-[2.8rem] text-center tabular-nums">
              {pad(u.value)}
            </div>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{u.label}</p>
          </div>
          {i < 3 && <span className="text-zinc-400 font-black text-lg mb-4">:</span>}
        </div>
      ))}
    </div>
  );
}
