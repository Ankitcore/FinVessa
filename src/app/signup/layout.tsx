import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account · Get Started with FINVESSA",
  description:
    "Open your free FINVESSA account to unlock atomic ledger tracking, multi-bank aggregation, virtual RuPay cards, and cash flow intelligence.",
  alternates: {
    canonical: "/signup",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
