import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, CheckCircle2, Shield, AlertTriangle, Scale, Lock } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  const lastUpdated = "October 14, 2026";

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between relative overflow-x-clip">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#090d16] border border-white/10 p-0.5 shadow-glow flex items-center justify-center shrink-0">
              <Image
                src="/favicon.svg"
                alt="FINVESSA Logo"
                width={36}
                height={36}
                unoptimized
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              FIN<span className="text-gradient-cyan font-black">VESSA</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 relative z-10 w-full">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
          <FileText className="w-4 h-4" />
          <span>User Agreement & Service Conditions</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Effective Date: {lastUpdated} | Governing Jurisdiction: New Delhi, India
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Personal Tracking</h3>
            <p className="text-xs text-slate-400">
              Engineered exclusively for individual budgeting, financial modeling, and ledger analytics.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Non-Advisory Tool</h3>
            <p className="text-xs text-slate-400">
              FINVESSA is an analytical calculator and visualizer, not a SEBI-registered portfolio advisory service.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Authoritative Rights</h3>
            <p className="text-xs text-slate-400">
              © 2026 FinVessa. All architecture, design systems, and software assets reserved to Ankit Kumar.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering for, or using the FINVESSA platform (including https://finvessa.vercel.app and connected domain aliases), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to these terms, do not access or use the application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span> Scope of Service & Platform Purpose
            </h2>
            <p>
              FINVESSA is a self-directed financial dashboard, budget optimizer, and ledger management software application. The features provided include:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs sm:text-sm">
              <li>Real-time visualization of income, expenses, and net cash flow balances.</li>
              <li>Virtual RuPay and Visa card management for spending limit allocation and transaction simulations.</li>
              <li>Monthly category envelopes, bill tracking, and due date reminders.</li>
              <li>Atomic double-entry transaction calculations across simulated user accounts.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span> Not Financial or Investment Advice
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Important Legal Notice:</strong> FINVESSA is not a registered investment advisor, broker-dealer, or portfolio manager under the Securities and Exchange Board of India (SEBI) or any other regulatory authority. All analytics, projections, savings rates, and categorization figures are generated for informational purposes only. You are solely responsible for your investment and financial decisions.
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">04.</span> Account Security and Responsibilities
            </h2>
            <p>
              You agree to maintain the confidentiality of your login credentials and are completely responsible for all activities occurring under your account. You agree to notify FINVESSA immediately upon learning of any unauthorized access or security compromise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">05.</span> Intellectual Property Rights
            </h2>
            <p>
              All trademarks, source code, visual design elements, UX patterns, icons, background animation systems (including the Capital Current framework), and database schemas are the intellectual property of FinVessa and Ankit Kumar. You may not decompile, reverse-engineer, clone, or redistribute the platform without prior written authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">06.</span> Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, FINVESSA and its creators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the platform, data inaccuracies, or temporary service interruptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">07.</span> Governing Law & Disputes
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising from or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts of New Delhi, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
