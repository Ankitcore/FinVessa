"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useSidebar } from "@/context/SidebarContext";

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
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#0b101c]/95 backdrop-blur-xl border-r border-white/[0.07] z-30 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20 px-2.5 py-5" : "w-64 px-4 py-6"
      }`}
      aria-label="Desktop Navigation Sidebar"
    >
      {/* Brand Logo & Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 transition-all group ${
            isCollapsed ? "justify-center w-full px-0" : "px-2"
          }`}
          aria-label="FINVESSA Dashboard"
          title="FINVESSA — See your money. Shape your future"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#090d16] border border-white/10 p-0.5 shadow-glow shrink-0 flex items-center justify-center">
            <Image
              src="/finvessa-icon.png"
              alt="FINVESSA Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform"
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                FIN<span className="text-gradient-purple-cyan font-black">VESSA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold ml-1">
                  IN
                </span>
              </span>
              <p className="text-[9px] text-slate-400 font-medium tracking-tight whitespace-nowrap">
                See your money. Shape your future
              </p>
            </div>
          )}
        </Link>

        {/* Toggle Button in Header when expanded */}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-thin">
        {!isCollapsed ? (
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Menu
          </div>
        ) : (
          <div className="w-full h-[1px] bg-white/[0.06] my-2" />
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isCollapsed
                  ? "justify-center py-3 px-0 w-full"
                  : "gap-3.5 px-3.5 py-2.5"
              } ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 group-hover:text-purple-400"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate whitespace-nowrap">{item.name}</span>
              )}
              {isActive && (
                <div
                  className={`absolute bg-cyan-400 rounded-full shadow-glow-cyan ${
                    isCollapsed
                      ? "right-1.5 w-1 h-3"
                      : "right-2 w-1.5 h-4"
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: Balance privacy, Expand Toggle & User Profile */}
      <div className="pt-3 border-t border-white/[0.07] space-y-2.5">
        {/* Expand button when collapsed */}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        {/* Balance Toggle button */}
        <button
          onClick={toggleBalanceVisibility}
          className={`flex items-center rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-xs text-slate-400 hover:text-slate-200 transition-colors ${
            isCollapsed
              ? "w-full justify-center p-2.5"
              : "w-full justify-between px-3.5 py-2"
          }`}
          title={
            isBalanceHidden
              ? "Balances Hidden — Click to Reveal"
              : "Balances Visible — Click to Conceal"
          }
        >
          <span className="flex items-center gap-2">
            {isBalanceHidden ? (
              <EyeOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            {!isCollapsed && (
              <span className="whitespace-nowrap">
                {isBalanceHidden ? "Balances Hidden" : "Balances Visible"}
              </span>
            )}
          </span>
          {!isCollapsed && (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              {isBalanceHidden ? "Show" : "Hide"}
            </span>
          )}
        </button>

        {/* User profile & Logout */}
        <div
          className={`flex items-center ${
            isCollapsed ? "flex-col gap-2 py-1" : "justify-between px-2 py-1"
          }`}
        >
          <Link
            href="/settings"
            className="flex items-center gap-2.5 min-w-0 group"
            title={user?.name || "Spershika Sharma"}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/20 shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Spershika Sharma"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : "S"
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                  {user?.name || "Spershika Sharma"}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  {user?.email || "spershika@finvessa.in"}
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
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
