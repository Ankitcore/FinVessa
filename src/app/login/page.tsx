"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      toast.success("Signed in successfully. Welcome back!");
      router.push("/dashboard");
    } else {
      setErrorMsg(result.error || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg("");
    setDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Welcome, Aarav Sharma! Demo session initialized.");
        await refreshUser();
        router.push("/dashboard");
      } else {
        setErrorMsg(data.error || "Demo login failed");
        setDemoLoading(false);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[130px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none -bottom-40 -right-40" />

      <div className="glass-card max-w-md w-full rounded-3xl p-7 sm:p-9 border border-white/10 relative z-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] mb-4 shadow-glow">
            <div className="w-full h-full bg-[#0d1424] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to <span className="text-gradient-purple-cyan">Nova Finance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your Bharat wealth dashboard & RuPay cards
          </p>
        </div>

        {/* 1-Click Instant Demo Access Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 hover:from-purple-600/50 hover:to-cyan-500/50 border border-purple-500/40 text-slate-100 font-semibold text-xs transition-all shadow-glow active:scale-[0.98]"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Zap className="w-4 h-4 text-cyan-400" />
            )}
            <span>1-Click Demo Login (Aarav Sharma)</span>
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              or sign in with email
            </span>
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="aarav@novafinance.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-white/[0.07] text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
