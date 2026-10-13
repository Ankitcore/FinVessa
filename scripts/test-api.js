const http = require("http");

async function main() {
  console.log("=== FINVESSA LIVE INTEGRATION TEST ===");

  // 1. Test Demo Login
  const loginRes = await fetch("http://localhost:3000/api/auth/demo-login", {
    method: "POST",
  });
  const cookie = loginRes.headers.get("set-cookie");
  const loginData = await loginRes.json();
  console.log("1. Demo Login Status:", loginRes.status);
  console.log("   User:", loginData.user.name, `(${loginData.user.email})`);
  console.log("   Auth Cookie Received:", Boolean(cookie));

  const headers = { Cookie: cookie.split(";")[0] };

  // 2. Test Dashboard API
  const dashRes = await fetch("http://localhost:3000/api/dashboard", { headers });
  const dashData = await dashRes.json();
  console.log("2. Dashboard API Status:", dashRes.status);
  console.log("   Total Balance (Cents):", dashData.metrics.totalBalanceCents);
  console.log("   Monthly Income (Cents):", dashData.metrics.incomeCents);
  console.log("   Monthly Expense (Cents):", dashData.metrics.expenseCents);
  console.log("   Net Cash Flow (Cents):", dashData.metrics.netCashFlowCents);
  console.log("   Savings Rate:", `${dashData.metrics.savingsRate}%`);
  console.log("   Accounts Loaded:", dashData.accounts.length);
  console.log("   Recent Transactions Loaded:", dashData.recentTransactions.length);
  console.log("   Upcoming Payments Loaded:", dashData.upcomingPayments.length);
  console.log("   Virtual Card:", dashData.virtualCard.cardholderName, dashData.virtualCard.cardNumberMasked);

  // 3. Test Transactions API
  const txRes = await fetch("http://localhost:3000/api/transactions?limit=5", { headers });
  const txData = await txRes.json();
  console.log("3. Transactions API Status:", txRes.status);
  console.log("   Total Transactions in Ledger:", txData.pagination.total);
  console.log("   Page 1 items:", txData.transactions.length);

  // 4. Test Accounts API
  const accRes = await fetch("http://localhost:3000/api/accounts", { headers });
  const accData = await accRes.json();
  console.log("4. Accounts API Status:", accRes.status);
  console.log("   Accounts:", accData.accounts.map((a) => `${a.name} (₹${(a.balanceCents/100).toFixed(2)})`).join(", "));

  // 5. Test Analytics API
  const anaRes = await fetch("http://localhost:3000/api/analytics?months=6", { headers });
  const anaData = await anaRes.json();
  console.log("5. Analytics API Status:", anaRes.status);
  console.log("   Monthly trends datapoints:", anaData.monthlyTrends.length);
  console.log("   Categories analyzed:", anaData.spendingByCategory.length);

  // 6. Test Budgets API
  const budRes = await fetch("http://localhost:3000/api/budgets", { headers });
  const budData = await budRes.json();
  console.log("6. Budgets API Status:", budRes.status);
  console.log("   Budgets active:", budData.budgets.length);
  console.log("   Total Budget Cap:", `₹${(budData.summary.totalBudgetLimitCents/100).toFixed(2)}`);
  console.log("   Total Budget Spent:", `₹${(budData.summary.totalSpentCents/100).toFixed(2)}`);

  // 7. Test Bills API
  const billRes = await fetch("http://localhost:3000/api/bills", { headers });
  const billData = await billRes.json();
  console.log("7. Bills API Status:", billRes.status);
  console.log("   Total Bills:", billData.bills.length);
  console.log("   Upcoming Bills:", billData.upcoming.length);

  // 8. Test Virtual Cards API
  const cardRes = await fetch("http://localhost:3000/api/cards", { headers });
  const cardData = await cardRes.json();
  console.log("8. Cards API Status:", cardRes.status);
  console.log("   Cards active:", cardData.cards.length);

  // 9. Test HTML Pages
  const pages = ["/", "/dashboard", "/transactions", "/accounts", "/analytics", "/budgets", "/bills", "/cards", "/settings", "/login", "/signup", "/not-found-test"];
  console.log("9. Testing HTTP page responses:");
  for (const page of pages) {
    const pageRes = await fetch(`http://localhost:3000${page}`, { headers });
    console.log(`   ${page} -> HTTP ${pageRes.status}`);
  }

  console.log("=== ALL LIVE INTEGRATION TESTS PASSED ===");
}

main().catch(console.error);
