"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Floating halftone dot field — animated breathing dots */
export function HalftoneField({
  color = "purple",
  side = "right",
  density = 25,
  className = "",
}: {
  color?: "purple" | "orange";
  side?: "left" | "right";
  density?: number;
  className?: string;
}) {
  const dots = useRef(
    Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
  ).current;

  const c =
    color === "purple"
      ? "rgba(158,108,158,"
      : "rgba(241,85,51,";

  return (
    <div
      className={`absolute ${side === "right" ? "right-0" : "left-0"} top-0 w-1/3 h-full pointer-events-none overflow-hidden z-0 ${className}`}
      style={{
        maskImage: `linear-gradient(to ${side === "right" ? "left" : "right"}, black 0%, transparent 80%)`,
        WebkitMaskImage: `linear-gradient(to ${side === "right" ? "left" : "right"}, black 0%, transparent 80%)`,
      }}
    >
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: `${c}0.3)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Halftone dot grid that shifts with scroll parallax */
export function HalftoneParallaxGrid({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.2, 0.2, 0]);

  const dotColor =
    variant === "dark"
      ? "rgba(158,108,158,0.2)"
      : "rgba(158,108,158,0.1)";

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ y, opacity }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 2px, transparent 2px)`,
          backgroundSize: "24px 24px",
        }}
      />
    </motion.div>
  );
}

/* Interactive mouse-following halftone spotlight */
export function HalftoneSpotlight({ className = "" }: { className?: string }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`} style={{ pointerEvents: "auto" }}>
      <div
        className="w-full h-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(158,108,158,0.18) 2.5px, transparent 2.5px)",
          backgroundSize: "20px 20px",
          maskImage: `radial-gradient(circle 280px at ${pos.x}% ${pos.y}%, black 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(circle 280px at ${pos.x}% ${pos.y}%, black 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* Horizontal halftone transition band between sections */
export function HalftoneBand({ color = "purple" }: { color?: "purple" | "orange" }) {
  const c = color === "purple" ? "rgba(158,108,158," : "rgba(241,85,51,";
  return (
    <div className="relative h-16 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${c}0.18) 2px, transparent 2px)`,
          backgroundSize: "18px 18px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* Large pulsing halftone circle accent */
export function HalftoneCircle({
  size = 500,
  position = "top-right",
  color = "purple",
  className = "",
}: {
  size?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center-right" | "center-left";
  color?: "purple" | "orange";
  className?: string;
}) {
  const posClasses = {
    "top-right": "-top-20 -right-20",
    "top-left": "-top-20 -left-20",
    "bottom-right": "-bottom-20 -right-20",
    "bottom-left": "-bottom-20 -left-20",
    "center-right": "top-1/2 -translate-y-1/2 -right-32",
    "center-left": "top-1/2 -translate-y-1/2 -left-32",
  };

  const c = color === "purple" ? "rgba(158,108,158," : "rgba(241,85,51,";

  return (
    <motion.div
      className={`absolute ${posClasses[position]} pointer-events-none z-0 ${className}`}
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${c}0.12) 2.5px, transparent 2.5px)`,
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

/* Scroll-driven parallax wrapper */
export function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
