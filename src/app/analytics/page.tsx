"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";
import { ProgressBar } from "@/components/ui/ProgressBar";

const COLORS = ["#0284C7", "#06B6D4", "#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#F43F5E"];

export default function AnalyticsPage() {
  const { formatAmount, currency } = useCurrency();
  const [monthsBack, setMonthsBack] = useState(6);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?months=${monthsBack}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [monthsBack]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const summary = data?.summary || {
    totalIncomeCents: 0,
    totalExpenseCents: 0,
    netCashFlowCents: 0,
    overallSavingsRate: 0,
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f1626]/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold text-white">
                {formatCurrency((entry.value || 0) * 100, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout
      title="Financial Analytics & Intelligence"
      subtitle="Deep cash flow analytics, category distributions, and multi-month trends"
      onRefreshData={loadAnalytics}
    >
      {/* Date Range Selector Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400">Analysis Timeframe:</span>
          <div className="flex items-center bg-[#0f1626] border border-white/[0.08] p-1 rounded-xl">
            <button
              onClick={() => setMonthsBack(6)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                monthsBack === 6
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setMonthsBack(12)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                monthsBack === 12
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last 12 Months
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Period Income", val: formatAmount(summary.totalIncomeCents), border: "border-emerald-500/20", text: "text-emerald-400" },
          { label: "Period Expenses", val: formatAmount(summary.totalExpenseCents), border: "border-rose-500/20", text: "text-rose-400" },
          { label: "Net Savings", val: formatAmount(summary.netCashFlowCents), border: "border-cyan-500/20", text: "text-cyan-400" },
          { label: "Average Savings Rate", val: `${summary.overallSavingsRate}%`, border: "border-blue-500/20", text: "text-blue-400" },
        ].map((badge, i) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`glass-card rounded-2xl p-5 border ${badge.border}`}
          >
            <span className="text-xs text-slate-400 font-medium">{badge.label}</span>
            <div className={`text-xl sm:text-2xl font-black ${badge.text} mt-1`}>
              {badge.val}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2 Primary Charts: Monthly Cash Flow & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Cash Flow Area Chart (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/[0.08]"
        >
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Net Savings & Trend
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Visual progression of monthly net cash flow
          </p>

          <div className="w-full min-w-0 h-72 overflow-hidden">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyTrends || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${currency === "INR" ? "₹" : "$"}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="net" name="Net Flow" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#netGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Category Pie / Donut Chart (1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl p-6 border border-white/[0.08]"
        >
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" /> Spending Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Percentage allocation across categories
          </p>

          <div className="w-full h-64 flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : data?.spendingByCategory?.length === 0 ? (
              <div className="text-xs text-slate-400">No expenses recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.spendingByCategory || []}
                    dataKey="amountCents"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {(data?.spendingByCategory || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), currency), "Spent"]}
                    contentStyle={{
                      backgroundColor: "#0f1626",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Expense Categories Breakdown Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4">
          Expense Category Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Transactions</th>
                <th className="py-3 px-4 text-right">Total Outflow</th>
                <th className="py-3 px-4 text-right">% of Total Expenses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(data?.spendingByCategory || []).map((cat: any, i: number) => (
                <tr key={cat.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{cat.count} txns</td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    {formatAmount(cat.amountCents)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-20 hidden sm:block">
                        <ProgressBar
                          value={cat.percentage || 0}
                          max={100}
                          size="sm"
                          delay={0.2 + i * 0.05}
                          colorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                        />
                      </div>
                      <span className="text-slate-300 font-semibold w-9 text-right">
                        {cat.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
