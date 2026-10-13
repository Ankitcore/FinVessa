import React from "react";
import Link from "next/link";
import { Sparkles, Home, ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none -bottom-20 -right-20" />

      {/* Main Glass Box */}
      <div className="glass-card max-w-lg w-full rounded-3xl p-8 sm:p-10 border border-white/10 text-center relative z-10 shadow-2xl">
        {/* Glowing Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] mx-auto mb-6 shadow-glow">
          <div className="w-full h-full bg-[#0d1424] rounded-[15px] flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* 404 Header */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-gradient-purple-cyan mb-2">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Financial Route Not Found
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The page or transaction route you are looking for does not exist, has been archived, or requires elevated authorization.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow transition-all active:scale-95"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link
            href="/transactions"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-medium text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> View Transactions
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400 flex items-center gap-1.5 z-10">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> FINVESSA Secure Core • © 2026 FinVessa. All rights reserved to Ankit Kumar.
      </p>
    </div>
  );
}
