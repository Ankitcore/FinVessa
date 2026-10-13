"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface SummaryCardProps {
  title: string;
  amountCents: number;
  icon: LucideIcon;
  trendPercentage?: number;
  trendLabel?: string;
  gradient: "purple" | "cyan" | "emerald" | "rose";
  isBalanceCard?: boolean;
}

export function SummaryCard({
  title,
  amountCents,
  icon: Icon,
  trendPercentage,
  trendLabel = "vs last month",
  gradient,
  isBalanceCard = false,
}: SummaryCardProps) {
  const { formatAmount, isBalanceHidden, toggleBalanceVisibility } = useCurrency();

  const gradientStyles = {
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      glow: "hover:shadow-glow",
    },
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      glow: "hover:shadow-glow-cyan",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      glow: "hover:shadow-emerald-500/20",
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      glow: "hover:shadow-rose-500/20",
    },
  }[gradient];

  const isPositiveTrend = (trendPercentage || 0) >= 0;

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 relative group overflow-hidden ${gradientStyles.border} ${gradientStyles.glow}`}
    >
      {/* Subtle background light blur */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/[0.02] group-hover:bg-white/[0.04] blur-xl pointer-events-none transition-all" />

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
    </div>
  );
}
