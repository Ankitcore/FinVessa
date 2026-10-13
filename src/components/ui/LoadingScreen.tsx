"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = "Your money, in perspective.",
  subtext = "Syncing balances, encrypted ledgers & RuPay limits...",
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center select-none ${
        fullScreen ? "fixed inset-0 z-50 bg-[#080c14]/95 backdrop-blur-xl" : "py-16 w-full"
      }`}
    >
      <div className="relative mb-6">
        {/* Ambient subtle glow ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-400 blur-xl opacity-40"
        />

        {/* Logo box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 bg-[#0b101c] shadow-2xl p-0.5 flex items-center justify-center"
        >
          <Image
            src="/favicon.svg"
            alt="FINVESSA"
            width={64}
            height={64}
            unoptimized
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Rotating gradient loader */}
      <div className="relative w-7 h-7 mb-4">
        <div className="w-full h-full rounded-full border-2 border-cyan-500/20 border-t-cyan-400 border-r-blue-500 animate-spin" />
      </div>

      {/* Primary loading message */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-base sm:text-lg font-bold text-white tracking-wide mb-1.5"
      >
        {message}
      </motion.h3>

      {/* Subtext */}
      {subtext && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="text-xs text-slate-400 max-w-xs leading-relaxed"
        >
          {subtext}
        </motion.p>
      )}

      {/* Brand water mark */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
        <span>FINVESSA</span>
        <span>•</span>
        <span className="text-cyan-400">BHARAT WEALTH</span>
      </div>
    </div>
  );
}
