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
    default: "FINVESSA — See your money. Shape your future",
    template: "%s | FINVESSA",
  },
  description:
    "FINVESSA — See your money. Shape your future. Next-generation personal finance dashboard with real-time financial summaries, cash flow analytics, RuPay virtual cards, and budget tracking.",
  keywords: [
    "FINVESSA",
    "personal finance",
    "RuPay virtual cards",
    "expense tracker",
    "budgeting",
    "cash flow",
    "Bharat wealth management",
    "Zyrovia",
  ],
  authors: [{ name: "FINVESSA (Zyrovia)" }],
  icons: {
    icon: "/finvessa-icon.png",
    shortcut: "/finvessa-app-icon.png",
    apple: "/finvessa-icon.png",
  },
};

import { SidebarProvider } from "@/context/SidebarContext";

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
            <SidebarProvider>
              <ToastProvider>{children}</ToastProvider>
            </SidebarProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
