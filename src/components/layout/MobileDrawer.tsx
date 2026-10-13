"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  PieChart,
  CalendarCheck,
  CreditCard,
  Settings,
  LogOut,
  X,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Bills & Payments", href: "/bills", icon: CalendarCheck },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isBalanceHidden, toggleBalanceVisibility } = useCurrency();
  const touchStartX = useRef<number | null>(null);

  // Prevent background scrolling and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  // Touch handlers for swipe-to-close (swipe left)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    // If swiped left by more than 50px, dismiss
    if (diff > 50) {
      onClose();
    }
    touchStartX.current = null;
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-80 max-w-[85vw] h-full bg-[#0b101c] border-r border-white/10 flex flex-col p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200 select-none overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.07]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
            aria-label="Nova Finance Dashboard"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-glow">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base text-white flex items-center gap-1">
                Nova<span className="text-gradient-purple-cyan font-black">Finance</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold ml-1">
                  IN
                </span>
              </span>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                Bharat Wealth & RuPay
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links - Minimum 48px touch targets */}
        <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-colors min-h-[48px] active:scale-[0.98] ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/25 to-cyan-500/15 text-white border border-purple-500/30 font-semibold shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-cyan-400" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-4 bg-cyan-400 rounded-full shadow-glow-cyan" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Balance toggle & user info */}
        <div className="pt-4 border-t border-white/[0.07] space-y-3">
          <button
            onClick={toggleBalanceVisibility}
            className="w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] active:bg-white/[0.08] border border-white/[0.06] text-xs text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              {isBalanceHidden ? (
                <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span className="font-medium">
                {isBalanceHidden ? "Balances Hidden" : "Balances Visible"}
              </span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
              Toggle
            </span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 flex-1 py-1"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-1 ring-white/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || "Aarav Sharma"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || "aarav@novafinance.in"}
                </p>
              </div>
            </Link>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center shrink-0"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
