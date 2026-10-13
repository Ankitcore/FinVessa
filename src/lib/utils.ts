import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format cents integer into standard currency display string.
 * Example: 125050 cents with USD -> "$1,250.50"
 */
export function formatCurrency(
  cents: number,
  currencyCode: string = "INR",
  hideBalance: boolean = false
): string {
  if (hideBalance) {
    return "••••••";
  }

  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "CA$",
    AUD: "AU$",
  };

  const symbol = symbols[currencyCode] || "₹";
  const amount = cents / 100;
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";

  // Format with commas and 2 decimals (supports Indian numbering system: lakhs and crores)
  const formatted = Math.abs(amount).toLocaleString(locale, {
    minimumFractionDigits: currencyCode === "JPY" ? 0 : 2,
    maximumFractionDigits: currencyCode === "JPY" ? 0 : 2,
  });

  const sign = amount < 0 ? "-" : "";
  return `${sign}${symbol}${formatted}`;
}

export function formatDate(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str: string, length: number): string {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "…" : str;
}
