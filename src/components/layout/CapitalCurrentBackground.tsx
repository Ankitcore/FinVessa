"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";

export type CapitalCurrentVariant =
  | "dashboard"
  | "transactions"
  | "accounts-cards"
  | "analytics"
  | "budgets-bills"
  | "auth"
  | "settings"
  | "landing";

interface CapitalCurrentBackgroundProps {
  variant?: CapitalCurrentVariant;
}

export function CapitalCurrentBackground({ variant: propVariant }: CapitalCurrentBackgroundProps) {
  const pathname = usePathname();

  // Automatically determine the route-specific variant if not explicitly passed
  const activeVariant: CapitalCurrentVariant = useMemo(() => {
    if (propVariant) return propVariant;
    if (!pathname || pathname === "/") return "landing";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/transactions")) return "transactions";
    if (pathname.startsWith("/accounts") || pathname.startsWith("/cards")) return "accounts-cards";
    if (pathname.startsWith("/analytics")) return "analytics";
    if (pathname.startsWith("/budgets") || pathname.startsWith("/bills")) return "budgets-bills";
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return "auth";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [pathname, propVariant]);

  return (
    <div
      aria-hidden="true"
      data-variant={activeVariant}
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#080c14]"
    >
      {/* =========================================================================
          ELEMENT 1: AMBIENT LIGHTING
          Two or three subtle radial gradients anchored at the outer edges.
          Opacity changes gently over 40–80 seconds with zero moving blobs.
         ========================================================================= */}
      
      {/* Edge Ambient 1: Top-Right Sapphire/Cyan (54s cycle) */}
      <div
        className="absolute -top-20 -right-20 w-[320px] sm:w-[680px] h-[320px] sm:h-[680px] rounded-full pointer-events-none animate-cc-ambient-1"
        style={{
          background:
            "radial-gradient(circle at 75% 25%, rgba(14, 165, 233, 0.08) 0%, rgba(2, 132, 199, 0.04) 40%, rgba(8, 12, 20, 0) 70%)",
        }}
      />

      {/* Edge Ambient 2: Bottom-Left Cyan/Teal (68s cycle) */}
      <div
        className="absolute -bottom-20 -left-20 w-[300px] sm:w-[640px] h-[300px] sm:h-[640px] rounded-full pointer-events-none animate-cc-ambient-2"
        style={{
          background:
            "radial-gradient(circle at 25% 75%, rgba(6, 182, 212, 0.07) 0%, rgba(16, 185, 129, 0.03) 40%, rgba(8, 12, 20, 0) 70%)",
        }}
      />

      {/* Edge Ambient 3: Top-Left Subtle Deep Navy (76s cycle, omitted on auth for extreme calm) */}
      {activeVariant !== "auth" && activeVariant !== "settings" && (
        <div
          className="absolute -top-32 left-1/4 w-[520px] sm:w-[720px] h-[340px] rounded-full pointer-events-none animate-cc-ambient-3"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(59, 130, 246, 0.04) 0%, rgba(2, 132, 199, 0.02) 45%, rgba(8, 12, 20, 0) 70%)",
          }}
        />
      )}

      {/* =========================================================================
          ELEMENT 2 & 3: FLOWING FINANCIAL CONTOURS & FINANCIAL SIGNAL POINTS
          Custom, thin SVG curves inspired by banknote engraving & ledger flows.
          Stroke offsets animate smoothly; at most 2-3 signal points on desktop.
         ========================================================================= */}
      {activeVariant !== "auth" && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear Gradients for Banknote Contours */}
            <linearGradient id="cc-grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#0369a1" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="cc-grad-cyan" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
            </linearGradient>

            <linearGradient id="cc-grad-guilloche" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.16" />
              <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="cc-grad-ledger" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.03" />
              <stop offset="25%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="75%" stopColor="#22d3ee" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.03" />
            </linearGradient>

            {/* Filter for subtle signal point glow */}
            <filter id="cc-signal-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* -------------------------------------------------------------------
              VARIANT 1: DASHBOARD & LANDING (Complete Capital Current effect)
             ------------------------------------------------------------------- */}
          {(activeVariant === "dashboard" || activeVariant === "landing") && (
            <>
              {/* Primary Contour Stream (Horizon Curve) */}
              <path
                id="cc-flow-path-1"
                d="M -40 180 C 380 90, 880 260, 1480 130"
                stroke="url(#cc-grad-violet)"
                strokeWidth="1.25"
                strokeDasharray="14 10"
                className="animate-cc-flow-1"
              />

              {/* Counter-Flow Ingot Curve (Lower Horizon) */}
              <path
                id="cc-flow-path-2"
                d="M -40 730 C 460 820, 960 670, 1480 770"
                stroke="url(#cc-grad-cyan)"
                strokeWidth="1"
                strokeDasharray="12 8"
                className="animate-cc-flow-2"
              />

              {/* Central Harmonic Guilloche Trace */}
              <path
                d="M 120 -20 C 580 440, 860 480, 1360 940"
                stroke="url(#cc-grad-guilloche)"
                strokeWidth="1"
                strokeDasharray="6 12"
                className="animate-cc-pulse"
              />

              {/* Financial Signal Point 1 (Glides slowly along Flow Path 1, desktop only) */}
              <g className="hidden md:block">
                <circle r="3" fill="#22d3ee" filter="url(#cc-signal-filter)" className="animate-cc-signal">
                  <animateMotion
                    path="M -40 180 C 380 90, 880 260, 1480 130"
                    dur="36s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>

              {/* Financial Signal Point 2 (Glides slowly along Flow Path 2, desktop only) */}
              <g className="hidden md:block">
                <circle r="3" fill="#38bdf8" filter="url(#cc-signal-filter)" className="animate-cc-signal">
                  <animateMotion
                    path="M 1480 770 C 960 670, 460 820, -40 730"
                    dur="46s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>

              {/* Mobile Only: Single static faint node at safe peripheral location */}
              <g className="block md:hidden">
                <circle cx="180" cy="150" r="2" fill="#22d3ee" opacity="0.35" />
              </g>
            </>
          )}

          {/* -------------------------------------------------------------------
              VARIANT 2: TRANSACTIONS (Ledger-inspired lines)
              Clean, horizontal precision watermark cadence with micro-cadence marks.
             ------------------------------------------------------------------- */}
          {activeVariant === "transactions" && (
            <>
              {/* Ledger Register Guides */}
              <line x1="0" y1="130" x2="1440" y2="130" stroke="url(#cc-grad-ledger)" strokeWidth="1" strokeDasharray="4 8" opacity="0.75" />
              <line x1="0" y1="340" x2="1440" y2="340" stroke="url(#cc-grad-ledger)" strokeWidth="1" strokeDasharray="2 12" opacity="0.5" />
              <line x1="0" y1="580" x2="1440" y2="580" stroke="url(#cc-grad-ledger)" strokeWidth="1" strokeDasharray="6 10" opacity="0.65" />
              <line x1="0" y1="800" x2="1440" y2="800" stroke="url(#cc-grad-ledger)" strokeWidth="1" strokeDasharray="3 9" opacity="0.7" />

              {/* Banknote Watermark Micro-Cadence Ticks */}
              {[220, 440, 660, 880, 1100, 1320].map((x) => (
                <line key={x} x1={x} y1="125" x2={x} y2="135" stroke="#38bdf8" strokeWidth="1" opacity="0.25" />
              ))}

              {/* Single Subtle Ledger Sentinel Point (Desktop only) */}
              <g className="hidden md:block">
                <circle cx="440" cy="130" r="2.5" fill="#38bdf8" filter="url(#cc-signal-filter)" className="animate-cc-signal" />
              </g>
            </>
          )}

          {/* -------------------------------------------------------------------
              VARIANT 3: ACCOUNTS & CARDS (Vault & Security Chip traces)
              Restrained concentric security chip arcs and vault geometry.
             ------------------------------------------------------------------- */}
          {activeVariant === "accounts-cards" && (
            <>
              {/* Top-Right Vault Geometry */}
              <path
                d="M 1040 0 A 540 540 0 0 1 1480 440"
                stroke="url(#cc-grad-violet)"
                strokeWidth="1.2"
                strokeDasharray="8 8"
                className="animate-cc-pulse"
              />
              <path
                d="M 1140 0 A 420 420 0 0 1 1480 340"
                stroke="url(#cc-grad-cyan)"
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Bottom-Left Vault Arc */}
              <path
                d="M -40 600 A 460 460 0 0 1 420 940"
                stroke="url(#cc-grad-cyan)"
                strokeWidth="1.2"
                strokeDasharray="6 10"
                className="animate-cc-flow-2"
              />

              {/* Single Signal Node on Vault Node (Desktop only) */}
              <g className="hidden md:block">
                <circle cx="1140" cy="140" r="3" fill="#22d3ee" filter="url(#cc-signal-filter)" className="animate-cc-signal" />
              </g>
            </>
          )}

          {/* -------------------------------------------------------------------
              VARIANT 4: ANALYTICS (Analytical Baseline Contours)
              Strictly located along perimeter margins, away from charts.
             ------------------------------------------------------------------- */}
          {activeVariant === "analytics" && (
            <>
              {/* Upper Horizon Wave (Near top nav margin) */}
              <path
                d="M -20 85 Q 360 45, 720 85 T 1460 65"
                stroke="url(#cc-grad-cyan)"
                strokeWidth="1"
                strokeDasharray="8 12"
                opacity="0.45"
              />

              {/* Lower Baseline Wave (Near footer margin) */}
              <path
                d="M -20 830 Q 380 865, 740 820 T 1460 845"
                stroke="url(#cc-grad-violet)"
                strokeWidth="1"
                strokeDasharray="10 14"
                opacity="0.45"
              />

              {/* Desktop Single Stationary Node at Safe Perimeter */}
              <g className="hidden md:block">
                <circle cx="720" cy="85" r="2.5" fill="#38bdf8" filter="url(#cc-signal-filter)" opacity="0.5" />
              </g>
            </>
          )}

          {/* -------------------------------------------------------------------
              VARIANT 5: BUDGETS & BILLS (Fiscal Boundary Arcs)
              Subtle static arcs representing allocation envelopes.
             ------------------------------------------------------------------- */}
          {activeVariant === "budgets-bills" && (
            <>
              {/* Fiscal Envelope Boundary Arcs */}
              <path
                d="M -30 260 C 260 170, 480 210, 720 240"
                stroke="url(#cc-grad-violet)"
                strokeWidth="1"
                strokeDasharray="6 8"
                opacity="0.4"
              />
              <path
                d="M 720 740 C 980 770, 1220 700, 1470 660"
                stroke="url(#cc-grad-cyan)"
                strokeWidth="1"
                strokeDasharray="6 8"
                opacity="0.4"
              />
            </>
          )}

          {/* -------------------------------------------------------------------
              VARIANT 6: SETTINGS & UTILITY (Minimalist Serene)
              Nearly static, faint watermark hairline.
             ------------------------------------------------------------------- */}
          {activeVariant === "settings" && (
            <>
              <line x1="80" y1="840" x2="1360" y2="840" stroke="url(#cc-grad-ledger)" strokeWidth="1" opacity="0.3" strokeDasharray="4 16" />
            </>
          )}
        </svg>
      )}

      {/* Global Vignette Radial Fade to keep screen center dark and tranquil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(8, 12, 20, 0.4) 0%, rgba(8, 12, 20, 0.85) 75%, #080c14 100%)",
        }}
      />
    </div>
  );
}
