import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FINVESSA - Personal Finance & Wealth Management",
    short_name: "FINVESSA",
    description: "See your money. Shape your future. Next-generation personal finance dashboard with real-time analytics, RuPay virtual cards, and budget tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#080c14",
    theme_color: "#080c14",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
