export interface FinancialSummary {
  totalBalanceCents: number;
  incomeCents: number;
  expenseCents: number;
  netCashFlowCents: number;
  savingsRate: number; // 0 to 100 percentage
  upcomingBillsCount: number;
  upcomingBillsCents: number;
  overdueBillsCount: number;
  overdueBillsCents: number;
}

export interface TransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER" | string;
  amountCents: number;
  date: Date | string;
  description: string;
  accountId: string;
  categoryId?: string | null;
  status: string;
}

export interface BillItem {
  id: string;
  name: string;
  amountCents: number;
  dueDate: Date | string;
  status: "PAID" | "UNPAID" | "OVERDUE" | string;
}

export interface BudgetItem {
  id: string;
  name: string;
  limitCents: number;
  categoryId?: string | null;
}

/**
 * Authoritative financial calculations:
 * - Excludes internal transfers from Income and Expense totals.
 * - Safely handles zero income for savings rate calculation.
 * - Uses integer cents to eliminate floating point issues.
 */
export function calculateFinancialMetrics(
  transactions: TransactionItem[],
  accountsTotalBalanceCents: number,
  bills: BillItem[] = [],
  startDate?: Date,
  endDate?: Date
): FinancialSummary {
  const now = new Date();

  // Filter transactions within the selected period if dates are provided
  const periodTransactions = transactions.filter((tx) => {
    if (tx.status !== "COMPLETED") return false;
    const txDate = new Date(tx.date);
    if (startDate && txDate < startDate) return false;
    if (endDate && txDate > endDate) return false;
    return true;
  });

  let incomeCents = 0;
  let expenseCents = 0;

  for (const tx of periodTransactions) {
    // Explicitly exclude internal transfers from income/expense
    if (tx.type === "INCOME") {
      incomeCents += Math.round(tx.amountCents);
    } else if (tx.type === "EXPENSE") {
      expenseCents += Math.round(tx.amountCents);
    }
  }

  const netCashFlowCents = incomeCents - expenseCents;

  // Savings rate = (Net Cash Flow / Income) * 100.
  // If income is 0 or negative, safe fallback to 0.
  let savingsRate = 0;
  if (incomeCents > 0) {
    const rawRate = (netCashFlowCents / incomeCents) * 100;
    savingsRate = Math.max(0, Math.min(100, Math.round(rawRate * 10) / 10));
  }

  // Calculate bill metrics
  let upcomingBillsCount = 0;
  let upcomingBillsCents = 0;
  let overdueBillsCount = 0;
  let overdueBillsCents = 0;

  for (const bill of bills) {
    if (bill.status === "PAID") continue;

    const due = new Date(bill.dueDate);
    if (due < now) {
      overdueBillsCount++;
      overdueBillsCents += bill.amountCents;
    } else {
      upcomingBillsCount++;
      upcomingBillsCents += bill.amountCents;
    }
  }

  return {
    totalBalanceCents: accountsTotalBalanceCents,
    incomeCents,
    expenseCents,
    netCashFlowCents,
    savingsRate,
    upcomingBillsCount,
    upcomingBillsCents,
    overdueBillsCount,
    overdueBillsCents,
  };
}

/**
 * Calculate budget spent and remaining for a category.
 */
export function calculateBudgetUtilization(
  budget: BudgetItem,
  transactions: TransactionItem[]
): {
  spentCents: number;
  remainingCents: number;
  percentageUsed: number;
  isExceeded: boolean;
} {
  let spentCents = 0;

  for (const tx of transactions) {
    if (tx.type === "EXPENSE" && tx.status === "COMPLETED") {
      if (!budget.categoryId || tx.categoryId === budget.categoryId) {
        spentCents += Math.round(tx.amountCents);
      }
    }
  }

  const remainingCents = budget.limitCents - spentCents;
  const percentageUsed =
    budget.limitCents > 0
      ? Math.round((spentCents / budget.limitCents) * 1000) / 10
      : 0;
  const isExceeded = spentCents > budget.limitCents;

  return {
    spentCents,
    remainingCents,
    percentageUsed,
    isExceeded,
  };
}
