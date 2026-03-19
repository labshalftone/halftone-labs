"use client";

const ROW_1 = [
  "Sunburn Festival",
  "Katarsis",
  "QUADECA",
  "Tidal Rave",
  "Kevin Abstract",
  "Galactica",
  "BLUSH",
  "Lowlands",
  "C2C",
];

const ROW_2 = [
  "WearADHD",
  "RESTRICTED",
  "Illusion Hills",
  "NovaRock",
  "RAUN",
  "Felicia Lu",
  "We Met At The Bar",
  "Vanisher",
  "Teletech",
  "Revive",
  "DJ ADHD",
];

// Triplicate for seamless loop
const TRACK_1 = [...ROW_1, ...ROW_1, ...ROW_1];
const TRACK_2 = [...ROW_2, ...ROW_2, ...ROW_2];

function Separator() {
  return (
    <span className="mx-5 text-zinc-300 select-none font-light text-xl leading-none flex-shrink-0">
      ✦
    </span>
  );
}

export default function TrustedBy() {
  return (
    <section className="bg-zinc-50 py-16 border-t border-zinc-200/60 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 px-6">
        <p className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-zinc-400">
          Trusted by artists &amp; events worldwide
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-3 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee-left">
          {TRACK_1.map((brand, i) => (
            <span key={i} className="inline-flex items-center flex-shrink-0">
              <span
                className="text-[1.05rem] font-semibold uppercase text-zinc-800 tracking-tight select-none hover:text-orange-500 transition-colors duration-200 cursor-default"
                style={{ letterSpacing: "-0.03em" }}
              >
                {brand}
              </span>
              <Separator />
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee-right">
          {TRACK_2.map((brand, i) => (
            <span key={i} className="inline-flex items-center flex-shrink-0">
              <span
                className="text-[1.05rem] font-semibold uppercase text-zinc-400 tracking-tight select-none hover:text-zinc-800 transition-colors duration-200 cursor-default"
                style={{ letterSpacing: "-0.03em" }}
              >
                {brand}
              </span>
              <Separator />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 32s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          animation: marquee-right 28s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
