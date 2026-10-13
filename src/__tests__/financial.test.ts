import { describe, it, expect } from "vitest";
import {
  calculateFinancialMetrics,
  calculateBudgetUtilization,
  TransactionItem,
  BillItem,
  BudgetItem,
} from "@/lib/financial";
import { formatCurrency } from "@/lib/utils";

describe("Financial Correctness & Authoritative Calculations", () => {
  it("calculates income and expenses correctly, strictly excluding internal transfers", () => {
    const transactions: TransactionItem[] = [
      {
        id: "1",
        type: "INCOME",
        amountCents: 500000, // $5,000
        date: new Date(),
        description: "Salary",
        accountId: "acc1",
        status: "COMPLETED",
      },
      {
        id: "2",
        type: "EXPENSE",
        amountCents: 150000, // $1,500
        date: new Date(),
        description: "Rent",
        accountId: "acc1",
        status: "COMPLETED",
      },
      {
        id: "3",
        type: "EXPENSE",
        amountCents: 50000, // $500
        date: new Date(),
        description: "Groceries",
        accountId: "acc1",
        status: "COMPLETED",
      },
      {
        id: "4",
        type: "TRANSFER",
        amountCents: 200000, // $2,000 transfer between accounts
        date: new Date(),
        description: "Transfer to Savings",
        accountId: "acc1",
        status: "COMPLETED",
      },
      {
        id: "5",
        type: "EXPENSE",
        amountCents: 10000, // Pending expense, should be excluded
        date: new Date(),
        description: "Pending Order",
        accountId: "acc1",
        status: "PENDING",
      },
    ];

    const result = calculateFinancialMetrics(transactions, 1000000);

    expect(result.incomeCents).toBe(500000); // Only qualifying completed income
    expect(result.expenseCents).toBe(200000); // 150000 + 50000, transfer excluded!
    expect(result.netCashFlowCents).toBe(300000); // 500000 - 200000
    // Savings rate = (300000 / 500000) * 100 = 60%
    expect(result.savingsRate).toBe(60);
  });

  it("handles zero income safely without NaN or division by zero", () => {
    const transactions: TransactionItem[] = [
      {
        id: "1",
        type: "EXPENSE",
        amountCents: 25000,
        date: new Date(),
        description: "Dinner",
        accountId: "acc1",
        status: "COMPLETED",
      },
    ];

    const result = calculateFinancialMetrics(transactions, 50000);
    expect(result.incomeCents).toBe(0);
    expect(result.expenseCents).toBe(25000);
    expect(result.netCashFlowCents).toBe(-25000);
    expect(result.savingsRate).toBe(0); // Safe fallback to 0
    expect(Number.isFinite(result.savingsRate)).toBe(true);
  });

  it("calculates budget utilization, remaining amount, and exceeded flags", () => {
    const budget: BudgetItem = {
      id: "b1",
      name: "Dining",
      limitCents: 40000, // $400.00
      categoryId: "cat-dining",
    };

    const qualifyingTransactions: TransactionItem[] = [
      {
        id: "1",
        type: "EXPENSE",
        amountCents: 15000, // $150
        date: new Date(),
        description: "Sushi",
        accountId: "acc1",
        categoryId: "cat-dining",
        status: "COMPLETED",
      },
      {
        id: "2",
        type: "EXPENSE",
        amountCents: 20000, // $200
        date: new Date(),
        description: "Steakhouse",
        accountId: "acc1",
        categoryId: "cat-dining",
        status: "COMPLETED",
      },
      {
        id: "3",
        type: "EXPENSE",
        amountCents: 10000, // $100 in other category (should not affect)
        date: new Date(),
        description: "Gas",
        accountId: "acc1",
        categoryId: "cat-transit",
        status: "COMPLETED",
      },
    ];

    const util = calculateBudgetUtilization(budget, qualifyingTransactions);
    expect(util.spentCents).toBe(35000);
    expect(util.remainingCents).toBe(5000);
    expect(util.percentageUsed).toBe(87.5);
    expect(util.isExceeded).toBe(false);

    // Now test exceeded budget
    const exceededTxs: TransactionItem[] = [
      ...qualifyingTransactions,
      {
        id: "4",
        type: "EXPENSE",
        amountCents: 10000, // Additional $100, pushes total to $450 (limit $400)
        date: new Date(),
        description: "Bar",
        accountId: "acc1",
        categoryId: "cat-dining",
        status: "COMPLETED",
      },
    ];

    const exceededUtil = calculateBudgetUtilization(budget, exceededTxs);
    expect(exceededUtil.spentCents).toBe(45000);
    expect(exceededUtil.remainingCents).toBe(-5000);
    expect(exceededUtil.isExceeded).toBe(true);
  });

  it("classifies upcoming and overdue bills correctly", () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const futureDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days ahead

    const bills: BillItem[] = [
      {
        id: "b1",
        name: "Cloud Server",
        amountCents: 8000,
        dueDate: futureDate,
        status: "UNPAID",
      },
      {
        id: "b2",
        name: "Electric Bill",
        amountCents: 12000,
        dueDate: pastDate,
        status: "UNPAID",
      },
      {
        id: "b3",
        name: "Water Utility",
        amountCents: 4000,
        dueDate: pastDate,
        status: "PAID", // Already paid
      },
    ];

    const result = calculateFinancialMetrics([], 100000, bills);
    expect(result.upcomingBillsCount).toBe(1);
    expect(result.upcomingBillsCents).toBe(8000);
    expect(result.overdueBillsCount).toBe(1);
    expect(result.overdueBillsCents).toBe(12000);
  });

  it("formats currency using minor units and supports privacy concealing", () => {
    expect(formatCurrency(125050)).toBe("₹1,250.50"); // default INR
    expect(formatCurrency(125050, "INR", false)).toBe("₹1,250.50");
    expect(formatCurrency(12500000, "INR", false)).toBe("₹1,25,000.00"); // Indian lakh formatting
    expect(formatCurrency(125050, "USD", false)).toBe("$1,250.50");
    expect(formatCurrency(125050, "EUR", false)).toBe("€1,250.50");
    expect(formatCurrency(125050, "GBP", false)).toBe("£1,250.50");
    expect(formatCurrency(125050, "INR", true)).toBe("••••••");
  });
});
