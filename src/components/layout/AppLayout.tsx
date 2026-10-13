"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { Header } from "./Header";
import { QuickActionsModal } from "../modals/QuickActionsModal";

import { useSidebar } from "@/context/SidebarContext";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onRefreshData?: () => void;
}

export function AppLayout({
  children,
  title,
  subtitle,
  onRefreshData,
}: AppLayoutProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useSidebar();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Sticky Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQuickAction={() => setQuickActionOpen(true)}
        />

        {/* Page Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>

        {/* Global Application Footer */}
        <footer className="w-full border-t border-white/[0.05] py-4 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300 tracking-wider">FINVESSA</span>
              <span className="text-slate-400">•</span>
              <span className="text-cyan-400 font-medium">See your money. Shape your future</span>
            </div>
            <p className="text-slate-400 font-medium">© 2026 FinVessa. All rights reserved to Ankit Kumar.</p>
          </div>
        </footer>
      </div>

      {/* Global Quick Action Modal */}
      <QuickActionsModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        onSuccess={() => {
          if (onRefreshData) onRefreshData();
        }}
      />
    </div>
  );
}
