"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Layers,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  PieChart,
  CalendarCheck,
  Check,
  Sliders,
  TrendingUp,
  RefreshCw,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

type PresentationTrack = "how-it-works" | "how-to-use";

interface SlideData {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  summary: string;
  bulletPoints: string[];
  callout: string;
  demoType: "banking" | "ledger" | "cards" | "analytics" | "setup" | "budgets" | "transactions" | "bills";
}

const HOW_IT_WORKS_SLIDES: SlideData[] = [
  {
    id: "hw-1",
    stepNumber: "01",
    badge: "System Architecture",
    title: "Bharat Banking & Unified Multi-Account Aggregation",
    summary:
      "FINVESSA unifies disparate liquidity sources into a synchronized financial cockpit. Whether tracking HDFC salary accounts, SBI savings vaults, cash wallets, or RuPay credit liabilities, all balances sync seamlessly in one view.",
    bulletPoints: [
      "Zero banking credential storage for institutional security",
      "Real-time liquidity calculations without manual reconciliation",
      "Dynamic multi-currency support with custom accent profiling",
    ],
    callout: "Architecture Highlight: Read-only balance synchronization with AES-256 data encryption at rest.",
    demoType: "banking",
  },
  {
    id: "hw-2",
    stepNumber: "02",
    badge: "Core Ledger Engine",
    title: "Atomic Double-Entry Financial Ledger",
    summary:
      "All monetary movements run through atomic database transactions. When moving capital from savings to checking, the debit and credit execute in an isolated database transaction: if any part fails, the entire transfer rolls back with zero balance drift.",
    bulletPoints: [
      "ACID compliant transactions preventing race conditions",
      "Internal transfers excluded from income/expense metrics",
      "Strict integer minor-unit accounting eliminating floating-point errors",
    ],
    callout: "Integrity Guarantee: Neither side of a transfer can settle without the counterpart successfully committing.",
    demoType: "ledger",
  },
  {
    id: "hw-3",
    stepNumber: "03",
    badge: "Card Security Vault",
    title: "Obsidian Virtual Cards with Live Controls",
    summary:
      "Issue instantaneous virtual RuPay, Visa, and Mastercard cards tied to specific accounts or standalone limits. Protect your primary bank card numbers from recurring subscription leaks and merchant compromises.",
    bulletPoints: [
      "1-Click instant card freezing and unfreezing",
      "Dynamic monthly spending caps enforced in real time",
      "On-demand CVV and full-digit toggling with privacy masking",
    ],
    callout: "Privacy Vault: Cards are simulated with institutional EMV styling and full privacy control.",
    demoType: "cards",
  },
  {
    id: "hw-4",
    stepNumber: "04",
    badge: "Intelligence Layer",
    title: "Capital Current Visual Analytics Engine",
    summary:
      "Noise-free analytical contours that reflect your true liquid health. The analytics pipeline processes period income, period outflow, and net savings rates over 6 and 12-month horizons without confusing transfers with spending.",
    bulletPoints: [
      "Authoritative savings rate calculation based on genuine surplus",
      "Categorical distribution breakdown with live utilization tracking",
      "Responsive Recharts comparison across custom date intervals",
    ],
    callout: "Analytical Precision: What you see reflects genuine surplus after recurring obligations.",
    demoType: "analytics",
  },
];

