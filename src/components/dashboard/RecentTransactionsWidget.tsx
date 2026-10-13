"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ShoppingBag,
  Zap,
  Film,
  Utensils,
  Briefcase,
  Home,
  Tag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

interface TransactionItem {
  id: string;
  type: string;
  amountCents: number;
  date: string;
  description: string;
  account?: { name: string } | null;
  category?: { name: string; color: string; icon: string } | null;
}

interface RecentTransactionsWidgetProps {
  transactions: TransactionItem[];
}

export function RecentTransactionsWidget({
  transactions,
}: RecentTransactionsWidgetProps) {
  const { formatAmount } = useCurrency();

  const getCategoryIcon = (catName?: string) => {
    switch (catName?.toLowerCase()) {
      case "groceries & food":
      case "groceries":
        return ShoppingBag;
      case "dining & restaurants":
      case "dining":
        return Utensils;
      case "utilities & bills":
      case "utilities":
        return Zap;
      case "entertainment & leisure":
      case "entertainment":
        return Film;
      case "salary & wages":
      case "salary":
        return Briefcase;
      case "housing & rent":
      case "rent":
        return Home;
      default:
        return Tag;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-400">Latest financial activities</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          View all{" "}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.05]">
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No transactions recorded yet.
          </div>
        ) : (
          transactions.map((tx, index) => {
            const Icon = getCategoryIcon(tx.category?.name);
            const isIncome = tx.type === "INCOME";
            const isTransfer = tx.type === "TRANSFER";

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(0.15 + index * 0.04, 0.45),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : isTransfer
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-slate-300 truncate">
                      {tx.category?.name || "Uncategorized"} • {tx.account?.name}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Date */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      isIncome
                        ? "text-emerald-400"
                        : isTransfer
                        ? "text-cyan-400"
                        : "text-slate-100"
                    }`}
                  >
                    {isIncome ? "+" : isTransfer ? "" : "-"}
                    {formatAmount(tx.amountCents)}
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {formatDate(tx.date)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
