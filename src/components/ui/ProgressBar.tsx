"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 100+
  max?: number;
  colorClassName?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  duration?: number;
  showShimmer?: boolean;
  showTipGlow?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  colorClassName = "bg-gradient-to-r from-cyan-500 to-blue-500",
  size = "md",
  delay = 0.15,
  duration = 0.95,
  showShimmer = true,
  showTipGlow = true,
  className = "",
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();

  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const isOver100 = value > max;

  const sizeHeights = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full ${sizeHeights[size]} rounded-full bg-white/[0.06] overflow-hidden relative border border-white/[0.05] p-[1px] ${className}`}
    >
      {/* Filled animated bar */}
      <motion.div
        initial={shouldReduceMotion ? { width: `${percentage}%` } : { width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : duration,
          delay: shouldReduceMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`h-full rounded-full relative overflow-hidden transition-colors ${
          colorClassName || "bg-gradient-to-r from-cyan-500 to-blue-500"
        }`}
      >
        {/* Subtle, gentle post-load light shimmer stream */}
        {showShimmer && !shouldReduceMotion && percentage > 3 && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "220%" }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 5.5,
              ease: "easeInOut",
              delay: delay + duration + 0.3,
            }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
            style={{ width: "60%" }}
          />
        )}

        {/* Illuminated leading edge / tip glow */}
        {showTipGlow && percentage > 5 && percentage < 99 && (
          <div
            className={`absolute right-0 top-0 bottom-0 w-1.5 rounded-full ${
              isOver100
                ? "bg-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                : "bg-cyan-100 shadow-[0_0_8px_rgba(56,189,248,0.9)]"
            }`}
          />
        )}
      </motion.div>
    </div>
  );
}
