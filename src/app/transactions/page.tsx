"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { QuickActionsModal } from "@/components/modals/QuickActionsModal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function TransactionsPage() {
  const { formatAmount, currency } = useCurrency();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [accountId, setAccountId] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Modals & dialogs
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any | null>(null);
  const [deletingTx, setDeletingTx] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        type: typeFilter,
        accountId,
        categoryId,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/transactions?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, typeFilter, accountId, categoryId, sortBy, sortOrder]);

  // Load accounts and categories
  useEffect(() => {
    async function loadMeta() {
      try {
        const [accRes, catRes] = await Promise.all([
          fetch("/api/accounts"),
          fetch("/api/categories"),
        ]);
        if (accRes.ok && catRes.ok) {
          const accJson = await accRes.json();
          const catJson = await catRes.json();
          setAccounts(accJson.accounts || []);
          setCategories(catJson.categories || []);
        }
      } catch {
        // ignore
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDelete = async () => {
    if (!deletingTx) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/transactions/${deletingTx.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Transaction deleted successfully.");
        setDeletingTx(null);
        loadTransactions();
      } else {
        toast.error("Failed to delete transaction.");
      }
    } catch {
      toast.error("Network error while deleting transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOpen = (tx: any) => {
    setEditingTx(tx);
    setEditDesc(tx.description);
    setEditAmount((tx.amountCents / 100).toFixed(2));
    setEditCategory(tx.categoryId || "");
    setEditDate(new Date(tx.date).toISOString().split("T")[0]);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    setIsSubmitting(true);
    try {
      const parsedAmount = Math.round(parseFloat(editAmount) * 100);
      const res = await fetch(`/api/transactions/${editingTx.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editDesc,
          amountCents: parsedAmount,
          categoryId: editCategory || null,
          date: new Date(editDate).toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("Transaction updated successfully.");
        setEditingTx(null);
        loadTransactions();
      } else {
        toast.error("Failed to update transaction.");
      }
    } catch {
      toast.error("Network error while updating transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Transactions"
      subtitle="Comprehensive ledger of all inflows, outflows, and transfers"
      onRefreshData={loadTransactions}
    >
      {/* Top Controls Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by description or merchant..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Add Transaction Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters and Sorting Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/[0.06]">
          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Sort By
            </label>
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
              >
                <option value="date">Date</option>
                <option value="amountCents">Amount</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="p-1.5 bg-[#0f1626] border border-white/[0.08] rounded-xl text-slate-300 hover:text-white"
                title={`Sort ${sortOrder === "desc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
            <p className="text-xs">Loading transaction ledger...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 px-4">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              No transactions match your criteria
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms, categories, or date range.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Account</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  const isTransfer = tx.type === "TRANSFER";

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                              isIncome
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : isTransfer
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                                : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : isTransfer ? (
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100 block">
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-slate-300 uppercase tracking-wider">
                              {tx.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {tx.category ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                            style={{
                              backgroundColor: `${tx.category.color}15`,
                              borderColor: `${tx.category.color}35`,
                              color: tx.category.color,
                            }}
                          >
                            {tx.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">General</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-xs">
                        {tx.account?.name || "Primary"}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-xs whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            isIncome
                              ? "text-emerald-400"
                              : isTransfer
                              ? "text-cyan-400"
                              : "text-slate-100"
                          }`}
                        >
                          {isIncome ? "+" : isTransfer ? "" : "-"}
                          {formatAmount(tx.amountCents)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditOpen(tx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTx(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/[0.06] bg-white/[0.01] gap-3 text-xs text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-200">
              {transactions.length === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-200">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-200">
              {pagination.total}
            </span>{" "}
            transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
              }
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="px-2 text-slate-300 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  page: Math.min(p.totalPages, p.page + 1),
                }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTx && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-sm w-full rounded-2xl p-6 border border-rose-500/30 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Delete Transaction?
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Are you sure you want to delete &ldquo;{deletingTx.description}&rdquo;? The
              associated account balance will be atomically reversed.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingTx(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white">
                Edit Transaction
              </h3>
              <button
                onClick={() => setEditingTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan transition-all"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickActionsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadTransactions}
      />
    </AppLayout>
  );
}
