"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await signup(name, email, password);
    if (result.success) {
      toast.success("Account created successfully! Welcome to FINVESSA.");
      router.push("/dashboard");
    } else {
      setErrorMsg(result.error || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="glass-card max-w-md w-full rounded-3xl p-7 sm:p-9 border border-white/10 relative z-10 shadow-2xl">
        {/* Cancel / Close Button */}
        <Link
          href="/"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
          aria-label="Close and return to home"
          title="Cancel and return to home"
        >
          <X className="w-4 h-4" />
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-[#0d1424] border border-white/10 p-1 mb-4 shadow-glow">
            <Image
              src="/favicon.svg"
              alt="FINVESSA Logo"
              width={56}
              height={56}
              unoptimized
              className="w-full h-full object-cover rounded-[12px]"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            FINVESSA - See your money. Shape your future
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Spershika Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl pl-10 pr-3.5 py-2.5 text-base sm:text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="spershika@finvessa.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl pl-10 pr-3.5 py-2.5 text-base sm:text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl pl-10 pr-10 py-2.5 text-base sm:text-xs text-white placeholder-slate-400 outline-none transition-all"
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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.07] text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400 relative z-10">
        © 2026 FinVessa. All rights reserved to Ankit Kumar.
      </p>
    </div>
  );
}
