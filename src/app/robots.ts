import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://finvessa.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/how-it-works",
          "/login",
          "/signup",
          "/privacy",
          "/terms",
          "/favicon.svg",
          "/favicon.ico",
          "/icon.svg",
        ],
        disallow: [
          "/api/",
          "/settings/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
