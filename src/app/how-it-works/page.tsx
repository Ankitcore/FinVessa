"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Cpu,
} from "lucide-react";
import { HowItWorksPresentation } from "@/components/presentation/HowItWorksPresentation";
import { Footer } from "@/components/layout/Footer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-glow transition-colors"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Presentation & Operational Blueprint</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            How FINVESSA Works & <br className="hidden sm:block" />
            <span className="text-gradient-cyan">How to Use the Platform</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Step through our interactive presentation deck below to explore the core architecture, atomic ledger mechanics, and complete operator walkthrough.
          </p>
        </div>

        {/* Interactive Presentation Deck */}
        <div className="mb-20">
          <HowItWorksPresentation />
        </div>

        {/* Platform Architecture Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Atomic Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every money transfer executes as a single ACID transaction. Balances are adjusted with integer-precision arithmetic to guarantee zero rounding discrepancies.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero-Trust Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Obsidian virtual cards run on independent spending limits with 1-click freezing. Sensitive bank credentials are never stored or exposed to third parties.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Regulatory Alignment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compliant with the Digital Personal Data Protection Act 2023 and RBI data localization guidelines. All stored records reside within Indian borders.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-cyan-500/30 text-center relative overflow-hidden mb-12 shadow-2xl">
          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to experience institutional personal finance?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8">
            Take full command of your cash flows, dynamic budgets, and virtual cards with zero latency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-cyan transition-colors"
            >
              Open Live Dashboard
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-xs sm:text-sm transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
