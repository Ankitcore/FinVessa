"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";

const PRESET_AVATARS = [
  {
    label: "Cyber Sapphire",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%230284c7'/><stop offset='100%25' stop-color='%2306b6d4'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g1)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' fill-opacity='0.9'/><path d='M22 84 C26 60 74 60 78 84 Z' fill='%23ffffff' fill-opacity='0.9'/></svg>",
  },
  {
    label: "Deep Ocean",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%230369a1'/><stop offset='100%25' stop-color='%230ea5e9'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g2)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' fill-opacity='0.9'/><path d='M22 84 C26 60 74 60 78 84 Z' fill='%23ffffff' fill-opacity='0.9'/></svg>",
  },
  {
    label: "Emerald Teal",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%2310b981'/><stop offset='100%25' stop-color='%2306b6d4'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g3)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' fill-opacity='0.9'/><path d='M22 84 C26 60 74 60 78 84 Z' fill='%23ffffff' fill-opacity='0.9'/></svg>",
  },
  {
    label: "Sunset Amber",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23f59e0b'/><stop offset='100%25' stop-color='%23ef4444'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g4)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' fill-opacity='0.9'/><path d='M22 84 C26 60 74 60 78 84 Z' fill='%23ffffff' fill-opacity='0.9'/></svg>",
  },
  {
    label: "Spershika Monogram",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%230284c7'/><stop offset='100%25' stop-color='%2338bdf8'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g5)'/><text x='50' y='58' font-family='system-ui,sans-serif' font-size='34' font-weight='900' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'>SS</text></svg>",
  },
];

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { currency, setCurrency, isBalanceHidden, toggleBalanceVisibility } = useCurrency();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || "Spershika Sharma");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "INR");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.avatar !== undefined) setAvatar(user.avatar || "");
  }, [user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file should be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setAvatar(dataUrl);
          toast.info("Image loaded! Click 'Save Profile Preferences' below to save changes.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          avatar: avatar || null,
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
        a.download = `finvessa-backup-${new Date().toISOString().split("T")[0]}.json`;
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
            <User className="w-5 h-5 text-cyan-400" /> Profile & Regional Settings
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Manage your display identity and default financial currency
          </p>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Avatar Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-600 to-cyan-400 p-[2px] shadow-glow">
                  <div className="w-full h-full rounded-[14px] bg-[#0b101c] flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name || "Spershika Sharma"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white">
                        {name ? name.charAt(0).toUpperCase() : "S"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  title="Upload photo from device"
                  aria-label="Upload photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload Controls & Presets */}
              <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm font-semibold text-white">Profile Photo</span>
                    {avatar && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        Photo Configured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload your picture (JPG, PNG or WebP) or choose a designed preset.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    Upload Photo
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar("")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Presets */}
                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">
                    Or select an avatar style:
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        title={preset.label}
                        className={`w-9 h-9 rounded-xl overflow-hidden border transition-all ${
                          avatar === preset.url
                            ? "border-cyan-400 ring-2 ring-cyan-400/40 scale-105"
                            : "border-white/10 hover:border-white/30 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "spershika@finvessa.in"}
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-400 outline-none cursor-not-allowed"
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
                className="w-full sm:w-64 bg-[#0f1626] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-white outline-none min-h-[44px]"
              >
                <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="CAD">CAD (CA$) - Canadian Dollar</option>
                <option value="AUD">AUD (AU$) - Australian Dollar</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                All ledger figures and dashboards will reformat to this symbol.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />}
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
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
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
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
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
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs text-white outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50 min-h-[44px]"
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
