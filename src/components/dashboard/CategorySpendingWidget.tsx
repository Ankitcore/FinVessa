"use client";

import React from "react";
import Link from "next/link";
import { PieChart, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";

interface CategoryBreakdownItem {
  name: string;
  color: string;
  amountCents: number;
}

interface CategorySpendingWidgetProps {
  categories: CategoryBreakdownItem[];
  totalExpenseCents: number;
}

export function CategorySpendingWidget({
  categories,
  totalExpenseCents,
}: CategorySpendingWidgetProps) {
  const { formatAmount } = useCurrency();

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            Spending by Category
          </h2>
          <p className="text-xs text-slate-400">Expense breakdown this month</p>
        </div>
        <Link
          href="/analytics"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          Details{" "}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Categories Progress List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No expenses recorded this period.
          </div>
        ) : (
          categories.map((cat, idx) => {
            const percentage =
              totalExpenseCents > 0
                ? Math.round((cat.amountCents / totalExpenseCents) * 100)
                : 0;

            const barColors = [
              "bg-purple-500",
              "bg-cyan-400",
              "bg-pink-500",
              "bg-amber-400",
              "bg-emerald-400",
              "bg-indigo-400",
            ];
            const colorClass = barColors[idx % barColors.length];

            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${colorClass}`}
                      style={{ backgroundColor: cat.color || undefined }}
                    />
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {formatAmount(cat.amountCents)}
                    </span>
                    <span className="text-slate-400 text-[11px] w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{
                      width: `${Math.min(100, Math.max(2, percentage))}%`,
                      backgroundColor: cat.color || undefined,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
