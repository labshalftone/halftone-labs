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

function Dot() {
  return (
    <span className="mx-5 select-none flex-shrink-0 text-ds-muted-heading">·</span>
  );
}

export default function TrustedBy() {
  return (
    <section className="bg-white py-12 border-y border-black/[0.05] overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 px-6">
        <p className="ds-label justify-center">
          Trusted by artists &amp; events worldwide
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-2 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee-left">
          {TRACK_1.map((brand, i) => (
            <span key={i} className="inline-flex items-center flex-shrink-0">
              <span
                className="text-[1rem] font-semibold text-ds-dark tracking-tight select-none cursor-default hover:text-brand transition-colors duration-200"
                style={{ letterSpacing: "-0.03em" }}
              >
                {brand}
              </span>
              <Dot />
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
                className="text-[1rem] font-semibold text-ds-muted-heading tracking-tight select-none cursor-default hover:text-ds-dark transition-colors duration-200"
                style={{ letterSpacing: "-0.03em" }}
              >
                {brand}
              </span>
              <Dot />
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
          animation: marquee-left 36s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
