"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { Header } from "./Header";
import { QuickActionsModal } from "../modals/QuickActionsModal";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
