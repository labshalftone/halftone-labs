"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        background: "#f97316",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        letterSpacing: "0.2px",
      }}
    >
      Print / Save as PDF
    </button>
  );
}
