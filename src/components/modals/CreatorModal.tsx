"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorModal({ isOpen, onClose }: CreatorModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-3xl bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-modal-title"
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

            {/* Ambient Radial Accent */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Cross Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
              aria-label="Close popup modal"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Creator Badge & Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-300 to-blue-500 p-[2px] shadow-glow flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a1120] rounded-[14px] overflow-hidden relative">
                    <Image
                      src="/ankit-kumar.jpg"
                      alt="Ankit Kumar - Creator of FINVESSA"
                      width={96}
                      height={96}
                      priority
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-[#090e1a]">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Creator • Full-Stack Engineer</span>
              </div>

              {/* Title as requested */}
              <h2
                id="creator-modal-title"
                className="text-base sm:text-lg font-bold text-slate-200 leading-snug"
              >
                This website is made by
                <span className="block text-2xl sm:text-3xl font-extrabold text-gradient-cyan mt-0.5 tracking-tight">
                  Ankit Kumar
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-sm leading-relaxed">
                Welcome to FINVESSA. Designed and engineered as a high-performance personal finance platform featuring real-time Indian banking, RuPay cards, and an atomic double-entry ledger.
              </p>
            </div>

            {/* Social Links Section */}
            <div className="space-y-2.5 my-6">
              {/* GitHub Link */}
              <a
                href="https://github.com/Ankitcore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.08] hover:border-cyan-500/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white group-hover:text-cyan-300 transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>GitHub</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-medium">
                        @Ankitcore
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Explore repositories &amp; open source code
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0" />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/ankitcore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.08] hover:border-blue-500/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                      <span>LinkedIn</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium">
                        Connect
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Professional profile &amp; engineering updates
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-300 transition-colors shrink-0" />
              </a>
            </div>

            {/* Continue to Site Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-glow transition-colors flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
            >
              <span>Explore FINVESSA Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
