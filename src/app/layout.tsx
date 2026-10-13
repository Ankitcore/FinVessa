import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ToastProvider } from "@/components/ui/Toast";

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Nova Finance — Intelligent Wealth & Cash Flow Management",
    template: "%s | Nova Finance",
  },
  description:
    "Next-generation personal finance dashboard with real-time financial summaries, cash flow analytics, virtual cards, budget tracking, and automated bill scheduling.",
  keywords: [
    "personal finance",
    "fintech dashboard",
    "expense tracker",
    "budgeting",
    "cash flow",
    "wealth management",
  ],
  authors: [{ name: "Nova Finance" }],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#080c14] text-slate-100 min-h-screen">
        <AuthProvider>
          <CurrencyProvider>
            <ToastProvider>{children}</ToastProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
