"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Filter,
  Plus,
  RefreshCw,
  Loader2,
  Calendar,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { VirtualCardWidget } from "@/components/cards/VirtualCardWidget";
import { RecentTransactionsWidget } from "@/components/dashboard/RecentTransactionsWidget";
import { UpcomingPaymentsWidget } from "@/components/dashboard/UpcomingPaymentsWidget";
import { CategorySpendingWidget } from "@/components/dashboard/CategorySpendingWidget";
import { QuickActionsModal } from "@/components/modals/QuickActionsModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [rangeFilter, setRangeFilter] = useState("month");
  const [accountFilter, setAccountFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [quickActionType, setQuickActionType] = useState<"INCOME" | "EXPENSE" | "TRANSFER">("EXPENSE");
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard?range=${rangeFilter}&accountId=${accountFilter}`
      );
      if (res.status === 401) {
        // If demo user is seeded, auto demo-login or redirect
        const demoRes = await fetch("/api/auth/demo-login", { method: "POST" });
        if (demoRes.ok) {
          const retry = await fetch(
            `/api/dashboard?range=${rangeFilter}&accountId=${accountFilter}`
          );
          if (retry.ok) {
            const retryData = await retry.json();
            setData(retryData);
            return;
          }
        }
        router.push("/login");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [rangeFilter, accountFilter, router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const metrics = data?.metrics || {
    totalBalanceCents: 0,
    incomeCents: 0,
    expenseCents: 0,
    netCashFlowCents: 0,
    savingsRate: 0,
  };

  const openAction = (type: "INCOME" | "EXPENSE" | "TRANSFER") => {
    setQuickActionType(type);
    setIsQuickActionOpen(true);
  };

  return (
    <AppLayout
      title="Financial Dashboard"
      subtitle="Overview of your balances, cash flows, and investments"
      onRefreshData={loadDashboardData}
    >
      {/* Filters & Quick Actions Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Left: Account & Date Range Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Account Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f1626] border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              <option value="all" className="bg-[#0f1626] text-white">
                All Accounts
              </option>
              {data?.accounts?.map((acc: any) => (
                <option
                  key={acc.id}
                  value={acc.id}
                  className="bg-[#0f1626] text-white"
                >
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f1626] border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              <option value="month" className="bg-[#0f1626] text-white">
                This Month
              </option>
              <option value="last30" className="bg-[#0f1626] text-white">
                Last 30 Days
              </option>
              <option value="year" className="bg-[#0f1626] text-white">
                This Year
              </option>
              <option value="all" className="bg-[#0f1626] text-white">
                All Time
              </option>
            </select>
          </div>

          <button
            onClick={() => loadDashboardData()}
            className="p-2 text-slate-400 hover:text-white bg-[#0f1626] border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
            title="Refresh dashboard metrics"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`}
            />
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openAction("EXPENSE")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all active:scale-95 min-h-[38px]"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => openAction("INCOME")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all active:scale-95 min-h-[38px]"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => openAction("TRANSFER")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all active:scale-95 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <SummaryCard
          title="Total Net Balance"
          amountCents={metrics.totalBalanceCents}
          icon={Wallet}
          trendPercentage={12.4}
          gradient="purple"
          isBalanceCard={true}
        />
        <SummaryCard
          title="Monthly Income"
          amountCents={metrics.incomeCents}
          icon={ArrowUpRight}
          trendPercentage={8.2}
          gradient="emerald"
        />
        <SummaryCard
          title="Monthly Expenses"
          amountCents={metrics.expenseCents}
          icon={ArrowDownLeft}
          trendPercentage={-3.5}
          gradient="rose"
        />
        <SummaryCard
          title="Net Cash Flow"
          amountCents={metrics.netCashFlowCents}
          icon={PiggyBank}
          trendLabel={`Savings rate: ${metrics.savingsRate}%`}
          trendPercentage={metrics.savingsRate}
          gradient="cyan"
        />
      </div>

      {/* Two Column Grid: Main Chart & Virtual Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left (2 columns): Cash Flow Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          <IncomeExpenseChart data={data?.chartData || []} />
          <RecentTransactionsWidget
            transactions={data?.recentTransactions || []}
          />
        </div>

        {/* Right (1 column): Virtual Card, Category Breakdown, Upcoming Bills */}
        <div className="space-y-6">
          <VirtualCardWidget
            card={data?.virtualCard}
            onCardUpdated={loadDashboardData}
          />
          <UpcomingPaymentsWidget
            bills={data?.upcomingPayments || []}
            onBillPaid={loadDashboardData}
          />
          <CategorySpendingWidget
            categories={data?.categoryBreakdown || []}
            totalExpenseCents={metrics.expenseCents}
          />
        </div>
      </div>

      <QuickActionsModal
        isOpen={isQuickActionOpen}
        defaultType={quickActionType}
        onClose={() => setIsQuickActionOpen(false)}
        onSuccess={loadDashboardData}
      />
    </AppLayout>
  );
}
