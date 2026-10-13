"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Plus,
  Snowflake,
  ShieldCheck,
  Eye,
  EyeOff,
  Wifi,
  Sliders,
  Check,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VirtualCardWidget } from "@/components/cards/VirtualCardWidget";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function CardsPage() {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [cardholderName, setCardholderName] = useState("Spershika Sharma");
  const [accountId, setAccountId] = useState("");
  const [cardType, setCardType] = useState("RUPAY");
  const [cardStyle, setCardStyle] = useState("PURPLE_CYAN");
  const [newLimit, setNewLimit] = useState("50000");
  const [submitting, setSubmitting] = useState(false);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      const [cRes, aRes] = await Promise.all([
        fetch("/api/cards"),
        fetch("/api/accounts"),
      ]);
      if (cRes.ok && aRes.ok) {
        const cData = await cRes.json();
        const aData = await aRes.json();
        setCards(cData.cards || []);
        setAccounts(aData.accounts || []);
        if (cData.cards?.length > 0 && !selectedCard) {
          setSelectedCard(cData.cards[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const limitCents = Math.round(parseFloat(newLimit) * 100);
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardholderName,
          accountId: accountId || null,
          cardType,
          cardStyle,
          spendingLimitCents: limitCents,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Virtual Card issued successfully.");
        setIsAddOpen(false);
        loadCards();
      } else {
        toast.error(data.error || "Failed to create card");
      }
    } catch {
      toast.error("Network error while creating card");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    setSubmitting(true);
    try {
      const limitCents = Math.round(parseFloat(newLimit) * 100);
      const res = await fetch(`/api/cards/${selectedCard.id}/limit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spendingLimitCents: limitCents }),
      });
      if (res.ok) {
        toast.success("Spending limit updated.");
        setIsLimitOpen(false);
        loadCards();
      } else {
        toast.error("Failed to update limit");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Virtual Cards & Security"
      subtitle="Issue disposable or persistent virtual cards with instant freeze capabilities and granular spending limits"
      onRefreshData={loadCards}
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs text-slate-400">Total Active Cards</span>
          <div className="text-2xl font-black text-white">{cards.length}</div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Card</span>
        </button>
      </div>

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="space-y-4"
              onClick={() => setSelectedCard(card)}
            >
              <VirtualCardWidget card={card} onCardUpdated={loadCards} />

              <div className="flex items-center justify-between px-2 text-xs">
                <span className="text-slate-400">
                  Linked: <strong className="text-white">{card.account?.name || "Unlinked"}</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedCard(card);
                    setNewLimit((card.spendingLimitCents / 100).toString());
                    setIsLimitOpen(true);
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" /> Adjust Limit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Info Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Virtual Card Privacy Architecture
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Virtual cards protect your primary account numbers against unauthorized recurring charges and merchant compromises. You can freeze or unfreeze cards instantly with 1-click toggling, or adjust monthly spending caps at any time.
        </p>
      </div>

      {/* Issue Card Modal */}
      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white">
                Issue Virtual Card
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Funding Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-[#0f1626] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all min-h-[44px]"
                >
                  <option value="">No Account (Standalone Virtual)</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatAmount(a.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Network
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full bg-[#0f1626] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all min-h-[44px]"
                  >
                    <option value="RUPAY">RuPay Platinum</option>
                    <option value="VISA">Visa Infinite</option>
                    <option value="MASTERCARD">Mastercard World</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monthly Cap (₹)
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
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
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Limit Modal */}
      {isLimitOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="glass-card max-w-sm w-full rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">
              Adjust Spending Limit
            </h3>
            <form onSubmit={handleUpdateLimit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Monthly Limit (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  required
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-base font-bold text-white outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLimitOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan min-h-[44px]"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
