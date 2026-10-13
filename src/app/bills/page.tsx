"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarCheck,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  Loader2,
  ArrowRight,
  Clock,
  Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function BillsPage() {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();

  const [bills, setBills] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [paid, setPaid] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState("MONTHLY");
  const [category, setCategory] = useState("Utilities & Bills");
  const [accountId, setAccountId] = useState("");
  const [autoPay, setAutoPay] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadBills = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, aRes] = await Promise.all([
        fetch("/api/bills"),
        fetch("/api/accounts"),
      ]);
      if (bRes.ok && aRes.ok) {
        const bData = await bRes.json();
        const aData = await aRes.json();
        setBills(bData.bills || []);
        setUpcoming(bData.upcoming || []);
        setOverdue(bData.overdue || []);
        setPaid(bData.paid || []);
        setSummary(bData.summary || {});
        setAccounts(aData.accounts || []);
        if (aData.accounts?.length > 0 && !accountId) {
          setAccountId(aData.accounts[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amountCents = Math.round(parseFloat(amount) * 100);
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          amountCents,
          dueDate,
          recurrence,
          category,
          accountId: accountId || null,
          autoPay,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Bill "${data.bill.name}" created successfully.`);
        setIsModalOpen(false);
        setName("");
        setAmount("");
        setDueDate("");
        loadBills();
      } else {
        toast.error(data.error || "Failed to create bill");
      }
    } catch {
      toast.error("Network error while creating bill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (billId: string, billName: string) => {
    setPayingId(billId);
    try {
      const res = await fetch(`/api/bills/${billId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_PAID", recordTransaction: true }),
      });
      if (res.ok) {
        toast.success(`Bill "${billName}" marked as paid & debited.`);
        loadBills();
      } else {
        toast.error("Failed to mark bill as paid");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setPayingId(null);
    }
  };

  const handleDeleteBill = async (id: string, billName: string) => {
    if (!confirm(`Delete bill "${billName}"?`)) return;
    try {
      const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Bill deleted successfully.");
        loadBills();
      } else {
        toast.error("Failed to delete bill");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <AppLayout
      title="Bills & Scheduled Payments"
      subtitle="Track recurring obligations, due dates, automated subscriptions, and payment history"
      onRefreshData={loadBills}
    >
      {/* Top Summary & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400">Pending Obligations</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatAmount(summary.upcomingTotalCents || 0)}
            </div>
          </div>
          {overdue.length > 0 && (
            <div className="pl-6 border-l border-rose-500/30">
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Overdue Total
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-400">
                {formatAmount(summary.overdueTotalCents || 0)}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bill</span>
        </button>
      </div>

      {/* Overdue Section (if any) */}
      {overdue.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-rose-500/40 bg-rose-950/10 mb-6">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" /> Immediate Action Required ({overdue.length} Overdue)
          </h3>
          <div className="space-y-2">
            {overdue.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-rose-500/20"
              >
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {bill.name}
                  </p>
                  <p className="text-[11px] text-rose-300">
                    Was due on {formatDate(bill.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-white">
                    {formatAmount(bill.amountCents)}
                  </span>
                  <button
                    onClick={() => handleMarkPaid(bill.id, bill.name)}
                    disabled={payingId === bill.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    {payingId === bill.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bills List */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Upcoming Scheduled Bills
        </h3>

        {loading ? (
          <div className="py-12 flex justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No upcoming bills scheduled.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {upcoming.map((bill) => (
              <div
                key={bill.id}
                className="py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 truncate">
                      {bill.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Due: {formatDate(bill.dueDate)} • {bill.recurrence} •{" "}
                      {bill.account?.name || "Checking"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-white">
                    {formatAmount(bill.amountCents)}
                  </span>
                  <button
                    onClick={() => handleMarkPaid(bill.id, bill.name)}
                    disabled={payingId === bill.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    {payingId === bill.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Mark Paid
                  </button>
                  <button
                    onClick={() => handleDeleteBill(bill.id, bill.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    title="Delete bill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paid Bills History */}
      {paid.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settled Payments
          </h3>
          <div className="divide-y divide-white/[0.04]">
            {paid.map((bill) => (
              <div
                key={bill.id}
                className="py-3 flex items-center justify-between text-xs text-slate-300"
              >
                <div>
                  <span className="font-semibold text-slate-200">{bill.name}</span>
                  <span className="text-slate-400 block text-[11px]">
                    Paid on {formatDate(bill.updatedAt || bill.dueDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-400">
                    {formatAmount(bill.amountCents)}
                  </span>
                  <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white">
                Add Scheduled Bill
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Power Electricity, Airtel Fiber, HDFC EMI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="3420.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0f1626] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                    className="w-full bg-[#0f1626] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all min-h-[44px]"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="ONCE">One-time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account to Pay From
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all min-h-[44px]"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatAmount(a.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="autoPayCheck"
                  checked={autoPay}
                  onChange={(e) => setAutoPay(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/[0.06] border-white/20 text-purple-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="autoPayCheck" className="text-xs text-slate-300 cursor-pointer select-none">
                  Enable automatic payment reminder badge
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow transition-all min-h-[44px]"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Schedule Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
