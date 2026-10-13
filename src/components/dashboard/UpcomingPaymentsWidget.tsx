"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

interface BillItem {
  id: string;
  name: string;
  amountCents: number;
  dueDate: string;
  category: string;
  status: string;
  account?: { name: string } | null;
}

interface UpcomingPaymentsWidgetProps {
  bills: BillItem[];
  onBillPaid?: () => void;
}

export function UpcomingPaymentsWidget({
  bills,
  onBillPaid,
}: UpcomingPaymentsWidgetProps) {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();
  const [payingId, setPayingId] = useState<string | null>(null);

  const handlePayNow = async (billId: string, billName: string) => {
    setPayingId(billId);
    try {
      const res = await fetch(`/api/bills/${billId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_PAID", recordTransaction: true }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Bill "${billName}" marked as paid.`);
        if (onBillPaid) onBillPaid();
      } else {
        toast.error(data.error || "Failed to process bill payment");
      }
    } catch {
      toast.error("Network error while updating bill");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            Upcoming Payments
          </h2>
          <p className="text-xs text-slate-400">Scheduled bills & due dates</p>
        </div>
        <Link
          href="/bills"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors group"
        >
          Manage bills{" "}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Bill Items */}
      <div className="space-y-3">
        {bills.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No upcoming bills pending payment.
          </div>
        ) : (
          bills.map((bill) => {
            const isDueSoon = new Date(bill.dueDate) <= new Date();
            const isPaying = payingId === bill.id;

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isDueSoon
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    {isDueSoon ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                      {bill.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Due {formatDate(bill.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {formatAmount(bill.amountCents)}
                  </span>
                  <button
                    onClick={() => handlePayNow(bill.id, bill.name)}
                    disabled={isPaying}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isPaying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
