import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In · Access Your Wealth Dashboard",
  description:
    "Securely access your unified FINVESSA personal finance dashboard across HDFC, SBI, ICICI accounts, RuPay cards, and investments.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
