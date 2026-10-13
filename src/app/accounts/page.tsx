"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  CreditCard,
  Building,
  PiggyBank,
  DollarSign,
  Archive,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function AccountsPage() {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [accountTransactions, setAccountTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  // Form states
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState("CHECKING");
  const [createBalance, setCreateBalance] = useState("1000.00");
  const [createColor, setCreateColor] = useState("#8B5CF6");
  const [submitting, setSubmitting] = useState(false);

  // Transfer states
  const [fromAccId, setFromAccId] = useState("");
  const [toAccId, setToAccId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDesc, setTransferDesc] = useState("Vault Rebalance");

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        if (data.accounts?.length > 0 && !selectedAccount) {
          setSelectedAccount(data.accounts[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Load transactions for the currently inspected account
  useEffect(() => {
    if (!selectedAccount) return;
    async function loadAccountTx() {
      setTxLoading(true);
      try {
        const res = await fetch(
          `/api/transactions?accountId=${selectedAccount.id}&limit=8`
        );
        if (res.ok) {
          const data = await res.json();
          setAccountTransactions(data.transactions || []);
        }
      } catch {
        // ignore
      } finally {
        setTxLoading(false);
      }
    }
    loadAccountTx();
  }, [selectedAccount]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const balanceCents = Math.round(parseFloat(createBalance) * 100);
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          type: createType,
          balanceCents: isNaN(balanceCents) ? 0 : balanceCents,
          color: createColor,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Account "${data.account.name}" created successfully.`);
        setIsCreateOpen(false);
        setCreateName("");
        loadAccounts();
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch {
      toast.error("Network error while creating account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amountCents = Math.round(parseFloat(transferAmount) * 100);
      const res = await fetch("/api/accounts/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: fromAccId,
          toAccountId: toAccId,
          amountCents,
          description: transferDesc,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Transfer completed successfully.");
        setIsTransferOpen(false);
        setTransferAmount("");
        loadAccounts();
      } else {
        toast.error(data.error || "Transfer failed");
      }
    } catch {
      toast.error("Network error during transfer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveAccount = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive or remove "${name}"?`)) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Account archived successfully.");
        loadAccounts();
      } else {
        toast.error(data.error || "Failed to archive account");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "SAVINGS":
        return PiggyBank;
      case "CREDIT_CARD":
        return CreditCard;
      case "INVESTMENT":
        return TrendingUp;
      case "CASH":
        return DollarSign;
      default:
        return Building;
    }
  };

  const totalAssets = accounts
    .filter((a) => a.type !== "CREDIT_CARD")
    .reduce((sum, a) => sum + a.balanceCents, 0);

  return (
    <AppLayout
      title="Accounts & Portfolios"
      subtitle="Manage checking, high-yield vaults, investment portfolios, and lines of credit"
      onRefreshData={loadAccounts}
    >
      {/* Top Header Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs text-slate-400">Total Asset Valuation</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatAmount(totalAssets)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (accounts.length >= 2) {
                setFromAccId(accounts[0].id);
                setToAccId(accounts[1].id);
              }
              setIsTransferOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-glow-cyan transition-all active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Money</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Account</span>
          </button>
        </div>
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {loading ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-2" />
            <p className="text-xs">Loading accounts...</p>
          </div>
        ) : (
          accounts.map((acc) => {
            const Icon = getAccountIcon(acc.type);
            const isSelected = selectedAccount?.id === acc.id;

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className={`glass-card glass-card-hover rounded-2xl p-5 border cursor-pointer transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-cyan-400/60 shadow-glow-cyan bg-slate-900/80"
                    : "border-white/[0.08]"
                }`}
              >
                {/* Decorative glow */}
                <div
                  className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: acc.color || "#8B5CF6" }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${acc.color}15`,
                      borderColor: `${acc.color}35`,
                      color: acc.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      {acc.type.replace("_", " ")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveAccount(acc.id, acc.name);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Archive or delete account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-1 truncate">
                  {acc.name}
                </h3>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
                  {formatAmount(acc.balanceCents)}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.06]">
                  <span>{acc._count?.transactions || 0} transactions</span>
                  <span className="text-cyan-400 font-medium">
                    {isSelected ? "Inspecting" : "Click to view"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Account Detail & History */}
      {selectedAccount && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Recent Activity: {selectedAccount.name}
              </h2>
              <p className="text-xs text-slate-400">
                Transactions associated specifically with this account
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Current Balance: {formatAmount(selectedAccount.balanceCents)}
            </span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {txLoading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
              </div>
            ) : accountTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No transactions recorded for this account.
              </div>
            ) : (
              accountTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-200">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatDate(tx.date)} • {tx.type}
                    </p>
                  </div>
                  <div className="font-bold text-white">
                    {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}
                    {formatAmount(tx.amountCents)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white">
                Create New Account
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank Salary, SBI Wealth Vault, Zerodha"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="CHECKING">Salary / Current Account</option>
                  <option value="SAVINGS">High Yield Savings</option>
                  <option value="CREDIT_CARD">RuPay / Credit Card (Liability)</option>
                  <option value="INVESTMENT">Mutual Funds & Demat</option>
                  <option value="CASH">Cash / UPI Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Starting Balance (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createBalance}
                  onChange={(e) => setCreateBalance(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {["#8B5CF6", "#06B6D4", "#10B981", "#EC4899", "#F59E0B"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCreateColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          createColor === color
                            ? "border-white scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Atomic Transfer Modal */}
      {isTransferOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-cyan-400" /> Atomic Money
                Transfer
              </h3>
              <button
                onClick={() => setIsTransferOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Account (Debit)
                </label>
                <select
                  value={fromAccId}
                  onChange={(e) => setFromAccId(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatAmount(a.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Destination Account (Credit)
                </label>
                <select
                  value={toAccId}
                  onChange={(e) => setToAccId(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatAmount(a.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Transfer Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-base font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Memo / Note
                </label>
                <input
                  type="text"
                  value={transferDesc}
                  onChange={(e) => setTransferDesc(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan transition-all"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