const HOW_TO_USE_SLIDES: SlideData[] = [
  {
    id: "hu-1",
    stepNumber: "01",
    badge: "Step 1: Setup",
    title: "Establish Your Accounts & Virtual Cards",
    summary:
      "Navigate to the Accounts section to record your primary checking, high-yield savings, or UPI cash wallets. Then head to Cards to issue your first obsidian virtual card with a custom monthly cap.",
    bulletPoints: [
      "Click 'New Account' and input your initial balance",
      "Assign custom account types (Salary, Savings, Credit, Investment)",
      "Issue a virtual card linked to your preferred funding account",
    ],
    callout: "Quick Action: Start by creating at least two accounts to enable instant atomic transfers.",
    demoType: "setup",
  },
  {
    id: "hu-2",
    stepNumber: "02",
    badge: "Step 2: Budgeting",
    title: "Configure Dynamic Category Spending Caps",
    summary:
      "Head to the Budgets dashboard to set monthly limits for your key spending categories such as Dining, Utilities, Shopping, or Travel. The system monitors cumulative expenses and signals warnings automatically.",
    bulletPoints: [
      "Set specific monthly rupee limits per category",
      "Live progress bars fill smoothly as expenses are recorded",
      "Warning signals trigger at 80% with rose alerts when caps are exceeded",
    ],
    callout: "Pro Tip: Set realistic limits early in the month so the 80% warning gives you actionable leeway.",
    demoType: "budgets",
  },
  {
    id: "hu-3",
    stepNumber: "03",
    badge: "Step 3: Execution",
    title: "Record Inflows, Outflows & Atomic Transfers",
    summary:
      "Log transactions using the quick action toolbar on the Dashboard or in the Transactions ledger. Choose whether the entry is an Income, Expense, or Transfer between internal accounts.",
    bulletPoints: [
      "Click 'Transfer' to move capital between accounts with zero latency",
      "Categorize transactions for instant chart and budget distribution updates",
      "Search, filter, and sort transaction histories by merchant, date, or amount",
    ],
    callout: "Efficiency: Buttons execute instantly with zero delay, keeping your ledger always up to date.",
    demoType: "transactions",
  },
  {
    id: "hu-4",
    stepNumber: "04",
    badge: "Step 4: Monitoring",
    title: "Settle Scheduled Bills & Export Financial Audits",
    summary:
      "Track upcoming recurring subscriptions, utility bills, and loan repayments in Bills & Payments. Mark bills paid with 1 click to auto-debit the corresponding account, then review overall trends in Analytics.",
    bulletPoints: [
      "Monitor the Monthly Obligations Settlement progress bar",
      "Receive overdue warnings before due dates lapse",
      "Export your complete financial ledger to CSV for tax planning",
    ],
    callout: "Automation: Mark Paid instantly creates a debited ledger entry and updates your net balance.",
    demoType: "bills",
  },
];

interface HowItWorksPresentationProps {
  initialTrack?: PresentationTrack;
  compact?: boolean;
}

