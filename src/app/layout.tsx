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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://finvessa.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "FINVESSA - See your money. Shape your future",
    template: "%s | FINVESSA",
  },
  description:
    "FINVESSA - See your money. Shape your future. Next-generation personal finance dashboard with real-time financial summaries, cash flow analytics, RuPay virtual cards, and budget tracking.",
  keywords: [
    "FINVESSA",
    "personal finance",
    "RuPay virtual cards",
    "expense tracker",
    "budgeting",
    "cash flow",
    "Bharat wealth management",
    "FinVessa",
  ],
  authors: [{ name: "FinVessa" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://finvessa.vercel.app",
    siteName: "FINVESSA",
    title: "FINVESSA - See your money. Shape your future",
    description:
      "India's next-generation personal finance dashboard with real-time financial summaries, cash flow analytics, RuPay virtual cards, and budget tracking.",
    images: [
      {
        url: "/finvessa-logo-preview.png",
        width: 1200,
        height: 630,
        alt: "FINVESSA Personal Finance Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FINVESSA - See your money. Shape your future",
    description:
      "Unified personal finance dashboard across HDFC, SBI, ICICI accounts, RuPay cards, and investment portfolios.",
    images: ["/finvessa-logo-preview.png"],
    creator: "@finvessa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "finance",
};

import { SidebarProvider } from "@/context/SidebarContext";
import { CapitalCurrentBackground } from "@/components/layout/CapitalCurrentBackground";
import { JsonLd } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased bg-[#080c14] text-slate-100 min-h-screen relative overflow-x-clip">
        <CapitalCurrentBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <AuthProvider>
            <CurrencyProvider>
              <SidebarProvider>
                <ToastProvider>{children}</ToastProvider>
              </SidebarProvider>
            </CurrencyProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
