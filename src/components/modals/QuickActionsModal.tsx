"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: "INCOME" | "EXPENSE" | "TRANSFER";
}

interface AccountOption {
  id: string;
  name: string;
  balanceCents: number;
}

interface CategoryOption {
  id: string;
  name: string;
  type: string;
}

export function QuickActionsModal({
  isOpen,
  onClose,
  onSuccess,
  defaultType = "EXPENSE",
}: QuickActionsModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"INCOME" | "EXPENSE" | "TRANSFER">(
    defaultType
  );

  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form fields
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [transferAccountId, setTransferAccountId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setActiveTab(defaultType);
  }, [defaultType]);

  // Load user accounts and categories
  useEffect(() => {
    if (!isOpen) return;
    async function loadData() {
      setLoading(true);
      try {
        const [accRes, catRes] = await Promise.all([
          fetch("/api/accounts"),
          fetch("/api/categories"),
        ]);
        if (accRes.ok && catRes.ok) {
          const accData = await accRes.json();
          const catData = await catRes.json();
          setAccounts(accData.accounts || []);
          setCategories(catData.categories || []);

          if (accData.accounts?.length > 0) {
            setAccountId(accData.accounts[0].id);
            if (accData.accounts.length > 1) {
              setTransferAccountId(accData.accounts[1].id);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0");
      return;
    }

    const amountCents = Math.round(parsedAmount * 100);

    if (!accountId) {
      setErrorMsg("Please select an account");
      return;
    }

    if (activeTab === "TRANSFER") {
      if (!transferAccountId) {
        setErrorMsg("Please select a destination account");
        return;
      }
      if (accountId === transferAccountId) {
        setErrorMsg("Source and destination accounts must be different");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: activeTab,
        amountCents,
        accountId,
        description: description.trim() || (activeTab === "TRANSFER" ? "Account Transfer" : "Transaction"),
        date: new Date(date).toISOString(),
        categoryId: categoryId || null,
        transferAccountId: activeTab === "TRANSFER" ? transferAccountId : null,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create transaction");
        toast.error(data.error || "Failed to create transaction");
        return;
      }

      toast.success(
        activeTab === "INCOME"
          ? "Income added successfully."
          : activeTab === "EXPENSE"
          ? "Expense added successfully."
          : "Transfer completed successfully."
      );

      // Reset form
      setAmount("");
      setDescription("");
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg("An unexpected network error occurred.");
      toast.error("Unable to save your transaction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    activeTab === "INCOME" ? c.type === "INCOME" : c.type === "EXPENSE"
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#0e1526] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Record Transaction
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 p-1.5 my-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("EXPENSE")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] ${
              activeTab === "EXPENSE"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("INCOME")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] ${
              activeTab === "INCOME"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Income
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TRANSFER")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] ${
              activeTab === "TRANSFER"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl pl-8 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder={
                activeTab === "EXPENSE"
                  ? "e.g. Blinkit groceries, Swiggy, Zepto, Uber"
                  : activeTab === "INCOME"
                  ? "e.g. Tech salary credit, Client UPI payout"
                  : "e.g. Transfer to SBI Savings Vault"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-white/[0.04] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Account Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {activeTab === "TRANSFER" ? "From Account" : "Account"}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-[#131b2e] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white outline-none min-h-[44px]"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "TRANSFER" ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  To Account
                </label>
                <select
                  value={transferAccountId}
                  onChange={(e) => setTransferAccountId(e.target.value)}
                  className="w-full bg-[#131b2e] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white outline-none min-h-[44px]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#131b2e] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white outline-none min-h-[44px]"
                >
                  <option value="">Uncategorized</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#131b2e] border border-white/[0.09] focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white outline-none min-h-[44px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />}
              {activeTab === "INCOME"
                ? "Add Income"
                : activeTab === "EXPENSE"
                ? "Add Expense"
                : "Transfer Funds"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
