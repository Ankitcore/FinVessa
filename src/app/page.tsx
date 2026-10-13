"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PieChart,
  Lock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#080c14] text-white selection:bg-purple-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#080c14]/70 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-glow">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-lg text-white">
              Nova<span className="text-gradient-purple-cyan font-black">Finance</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all active:scale-95"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-8 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Personal Finance Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-[1.1] mb-6">
          Master Your Wealth With <br className="hidden sm:block" />
          <span className="text-gradient-purple-cyan">Flawless Clarity</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          A high-performance personal finance platform built for precision. Experience live cash flow charts, dynamic budget thresholds, virtual obsidian cards, and atomic transfers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-glow transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-cyan-300" /> Open Live Dashboard
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-semibold text-sm transition-all"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-8">
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
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

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.07] py-8 px-6 sm:px-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Nova Finance</span>
          </div>
          <p>© {currentYear} Nova Finance Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-slate-200 transition-colors">
              Sign In
            </Link>
            <Link href="/settings" className="hover:text-slate-200 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
