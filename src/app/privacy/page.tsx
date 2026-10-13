import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Server, RefreshCw, FileText } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="w-4 h-4" />
          <span>FINVESSA Data Governance Standard</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Effective Date: {lastUpdated} | Governing Architecture: Indian DPDP Act 2023 & RBI Security Standards
        </p>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Zero Bank Credentials</h3>
            <p className="text-xs text-slate-400">
              No real ATM PINs, net banking passwords, or card CVVs are ever requested, processed, or stored.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">AES-256 at Rest</h3>
            <p className="text-xs text-slate-400">
              Ledger records, accounts, and profile parameters are secured with modern cryptographic hashing.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">100% Data Portability</h3>
            <p className="text-xs text-slate-400">
              Export your complete financial records as structured JSON or permanently purge your account at any time.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span> Information We Collect
            </h2>
            <p>
              FINVESSA collects only the minimal data required to provide precise personal wealth tracking, cash flow analytics, and budget monitoring:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs sm:text-sm">
              <li><strong>Account Credentials:</strong> Full name, verified email address, and salt-hashed passwords (via bcrypt).</li>
              <li><strong>Financial Ledger Records:</strong> Transaction descriptions, minor currency amounts (paise or cents), category labels, and timestamps entered by you or loaded via sandbox test fixtures.</li>
              <li><strong>Account Configurations:</strong> Account nicknames, masked identifiers (e.g., last 4 digits), institution types, and simulated card parameters.</li>
              <li><strong>User Preferences:</strong> Primary display currency (INR, USD, EUR, etc.), balance privacy toggle states, and regional formatting options.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span> How We Use Your Data
            </h2>
            <p>
              Your data is exclusively processed to compute your financial dashboards:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs sm:text-sm">
              <li>Generating real-time income, expense, and savings rate calculations.</li>
              <li>Plotting interactive Recharts visual trends excluding internal transfers to maintain statistical accuracy.</li>
              <li>Monitoring budget utilization envelopes and sending proactive bill due date alerts.</li>
              <li>Simulating atomic double-entry balance transfers between your internal account records.</li>
            </ul>
            <p className="text-xs text-slate-400 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
              <strong>Zero Data Monetization:</strong> FINVESSA never sells, leases, rents, or licenses your personal or financial data to advertising networks, credit bureaus, or third-party aggregators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span> Simulated Financial Instruments
            </h2>
            <p>
              FINVESSA incorporates RuPay and Visa virtual card widgets, EMV chip visual interfaces, and linked bank cards. All virtual cards, account numbers, and transaction tokens represent client-side simulation structures. FINVESSA will never ask for your real banking passwords, UPI PINs, or physical debit/credit card CVV codes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">04.</span> Regulatory Alignment: DPDP Act 2023
            </h2>
            <p>
              In alignment with the Digital Personal Data Protection (DPDP) Act 2023 of India, FINVESSA adheres to the following principles:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400 text-xs sm:text-sm">
              <li><strong>Right to Access:</strong> You have full visibility into every record stored within your account through the Settings and Transactions ledger.</li>
              <li><strong>Right to Correction:</strong> You may modify or update account names, transactions, and categories at any time.</li>
              <li><strong>Right to Erasure (Forgotten):</strong> You may permanently delete your account and associated ledger history with a single action in Settings.</li>
              <li><strong>Data Minimization:</strong> We do not log device telemetry, GPS coordinates, or biometric identifiers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">05.</span> Telemetry, Cookies, and Tracking
            </h2>
            <p>
              FINVESSA does not utilize third-party tracking pixels, marketing beacons, or advertising cookies. Our application utilizes only strict, first-party HTTP-only session cookies and local storage tokens strictly necessary to maintain authentication state and client preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono">06.</span> Contact & Data Grievance Officer
            </h2>
            <p>
              For privacy inquiries, audit requests, or data deletion verification, contact the Data Protection Officer:
            </p>
            <div className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl text-xs space-y-1 text-slate-300">
              <p className="font-bold text-white">FINVESSA Legal & Compliance</p>
              <p>Officer: Ankit Kumar</p>
              <p>Email: privacy@finvessa.vercel.app</p>
              <p>Jurisdiction: New Delhi, India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
