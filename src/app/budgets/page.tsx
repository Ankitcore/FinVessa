"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function BudgetsPage() {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalBudgetLimitCents: 0,
    totalSpentCents: 0,
    totalRemainingCents: 0,
    percentageUsed: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, cRes] = await Promise.all([
        fetch("/api/budgets"),
        fetch("/api/categories"),
      ]);
      if (bRes.ok && cRes.ok) {
        const bData = await bRes.json();
        const cData = await cRes.json();
        setBudgets(bData.budgets || []);
        setSummary(bData.summary || {});
        setCategories(
          (cData.categories || []).filter((c: any) => c.type === "EXPENSE")
        );
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const limitCents = Math.round(parseFloat(budgetLimit) * 100);
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: budgetName.trim(),
          limitCents,
          categoryId: categoryId || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Budget "${data.budget.name}" saved successfully.`);
        setIsModalOpen(false);
        setBudgetName("");
        setBudgetLimit("");
        loadBudgets();
      } else {
        toast.error(data.error || "Failed to create budget");
      }
    } catch {
      toast.error("Network error while creating budget");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string, name: string) => {
    if (!confirm(`Delete budget "${name}"?`)) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Budget deleted successfully.");
        loadBudgets();
      } else {
        toast.error("Failed to delete budget");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <AppLayout
      title="Monthly Budgets & Limits"
      subtitle="Track live category caps, monitor spending velocity, and prevent budget overruns"
      onRefreshData={loadBudgets}
    >
      {/* Overview Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Monthly Budget Utilization
            </h2>
            <p className="text-xs text-slate-400">
              Total assigned spending cap across all monitored categories
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              Spent: <strong className="text-white">{formatAmount(summary.totalSpentCents || 0)}</strong>
            </span>
            <span className="text-slate-300 font-medium">
              Cap: <strong className="text-white">{formatAmount(summary.totalBudgetLimitCents || 0)}</strong>
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/[0.05]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (summary.percentageUsed || 0) > 100
                  ? "bg-rose-500 shadow-glow"
                  : (summary.percentageUsed || 0) > 80
                  ? "bg-amber-400"
                  : "bg-gradient-to-r from-purple-500 to-cyan-400"
              }`}
              style={{
                width: `${Math.min(100, summary.percentageUsed || 0)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Remaining:{" "}
              <strong
                className={
                  (summary.totalRemainingCents || 0) < 0
                    ? "text-rose-400"
                    : "text-emerald-400"
                }
              >
                {formatAmount(summary.totalRemainingCents || 0)}
              </strong>
            </span>
            <span className="font-semibold text-slate-300">
              {summary.percentageUsed || 0}% Utilized
            </span>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-2" />
            <p className="text-xs">Calculating budget limits...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No budgets created yet. Click &ldquo;Create Budget&rdquo; to set a category spending limit.
          </div>
        ) : (
          budgets.map((b) => {
            const isExceeded = b.isExceeded;
            const isWarning = b.percentageUsed >= 80 && !isExceeded;

            return (
              <div
                key={b.id}
                className={`glass-card rounded-2xl p-5 border transition-all ${
                  isExceeded
                    ? "border-rose-500/40 bg-rose-950/10 shadow-rose-950/20"
                    : "border-white/[0.08]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-sm truncate">
                    {b.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {isExceeded && (
                      <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" /> Exceeded
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteBudget(b.id, b.name)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-xl font-extrabold text-white">
                      {formatAmount(b.spentCents)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {" "}
                      / {formatAmount(b.limitCents)}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isExceeded
                        ? "text-rose-400"
                        : isWarning
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {b.percentageUsed}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExceeded
                        ? "bg-rose-500"
                        : isWarning
                        ? "bg-amber-400"
                        : "bg-gradient-to-r from-purple-500 to-cyan-400"
                    }`}
                    style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.05]">
                  <span>{b.category?.name || "General"}</span>
                  <span>
                    Remaining:{" "}
                    <strong
                      className={
                        b.remainingCents < 0 ? "text-rose-400" : "text-slate-200"
                      }
                    >
                      {formatAmount(b.remainingCents)}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Budget Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white">
                Set Spending Limit
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Budget Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dining & Restaurants"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">All Categories (General)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="500"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow transition-all"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
