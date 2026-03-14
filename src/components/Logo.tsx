"use client";

export function LogoDark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="38" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="42" letterSpacing="-3" fill="#0f0f0f">Halftone</text>
      <line x1="0" y1="48" x2="175" y2="48" stroke="#0f0f0f" strokeWidth="3" />
      <text x="0" y="82" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="42" letterSpacing="-3" fill="#0f0f0f">Labs</text>
      <line x1="0" y1="88" x2="98" y2="88" stroke="#0f0f0f" strokeWidth="3" />
      <line x1="105" y1="88" x2="115" y2="88" stroke="#0f0f0f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="38" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="42" letterSpacing="-3" fill="white">Halftone</text>
      <line x1="0" y1="48" x2="175" y2="48" stroke="white" strokeWidth="3" />
      <text x="0" y="82" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="42" letterSpacing="-3" fill="white">Labs</text>
      <line x1="0" y1="88" x2="98" y2="88" stroke="white" strokeWidth="3" />
      <line x1="105" y1="88" x2="115" y2="88" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LogoMarkDark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Halftone dot grid pattern inside a rounded square */}
      <rect x="2" y="2" width="32" height="32" rx="6" stroke="#0f0f0f" strokeWidth="1.5" fill="none" />
      {/* Dot grid */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => {
          const r = 1.2 + (row * 0.3);
          return (
            <circle
              key={`${row}-${col}`}
              cx={8 + col * 5}
              cy={8 + row * 5}
              r={Math.min(r, 2.5)}
              fill="#0f0f0f"
              opacity={0.3 + row * 0.15}
            />
          );
        })
      )}
    </svg>
  );
}

export function LogoInline({ dark = true, className = "" }: { dark?: boolean; className?: string }) {
  const fill = dark ? "#0f0f0f" : "white";
  return (
    <svg viewBox="0 0 180 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="21" fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="24" letterSpacing="-2" fill={fill}>Halftone Labs</text>
      <line x1="0" y1="26" x2="168" y2="26" stroke={fill} strokeWidth="2" />
    </svg>
  );
}
