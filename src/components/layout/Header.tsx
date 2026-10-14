"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Eye,
  EyeOff,
  CheckCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onOpenQuickAction: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function Header({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenQuickAction,
}: HeaderProps) {
  const { user } = useAuth();
  const { isBalanceHidden, toggleBalanceVisibility } = useCurrency();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // ignore
      }
    }
    loadNotifications();
  }, []);

  // Close notification popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll detection for floating rounded popup animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? "px-3 sm:px-6 lg:px-8 pt-3 pb-1 pointer-events-none"
          : "px-0 pt-0 pb-0"
      }`}
    >
      <div
        className={`w-full transition-all duration-300 ease-out relative ${
          isScrolled
            ? "pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-[#090e1a]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/80 ring-1 ring-cyan-500/20 px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden"
            : "bg-[#080c14]/80 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 rounded-none shadow-none"
        }`}
      >
        {/* Subtle top glow line when floating with rounded corners */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
        )}

        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Left side: Hamburger (mobile) + Page Titles */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={onOpenMobileMenu}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:hidden text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-center shrink-0"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

        {/* Right side controls: Search, Quick Add, Visibility, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search finance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/transactions?search=${encodeURIComponent(
                    searchQuery
                  )}`;
                }
              }}
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 outline-none transition-all focus:bg-white/[0.07]"
            />
          </div>

          {/* Quick Action Button - Hidden on mobile to free up space for page title */}
          <button
            onClick={onOpenQuickAction}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-glow transition-colors shrink-0 min-h-[40px]"
            title="Create new transaction or transfer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">New Action</span>
          </button>

          {/* How It Works Guide Pill */}
          <Link
            href="/how-it-works"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-cyan-300 text-xs font-medium transition-colors shrink-0 min-h-[40px]"
            title="Interactive Platform Walkthrough & Architecture Deck"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">How It Works</span>
          </Link>

          {/* Eye Icon for Balance Visibility */}
          <button
            onClick={toggleBalanceVisibility}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-white rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors shrink-0"
            title={isBalanceHidden ? "Show account balances" : "Hide account balances"}
            aria-label="Toggle balance privacy"
          >
            {isBalanceHidden ? (
              <EyeOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Eye className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-white rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors relative shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-[#0f1626] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
                  <span className="font-semibold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 transition-colors ${
                          n.isRead ? "bg-transparent" : "bg-cyan-950/20"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === "BILL_DUE" ? (
                            <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : n.type === "WARNING" ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-white/[0.07] bg-white/[0.02] text-center">
                  <Link
                    href="/bills"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                  >
                    Manage upcoming bills & alerts <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] transition-opacity hover:opacity-90 shrink-0"
            title="User Profile & Settings"
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
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
          </Link>
        </div>
      </div>
    </div>
  </header>
);
}
