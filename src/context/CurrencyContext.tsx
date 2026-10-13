"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  formatAmount: (cents: number, overrideHide?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("INR");
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);

  useEffect(() => {
    // Read local storage preferences
    const savedCurrency = localStorage.getItem("finvessa_currency");
    if (savedCurrency) setCurrencyState(savedCurrency);

    const savedHide = localStorage.getItem("finvessa_hide_balance");
    if (savedHide !== null) setIsBalanceHidden(savedHide === "true");
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem("finvessa_currency", code);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => {
      const next = !prev;
      localStorage.setItem("finvessa_hide_balance", String(next));
      return next;
    });
  };

  const formatAmount = (cents: number, overrideHide: boolean = false): string => {
    const shouldHide = overrideHide ? false : isBalanceHidden;
    return formatCurrency(cents, currency, shouldHide);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        isBalanceHidden,
        toggleBalanceVisibility,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
