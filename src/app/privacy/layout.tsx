import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · Institutional Data Protection",
  description:
    "FINVESSA's data protection standards, AES-256 encryption architecture, RBI data localization compliance, and privacy safeguards.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "FINVESSA Privacy Policy · Data Security Standards",
    description:
      "Institutional 256-bit SSL encryption, zero credential retention, and RBI compliance standards protecting your financial data.",
    url: "https://finvessa.vercel.app/privacy",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
