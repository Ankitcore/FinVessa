"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Download,
  LogOut,
  Lock,
  Globe,
  Bell,
  Eye,
  CheckCircle2,
  Loader2,
  Moon,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { currency, setCurrency, isBalanceHidden, toggleBalanceVisibility } = useCurrency();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "Aarav Sharma");
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "INR");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          currency: selectedCurrency,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrency(selectedCurrency);
        toast.success("Profile preferences updated successfully.");
        await refreshUser();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Network error while updating settings");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Password change failed");
      }
    } catch {
      toast.error("Network error while changing password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/settings/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nova-finance-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success("Data export downloaded successfully.");
      } else {
        toast.error("Failed to export data");
      }
    } catch {
      toast.error("Network error during data export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppLayout
      title="Settings & Preferences"
      subtitle="Configure profile attributes, currency formatting, balance privacy, and security"
    >
      <div className="max-w-4xl space-y-8">
        {/* Profile & Currency Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08]">
          <h2 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" /> Profile & Regional Settings
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Manage your display identity and default financial currency
          </p>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "aarav@novafinance.in"}
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full sm:w-64 bg-[#0f1626] border border-white/[0.08] rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none"
              >
                <option value="INR">INR (₹) — Indian Rupee (Default)</option>
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
                <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                <option value="AUD">AUD (AU$) — Australian Dollar</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                All ledger figures and dashboards will reformat to this symbol.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
              >
                {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Profile Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Privacy & Balance Concealment */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08]">
          <h2 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" /> Privacy & Concealment Controls
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Configure how your account balances are displayed in public spaces
          </p>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Global Balance Privacy Mask
              </p>
              <p className="text-[11px] text-slate-400">
                Instantly replaces all account and transaction figures with &ldquo;••••••&rdquo;
              </p>
            </div>

            <button
              onClick={toggleBalanceVisibility}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isBalanceHidden
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {isBalanceHidden ? "Mask Active" : "Balances Visible"}
            </button>
          </div>
        </div>

        {/* Security & Password Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08]">
          <h2 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> Security & Password
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Update your account password with cryptographic bcrypt hashing
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
            >
              {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Update Password
            </button>
          </form>
        </div>

        {/* Data Export & Sign Out */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Account Data Portability
            </h3>
            <p className="text-xs text-slate-400">
              Download your complete financial records, transactions, and budgets as JSON
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-semibold transition-all"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export JSON
            </button>

            <button
              onClick={() => logout()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
