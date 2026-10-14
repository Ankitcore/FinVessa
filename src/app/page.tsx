"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PieChart,
  Lock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { HowItWorksPresentation } from "@/components/presentation/HowItWorksPresentation";
import { CreatorModal } from "@/components/modals/CreatorModal";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-cyan-500 selection:text-black flex flex-col justify-between relative overflow-x-clip">
      {/* Subtle Hero Horizon Ambient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-b from-cyan-500/10 via-blue-600/05 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar with clean sticky rounded floating transition */}
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? "px-4 sm:px-8 pt-3 pb-1 pointer-events-none"
            : "px-0 pt-0 pb-0"
        }`}
      >
        <div
          className={`w-full transition-all duration-300 ease-out relative ${
            isScrolled
              ? "pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-[#090e1a]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/80 ring-1 ring-cyan-500/20 px-5 sm:px-8 py-3 overflow-hidden flex items-center justify-between"
              : "bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-12 py-4 rounded-none shadow-none flex items-center justify-between"
          }`}
        >
          {/* Subtle top glow line when floating */}
          {isScrolled && (
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
          )}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#090d16] border border-white/10 p-0.5 shadow-glow flex items-center justify-center shrink-0">
              <Image
                src="/favicon.svg"
                alt="FINVESSA Logo"
                width={40}
                height={40}
                unoptimized
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              FIN<span className="text-gradient-cyan font-black">VESSA</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowCreatorModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors whitespace-nowrap cursor-pointer touch-manipulation"
              title="View Creator Information"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Creator</span>
            </button>
            <Link
              href="/how-it-works"
              className="hidden sm:block text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              How It Works
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-glow transition-colors whitespace-nowrap shrink-0"
            >
              <span>{user ? "Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>See your money. Shape your future</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-[1.1] mb-6">
          See Your Money. <br className="hidden sm:block" />
          <span className="text-gradient-cyan">Shape Your Future.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          A high-performance personal finance platform built for precision. Experience live RuPay cards, dynamic budget thresholds, encrypted cash flows, and atomic transfers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-glow transition-colors"
          >
            <Zap className="w-4 h-4 text-slate-950" /> Open Live Dashboard
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-semibold text-sm transition-colors"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Presentation Deck: How It Works & How to Use It */}
        <section className="w-full my-12 text-left" id="presentation">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Interactive Presentation Form</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                How It Works & How to Use It
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Step through the live slide deck to inspect the Bharat banking architecture, atomic double-entry ledger, and complete operator workflow.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Full Operational Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <HowItWorksPresentation />
        </section>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-8">
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Authoritative Cash Flow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Excludes internal transfers, verifies minor units, and plots responsive Recharts comparisons with dynamic date ranges.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Virtual Obsidian Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Holographic mesh cards with EMV chip design, full digit toggles, freeze/unfreeze security, and real-time limits.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Atomic Money Transfers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Debit and credit operations run in atomic database transactions, preventing race conditions or inconsistent balances.
            </p>
          </div>
        </div>
      </main>

      {/* Creator Pop-up Modal */}
      <CreatorModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
      />

      {/* Global Comprehensive Footer */}
      <Footer />
    </div>
  );
}
