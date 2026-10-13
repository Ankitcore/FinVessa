import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works & User Guide · System Architecture",
  description:
    "Interactive slide deck explaining FINVESSA's Bharat banking aggregation, double-entry atomic ledger, obsidian card vault, and capital current analytics engine.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How FINVESSA Works · Interactive Presentation & Guide",
    description:
      "Explore FINVESSA's system architecture: multi-bank aggregation, ACID-compliant ledger, RuPay card shields, and automated cash flow analytics.",
    url: "https://finvessa.vercel.app/how-it-works",
    type: "website",
    images: [
      {
        url: "/finvessa-logo-preview.png",
        width: 1200,
        height: 630,
        alt: "FINVESSA Architecture and How It Works Presentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How FINVESSA Works · System Architecture & Guide",
    description:
      "Interactive architectural blueprint and operational guide for FINVESSA personal wealth management.",
    images: ["/finvessa-logo-preview.png"],
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
