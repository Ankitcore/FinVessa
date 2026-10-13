"use client";

import React, { useEffect } from "react";
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden flex"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-72 max-w-[85vw] h-full bg-[#0b101c] border-r border-white/10 flex flex-col p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.07]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-base text-white">
              Nova<span className="text-gradient-purple-cyan font-black">Finance</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-purple-600/20 text-white border border-purple-500/30 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-cyan-400" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Balance toggle & user info */}
        <div className="pt-4 border-t border-white/[0.07] space-y-3">
          <button
            onClick={toggleBalanceVisibility}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] text-xs text-slate-300"
          >
            <span className="flex items-center gap-2">
              {isBalanceHidden ? (
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{isBalanceHidden ? "Balances Hidden" : "Balances Visible"}</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              Toggle
            </span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {user?.name || "Aarav Sharma"}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  {user?.email || "aarav@novafinance.in"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
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
