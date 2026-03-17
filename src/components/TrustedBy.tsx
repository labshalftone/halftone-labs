"use client";

const BRANDS = [
  "NovaRock",
  "Katarsis",
  "Galactica",
  "Lowlands",
  "Sunburn Festival",
  "C2C",
  "Tidal Rave",
  "BLUSH",
  "Kevin Abstract",
  "RESTRICTED",
  "Revive",
  "We Met At The Bar",
  "Vanisher",
  "WearADHD",
  "Teletech",
  "Illusion Hills",
  "Felicia Lu",
  "DJ ADHD",
];

// Duplicate for seamless loop
const TRACK = [...BRANDS, ...BRANDS];

export default function TrustedBy() {
  return (
    <section className="relative bg-white border-t border-b border-zinc-200 py-5 overflow-hidden">
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-6 pr-8 bg-white border-r border-zinc-200">
        <span className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest whitespace-nowrap">
          Trusted by
        </span>
      </div>

      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 z-[5] bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-[5] bg-gradient-to-l from-white to-transparent" />

      {/* Scrolling track */}
      <div className="pl-52 flex overflow-hidden">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {TRACK.map((brand, i) => (
            <span
              key={i}
              className="text-[0.85rem] font-black uppercase tracking-tight text-zinc-300 select-none hover:text-zinc-500 transition-colors duration-200"
              style={{ letterSpacing: "-0.03em" }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
