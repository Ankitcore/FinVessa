"use client";

import React from "react";
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
  Eye,
  EyeOff,
  Sparkles,
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

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isBalanceHidden, toggleBalanceVisibility } = useCurrency();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0b101c]/90 backdrop-blur-xl border-r border-white/[0.07] px-4 py-6 z-30 select-none">
      {/* Brand Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2 mb-8 group transition-all"
        aria-label="Nova Finance Dashboard"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-glow">
          <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            Nova<span className="text-gradient-purple-cyan font-black">Finance</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold ml-1">IN</span>
          </span>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Bharat Wealth & RuPay
          </p>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 group-hover:text-purple-400"
                }`}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-4 bg-cyan-400 rounded-full shadow-glow-cyan" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: Balance privacy & User */}
      <div className="pt-4 border-t border-white/[0.07] space-y-3">
        {/* Balance Toggle button */}
        <button
          onClick={toggleBalanceVisibility}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle balance visibility across the entire app"
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
            {isBalanceHidden ? "Show" : "Hide"}
          </span>
        </button>

        {/* User profile & Logout */}
        <div className="flex items-center justify-between px-2 py-1">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 min-w-0 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                {user?.name || "Aarav Sharma"}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                {user?.email || "aarav@novafinance.in"}
              </p>
            </div>
          </Link>

          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
