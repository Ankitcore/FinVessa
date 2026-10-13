"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Sparkles,
  X,
  ChevronRight,
  ArrowUp,
  CreditCard,
  Building2,
  PieChart,
  Shield,
  Layers,
  RefreshCw,
} from "lucide-react";

export function Footer() {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "security" | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="w-full bg-[#060a12]/95 border-t border-white/[0.08] text-xs text-slate-400 mt-auto relative overflow-hidden">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 via-cyan-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 pb-10 border-b border-white/[0.06]">
            {/* Left Column: Brand & Trust Badges (Spans 2 cols on LG) */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/dashboard" className="inline-flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#090d16] border border-white/10 p-0.5 shadow-glow shrink-0 group-hover:border-purple-500/40 transition-colors">
                  <Image
                    src="/finvessa-icon.png"
                    alt="FINVESSA"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-[9px]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    FIN<span className="text-gradient-purple-cyan font-black">VESSA</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                    IN
                  </span>
                </div>
              </Link>

              <p className="text-cyan-400 font-medium text-xs tracking-wide">
                See your money. Shape your future
              </p>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                India&apos;s next-generation personal finance and wealth management dashboard.
                Unified tracking across HDFC, SBI, ICICI accounts, RuPay cards, recurring bills,
                and Groww/Zerodha investment portfolios.
              </p>

              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational • 99.99% Uptime</span>
              </div>

              {/* Security & Compliance Highlights */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> 256-Bit SSL
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-slate-300">
                  <Lock className="w-3 h-3 text-purple-400" /> Atomic Ledger
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RBI & NPCI Compliant
                </span>
              </div>
            </div>

            {/* Column 1: Core Navigation */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                    Dashboard Overview
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:text-cyan-400 transition-colors">
                    Transactions Ledger
                  </Link>
                </li>
                <li>
                  <Link href="/accounts" className="hover:text-cyan-400 transition-colors">
                    Bank Accounts
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-cyan-400 transition-colors">
                    Cash Flow & Trends
                  </Link>
                </li>
                <li>
                  <Link href="/budgets" className="hover:text-cyan-400 transition-colors">
                    Smart Monthly Budgets
                  </Link>
                </li>
                <li>
                  <Link href="/bills" className="hover:text-cyan-400 transition-colors">
                    Bills & Upcoming Dues
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-cyan-400 transition-colors">
                    Virtual RuPay & Visa Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Indian Banking Ecosystem */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Ecosystem
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center justify-between">
                  <span>HDFC Bank Salary</span>
                  <span className="text-[10px] text-purple-400 font-mono">Linked</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>SBI Wealth Savings</span>
                  <span className="text-[10px] text-purple-400 font-mono">Linked</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>ICICI Sapphiro RuPay</span>
                  <span className="text-[10px] text-purple-400 font-mono">Active</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Zerodha & Groww</span>
                  <span className="text-[10px] text-purple-400 font-mono">Synced</span>
                </li>
                <li>
                  <Link href="/accounts" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    Atomic Fund Transfer <ChevronRight className="w-3 h-3 text-slate-500" />
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    RuPay Virtual Card Shield <ChevronRight className="w-3 h-3 text-slate-500" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Security & Privacy */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Privacy & Controls
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                    Balance Privacy Mask
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                    Profile & Avatar Studio
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                    JSON Data Backup & Export
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                    Multi-Currency (INR, USD, EUR)
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("security")}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Security Architecture
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Compliance */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Governance
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("security")}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Data Protection Standards
                  </button>
                </li>
                <li>
                  <span className="text-slate-400 block pt-1">
                    Currency: <span className="text-slate-300 font-semibold">INR (₹)</span>
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 block">
                    Financial Year: <span className="text-slate-300 font-semibold">FY 2026-27</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright and Regulatory Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
            {/* Primary Required Copyright */}
            <div className="text-center md:text-left">
              <p className="font-semibold text-slate-300 text-xs">
                © 2026 FinVessa. All rights reserved to Ankit Kumar.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                FINVESSA is a secure personal finance ledger & analytics platform engineered for Indian and global citizens.
              </p>
            </div>

            {/* India Pride & Scroll to top */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
                <span>🇮🇳</span>
                <span>Crafted with precision for India</span>
              </span>

              <button
                onClick={scrollToTop}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                title="Scroll to top"
                aria-label="Scroll to top of page"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Compliance & Legal Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-[#0b101c] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                {activeModal === "privacy" && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                {activeModal === "terms" && <FileText className="w-5 h-5 text-purple-400" />}
                {activeModal === "security" && <Lock className="w-5 h-5 text-emerald-400" />}
                <h3 className="text-base font-bold text-white capitalize">
                  {activeModal === "privacy" && "FINVESSA Privacy Policy"}
                  {activeModal === "terms" && "Terms of Service & Usage"}
                  {activeModal === "security" && "Security & Encryption Whitepaper"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-3.5 pt-1">
              {activeModal === "privacy" && (
                <>
                  <p>
                    <strong>1. Commitment to Financial Privacy:</strong> At FINVESSA, your data privacy is paramount.
                    We collect only the essential ledger entries you provide to calculate your monthly cash flows,
                    account balances, and budget utilization.
                  </p>
                  <p>
                    <strong>2. Zero Real Card Storage:</strong> All virtual credit and debit cards visualized on FINVESSA
                    are simulated demonstration records. No actual CVVs, ATM PINs, or real-world bank credentials are ever requested or stored.
                  </p>
                  <p>
                    <strong>3. Data Retention & Portability:</strong> You hold 100% ownership of your records. You can export
                    your entire ledger in standard JSON format at any time from your Account Settings, or clear your session entirely.
                  </p>
                  <p>
                    <strong>4. Indian Data Sovereignty:</strong> System databases adhere to strict local protection guidelines
                    preventing unauthorized third-party tracking or data resale.
                  </p>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <p>
                    <strong>1. Scope of Service:</strong> FINVESSA provides personal finance aggregation, budget monitoring,
                    and trend visualization software for personal, non-commercial use.
                  </p>
                  <p>
                    <strong>2. Simulated Banking Integration:</strong> Ledger updates, atomic transfers between accounts, and bill
                    payments operate within your personal FINVESSA database sandbox and do not initiate wire transfers through external banking clearing houses.
                  </p>
                  <p>
                    <strong>3. User Responsibility:</strong> Users are responsible for maintaining strong account passwords.
                    FINVESSA employs bcrypt cryptographic hashing to protect your authentication credentials.
                  </p>
                  <p>
                    <strong>4. Copyright Notice:</strong> © 2026 FinVessa. All intellectual property, UI/UX designs, and software rights are reserved to Ankit Kumar.
                  </p>
                </>
              )}

              {activeModal === "security" && (
                <>
                  <p>
                    <strong>1. Cryptographic Protection:</strong> User passwords are encrypted using industry-standard bcrypt salt hashing with high computational cost factors.
                  </p>
                  <p>
                    <strong>2. Atomic Ledger Consistency:</strong> Double-entry bookkeeping transactions run in ACID-compliant atomic database batches, guaranteeing that debit and credit operations cannot become desynchronized.
                  </p>
                  <p>
                    <strong>3. Integer Minor Unit Precision:</strong> All currency mathematics are computed in exact integer minor currency units (paise / cents), avoiding floating-point rounding errors.
                  </p>
                  <p>
                    <strong>4. Session Isolation:</strong> Authentication sessions use secure HTTP-only cookies and signed JWT tokens with strict route-level protection.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
