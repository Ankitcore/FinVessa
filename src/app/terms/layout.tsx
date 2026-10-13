import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · Financial Platform Governance",
  description:
    "Terms and conditions governing the usage of FINVESSA wealth management dashboard, virtual RuPay cards, and transaction tracking.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "FINVESSA Terms of Service · Platform Governance",
    description:
      "Operational standards and governance for FINVESSA personal finance aggregation and management.",
    url: "https://finvessa.vercel.app/terms",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
