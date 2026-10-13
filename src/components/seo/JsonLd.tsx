import React from "react";

export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://finvessa.vercel.app";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FINVESSA",
    "legalName": "FINVESSA Financial Technologies",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.svg`,
    "slogan": "See your money. Shape your future",
    "founder": {
      "@type": "Person",
      "name": "Ankit Kumar",
    },
    "foundingDate": "2026",
    "sameAs": [
      "https://github.com/finvessa",
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "FinancialService"],
    "name": "FINVESSA",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All (Web, iOS, Android)",
    "url": baseUrl,
    "description": "Next-generation personal finance dashboard with real-time financial summaries, cash flow analytics, RuPay virtual cards, and budget tracking.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
    },
    "featureList": [
      "Unified Multi-Bank Account Aggregation",
      "Atomic Double-Entry Ledger",
      "Virtual RuPay and Visa Card Controls",
      "Real-Time Cash Flow Analytics",
      "Smart Monthly Category Budgets",
      "Automated Scheduled Bills Tracking",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FINVESSA",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/transactions?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
