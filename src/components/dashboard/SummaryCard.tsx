"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface SummaryCardProps {
  title: string;
  amountCents: number;
  icon: LucideIcon;
  trendPercentage?: number;
  trendLabel?: string;
  gradient: "blue" | "cyan" | "emerald" | "rose";
  isBalanceCard?: boolean;
  index?: number;
}

export function SummaryCard({
  title,
  amountCents,
  icon: Icon,
  trendPercentage,
  trendLabel = "vs last month",
  gradient,
  isBalanceCard = false,
  index = 0,
}: SummaryCardProps) {
  const { formatAmount, isBalanceHidden, toggleBalanceVisibility } = useCurrency();
  const shouldReduceMotion = useReducedMotion();

  const gradientStyles = {
    blue: {
      border: "border-blue-500/20 hover:border-blue-500/40",
      iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      glow: "hover:shadow-glow-cyan",
      blurColor: "bg-cyan-500/10",
    },
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      glow: "hover:shadow-glow-cyan",
      blurColor: "bg-cyan-500/10",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      glow: "hover:shadow-emerald-500/20",
      blurColor: "bg-emerald-500/10",
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      glow: "hover:shadow-rose-500/20",
      blurColor: "bg-rose-500/10",
    },
  }[gradient];

  const isPositiveTrend = (trendPercentage || 0) >= 0;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 relative group overflow-hidden ${gradientStyles.border} ${gradientStyles.glow}`}
    >
      {/* Delicate on-load optical sheen sweep across card */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "240%" }}
          transition={{
            duration: 1.15,
            delay: 0.35 + index * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none"
        />
      )}

      {/* Subtle ambient breathing background light */}
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full ${gradientStyles.blurColor} blur-xl pointer-events-none transition-all`}
      />

      {/* Card Header: Title & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-300">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {isBalanceCard && (
            <button
              onClick={toggleBalanceVisibility}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Toggle balance privacy"
            >
              {isBalanceHidden ? (
                <EyeOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          )}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${gradientStyles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Currency Figure */}
      <div className="mb-3">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {formatAmount(amountCents)}
        </div>
      </div>

      {/* Trend or description footer */}
      {trendPercentage !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full ${
              isPositiveTrend
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isPositiveTrend ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trendPercentage)}%
          </span>
          <span className="text-slate-300 font-medium truncate">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