export function HowItWorksPresentation({
  initialTrack = "how-it-works",
  compact = false,
}: HowItWorksPresentationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTrack, setActiveTrack] = useState<PresentationTrack>(initialTrack);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Demo interactive states
  const [demoTransferDone, setDemoTransferDone] = useState<boolean>(false);
  const [demoBudgetVal, setDemoBudgetVal] = useState<number>(68);
  const [demoCardFrozen, setDemoCardFrozen] = useState<boolean>(false);
  const [demoBillPaid, setDemoBillPaid] = useState<boolean>(false);

  const slides = activeTrack === "how-it-works" ? HOW_IT_WORKS_SLIDES : HOW_TO_USE_SLIDES;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  const switchTrack = (track: PresentationTrack) => {
    setActiveTrack(track);
    setCurrentSlideIndex(0);
  };

  return (
    <div className="w-full relative" id="presentation-deck">
      {/* Top Deck Header: Track Switcher & Presentation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        {/* Track Pills: How It Works vs How to Use */}
        <div className="flex items-center bg-[#090e1a] p-1 rounded-xl border border-white/[0.08] shadow-inner">
          <button
            onClick={() => switchTrack("how-it-works")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTrack === "how-it-works"
                ? "bg-cyan-500 text-slate-950 shadow-glow-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>How It Works (Architecture)</span>
          </button>
          <button
            onClick={() => switchTrack("how-to-use")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTrack === "how-to-use"
                ? "bg-cyan-500 text-slate-950 shadow-glow-cyan"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Use It (Guide)</span>
          </button>
        </div>

        {/* Slide Counter, Auto-Play, and Navigation Arrows */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-mono font-semibold text-slate-400">
            Slide <strong className="text-white">{currentSlideIndex + 1}</strong> of {slides.length}
          </span>

          <div className="flex items-center bg-[#090e1a] border border-white/[0.08] rounded-xl p-1 gap-1">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              title={isPlaying ? "Pause auto-presentation" : "Auto-advance presentation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Previous slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Next slide (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Progress Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className="text-left group focus:outline-none"
          >
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-1.5 transition-colors group-hover:bg-white/[0.15]">
              <div
                className={`h-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-full"
                    : idx < currentSlideIndex
                    ? "bg-cyan-500/50 w-full"
                    : "w-0"
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span
                className={`font-mono font-bold transition-colors ${
                  idx === currentSlideIndex ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                {s.stepNumber}
              </span>
              <span
                className={`truncate max-w-[110px] hidden sm:inline text-[10px] transition-colors ${
                  idx === currentSlideIndex ? "text-slate-200 font-semibold" : "text-slate-500"
                }`}
              >
                {s.badge}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Presentation Stage */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/[0.1] relative overflow-hidden shadow-2xl">
        {/* Subtle corner illumination */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column (7 cols): Slide Narrative & Explanations */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>{currentSlide.badge}</span>
                <span className="text-slate-400">• Slide {currentSlide.stepNumber}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentSlide.summary}
              </p>

              {/* Bullet Key Points */}
              <div className="space-y-2.5 pt-2">
                {currentSlide.bulletPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Callout Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{currentSlide.callout}</span>
              </div>

              {/* Slide Navigation Links */}
              <div className="pt-2 flex items-center gap-4">
                {activeTrack === "how-it-works" ? (
                  <button
                    onClick={() => switchTrack("how-to-use")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Step-by-Step Operator Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-glow-cyan transition-colors"
                  >
                    <span>Try This on Live Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Interactive Live Mock Demonstrator */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#090d18] border border-white/[0.1] p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Live Demo Preview
                  </span>
                </div>

                {/* Render specific interactive demo based on current slide */}
                {currentSlide.demoType === "banking" && (
                  <div className="space-y-3 py-2">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">HDFC Salary Current</p>
                          <p className="text-[10px] text-slate-400">Primary Salary Credit</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-white">₹1,84,500.00</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">SBI Wealth Vault</p>
                          <p className="text-[10px] text-slate-400">High Yield Savings</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-white">₹5,40,000.00</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Bharat Banking Synchronized
                      </span>
                      <span className="font-mono font-bold">200 OK</span>
                    </div>
                  </div>
                )}

                {currentSlide.demoType === "ledger" && (
                  <div className="space-y-4 py-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Source: Salary Account</span>
                        <span className="text-rose-400 font-bold">-₹15,000.00</span>
                      </div>
                      <div className="flex items-center justify-center py-1">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-pulse">
                          <ArrowLeftRight className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Destination: Savings Vault</span>
                        <span className="text-emerald-400 font-bold">+₹15,000.00</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDemoTransferDone((prev) => !prev)}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-colors"
                    >
                      {demoTransferDone ? "Reset Demo" : "Simulate Atomic Execution"}
                    </button>

                    {demoTransferDone && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] text-center font-medium"
                      >
                        ACID Transaction Committed: Zero Race Conditions
                      </motion.div>
                    )}
                  </div>
                )}

                {currentSlide.demoType === "cards" && (
                  <div className="space-y-4 py-2">
                    <div
                      className={`p-4 rounded-xl border transition-all text-white relative overflow-hidden ${
                        demoCardFrozen
                          ? "bg-slate-900 border-cyan-500/40 opacity-70"
                          : "bg-gradient-to-br from-[#0a1428] via-[#091b35] to-[#041d2e] border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-extrabold tracking-wider text-[11px]">FINVESSA ELITE</span>
                        <span className="font-black italic text-sm text-cyan-300">RuPay</span>
                      </div>
                      <div className="font-mono text-xs sm:text-sm tracking-wider mb-2">
                        •••• •••• •••• 8291
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>SPERSHIKA SHARMA</span>
                        <span>09/30</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDemoCardFrozen((prev) => !prev)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors border ${
                        demoCardFrozen
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan"
                          : "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {demoCardFrozen ? "Card Frozen (Click to Unfreeze)" : "Freeze Card Instantly"}
                    </button>
                  </div>
                )}

                {currentSlide.demoType === "analytics" && (
                  <div className="space-y-3 py-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span>Monthly Liquid Surplus</span>
                      <span className="text-emerald-400 font-bold">+₹78,420.00</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Savings Rate Target</span>
                        <span className="font-bold text-cyan-400">42%</span>
                      </div>
                      <ProgressBar
                        value={42}
                        max={100}
                        size="md"
                        delay={0.2}
                        colorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Period Inflow:</span>
                        <strong className="text-white">₹1,84,500.00</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Period Outflow:</span>
                        <strong className="text-white">₹1,06,080.00</strong>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.demoType === "setup" && (
                  <div className="space-y-3 py-2 text-xs">
                    <p className="text-[11px] text-slate-400">Select simulated account archetype:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Checking", "High Yield Savings", "RuPay Card", "Cash / UPI"].map((type) => (
                        <div
                          key={type}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 text-center font-semibold text-slate-200 transition-colors cursor-pointer"
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] text-center font-medium">
                      Multi-account balances calculated in integer cents
                    </div>
                  </div>
                )}

                {currentSlide.demoType === "budgets" && (
                  <div className="space-y-3 py-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Dining & Restaurants Limit</span>
                      <span className="font-bold text-white">
                        ₹{(demoBudgetVal * 150).toLocaleString()} / ₹15,000
                      </span>
                    </div>

                    <ProgressBar
                      value={demoBudgetVal}
                      max={100}
                      size="lg"
                      delay={0.1}
                      colorClassName={
                        demoBudgetVal >= 100
                          ? "bg-rose-500"
                          : demoBudgetVal >= 80
                          ? "bg-amber-400"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500"
                      }
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Interactive preview slider:</span>
                      <span className="font-bold text-slate-200">{demoBudgetVal}% Utilized</span>
                    </div>

                    <input
                      type="range"
                      min={20}
                      max={120}
                      value={demoBudgetVal}
                      onChange={(e) => setDemoBudgetVal(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                )}

                {currentSlide.demoType === "transactions" && (
                  <div className="space-y-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                        <ArrowDownLeft className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">Amazon Cloud Server</p>
                        <p className="text-[10px] text-slate-400">Utilities • Checking</p>
                      </div>
                      <span className="font-bold text-rose-400">-₹4,250.00</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">Client Retainer Fee</p>
                        <p className="text-[10px] text-slate-400">Income • Checking</p>
                      </div>
                      <span className="font-bold text-emerald-400">+₹85,000.00</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] text-slate-400 text-center">
                      Instant indexing across search, filters & pagination
                    </div>
                  </div>
                )}

                {currentSlide.demoType === "bills" && (
                  <div className="space-y-3 py-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Fiber Optic Internet</p>
                        <p className="text-[10px] text-slate-400">Due in 4 days • ₹1,499.00</p>
                      </div>
                      <button
                        onClick={() => setDemoBillPaid((p) => !p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          demoBillPaid
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-cyan-500 text-slate-950 shadow-glow-cyan"
                        }`}
                      >
                        {demoBillPaid ? "Settled" : "Mark Paid"}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Obligations Settlement</span>
                        <span className="text-white font-bold">{demoBillPaid ? "100%" : "75%"}</span>
                      </div>
                      <ProgressBar
                        value={demoBillPaid ? 100 : 75}
                        max={100}
                        size="sm"
                        delay={0.1}
                        colorClassName="bg-gradient-to-r from-cyan-500 to-emerald-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
