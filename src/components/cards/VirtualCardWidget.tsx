"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wifi,
  Eye,
  EyeOff,
  Snowflake,
  ShieldCheck,
  CreditCard as CardIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface VirtualCardData {
  id: string;
  cardholderName: string;
  cardNumberMasked: string;
  fullNumber?: string | null;
  cardExpiry: string;
  cardCvv: string;
  cardType: string;
  cardStyle: string;
  isFrozen: boolean;
  spendingLimitCents: number;
}

interface VirtualCardWidgetProps {
  card?: VirtualCardData | null;
  onCardUpdated?: () => void;
}

export function VirtualCardWidget({ card, onCardUpdated }: VirtualCardWidgetProps) {
  const { toast } = useToast();
  const [showFullNumber, setShowFullNumber] = useState<boolean>(false);
  const [showCvv, setShowCvv] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(card?.isFrozen || false);
  const [loading, setLoading] = useState<boolean>(false);

  const cardNumber = card
    ? showFullNumber && card.fullNumber
      ? card.fullNumber
      : card.cardNumberMasked
    : "•••• •••• •••• 8291";

  const cardholder = card?.cardholderName || "AARAV SHARMA";
  const expiry = card?.cardExpiry || "08/29";
  const cvv = showCvv ? card?.cardCvv || "739" : "•••";

  const toggleFreeze = async () => {
    if (!card) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${card.id}/freeze`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        setIsFrozen(data.card.isFrozen);
        toast.info(data.message || "Card status updated");
        if (onCardUpdated) onCardUpdated();
      } else {
        toast.error("Failed to toggle card status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Ambient Breathing Glow Backdrop */}
      <motion.div
        animate={{
          opacity: [0.55, 0.85, 0.55],
          scale: [0.99, 1.01, 0.99],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/40 via-cyan-500/30 to-purple-800/40 blur-xl pointer-events-none"
      />

      {/* Main Virtual Card Element */}
      <motion.div
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.25 } }}
        className={`relative w-full rounded-2xl p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 overflow-hidden border ${
          isFrozen
            ? "bg-slate-900/90 border-cyan-500/30 saturate-50"
            : "bg-gradient-to-br from-[#4c1d95]/90 via-[#1e1b4b]/95 to-[#064e3b]/80 border-white/20"
        }`}
        style={{
          minHeight: "220px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Decorative holographic gradient mesh */}
        <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Frozen Overlay Badge if Frozen */}
        {isFrozen && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Snowflake className="w-3.5 h-3.5 animate-spin" /> FROZEN
          </div>
        )}

        {/* Card Header: Brand & Contactless */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-black/40 border border-white/20 p-0.5 shrink-0 flex items-center justify-center">
              <Image
                src="/finvessa-icon.png"
                alt="FINVESSA"
                width={28}
                height={28}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-xs sm:text-sm text-slate-100 flex items-center gap-1">
                FINVESSA <span className="text-cyan-300 font-normal">ELITE</span>
              </span>
              <span className="text-[8px] text-orange-400 font-semibold tracking-widest block uppercase">
                BHARAT • RUPAY PLATINUM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Wifi className="w-5 h-5 rotate-90" />
          </div>
        </div>

        {/* EMV Chip and Number */}
        <div className="flex items-center gap-4 mb-5">
          {/* Realistic metallic chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-500 border border-yellow-600/60 shadow-sm flex items-center justify-center p-1">
            <div className="w-full h-full border border-yellow-800/30 rounded flex">
              <div className="w-1/2 border-r border-yellow-800/30" />
            </div>
          </div>

          {/* Number */}
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="font-mono text-xs sm:text-base md:text-lg tracking-wider sm:tracking-widest font-semibold drop-shadow truncate pr-1">
              {cardNumber}
            </span>
            <button
              onClick={() => setShowFullNumber((prev) => !prev)}
              className="p-1.5 text-slate-300 hover:text-white transition-colors shrink-0"
              title={showFullNumber ? "Hide digits" : "Reveal full digits"}
            >
              {showFullNumber ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Card Footer: Details */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
              Cardholder
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
              {cardholder}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
              Expires
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
              {expiry}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
              CVV
            </p>
            <button
              onClick={() => setShowCvv((prev) => !prev)}
              className="text-xs sm:text-sm font-mono font-semibold text-slate-100 hover:text-cyan-300 transition-colors"
              title="Click to toggle CVV"
            >
              {cvv}
            </button>
          </div>

          {/* RuPay / Visa / Mastercard badge */}
          <div className="flex flex-col items-end">
            {card?.cardType === "VISA" ? (
              <>
                <span className="font-black italic text-lg sm:text-xl tracking-tighter text-white drop-shadow">
                  VISA
                </span>
                <span className="text-[8px] uppercase tracking-widest text-cyan-200">
                  Signature
                </span>
              </>
            ) : card?.cardType === "MASTERCARD" ? (
              <>
                <span className="font-black italic text-base sm:text-lg tracking-tighter text-white drop-shadow">
                  Mastercard
                </span>
                <span className="text-[8px] uppercase tracking-widest text-cyan-200">
                  World
                </span>
              </>
            ) : (
              <>
                <span className="font-black italic text-lg sm:text-xl tracking-tighter text-white drop-shadow flex items-center">
                  RuPay<span className="text-orange-400 not-italic font-black text-sm ml-0.5">❯</span>
                </span>
                <span className="text-[8px] uppercase tracking-widest text-cyan-200">
                  Platinum
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Card Quick Controls underneath */}
      <div className="flex items-center justify-between mt-3 px-2 text-xs">
        <button
          onClick={toggleFreeze}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            isFrozen
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
              : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span>{isFrozen ? "Unfreeze Card" : "Freeze Card"}</span>
        </button>

        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Limit: {formatCurrency(card?.spendingLimitCents || 500000)}</span>
        </div>
      </div>
    </motion.div>
  );
}
