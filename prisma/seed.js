const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.virtualCard.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash("Demo123!*", 10);
  const user = await prisma.user.create({
    data: {
      name: "Alex Sterling",
      email: "demo@novafinance.com",
      passwordHash,
      currency: "USD",
      theme: "dark",
      balanceHidden: false,
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create standard categories
  const categoriesData = [
    // Income
    { name: "Salary & Wages", type: "INCOME", icon: "Briefcase", color: "#10B981" },
    { name: "Freelance & Consulting", type: "INCOME", icon: "Laptop", color: "#06B6D4" },
    { name: "Investments & Dividends", type: "INCOME", icon: "TrendingUp", color: "#8B5CF6" },
    { name: "Refunds & Cashbacks", type: "INCOME", icon: "RotateCcw", color: "#3B82F6" },
    // Expense
    { name: "Housing & Rent", type: "EXPENSE", icon: "Home", color: "#F43F5E" },
    { name: "Groceries & Food", type: "EXPENSE", icon: "ShoppingCart", color: "#F59E0B" },
    { name: "Dining & Restaurants", type: "EXPENSE", icon: "Utensils", color: "#EC4899" },
    { name: "Tech & Software", type: "EXPENSE", icon: "Cpu", color: "#8B5CF6" },
    { name: "Utilities & Bills", type: "EXPENSE", icon: "Zap", color: "#06B6D4" },
    { name: "Transit & Travel", type: "EXPENSE", icon: "Plane", color: "#3B82F6" },
    { name: "Health & Wellness", type: "EXPENSE", icon: "Heart", color: "#10B981" },
    { name: "Entertainment & Leisure", type: "EXPENSE", icon: "Film", color: "#A855F7" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        ...cat,
        userId: user.id,
      },
    });
    categories[cat.name] = created;
  }

  // Create accounts
  const checkingAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Chase Premier Checking",
      type: "CHECKING",
      balanceCents: 2485000, // $24,850.00
      currency: "USD",
      color: "#8B5CF6",
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "High Yield Vault (4.8% APY)",
      type: "SAVINGS",
      balanceCents: 5240000, // $52,400.00
      currency: "USD",
      color: "#06B6D4",
    },
  });

  const creditCardAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Nova Obsidian Metal Card",
      type: "CREDIT_CARD",
      balanceCents: 142050, // $1,420.50 current balance / liability
      currency: "USD",
      color: "#A855F7",
    },
  });

  const cryptoAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Global Index & Assets",
      type: "INVESTMENT",
      balanceCents: 1875000, // $18,750.00
      currency: "USD",
      color: "#10B981",
    },
  });

  // Create Virtual Cards
  await prisma.virtualCard.create({
    data: {
      userId: user.id,
      accountId: creditCardAccount.id,
      cardholderName: "ALEX STERLING",
      cardNumberMasked: "•••• •••• •••• 4289",
      fullNumber: "4532 8920 1840 4289",
      cardExpiry: "08/29",
      cardCvv: "739",
      cardType: "VISA",
      cardStyle: "PURPLE_CYAN",
      isFrozen: false,
      spendingLimitCents: 800000, // $8,000.00
    },
  });

  await prisma.virtualCard.create({
    data: {
      userId: user.id,
      accountId: checkingAccount.id,
      cardholderName: "ALEX STERLING",
      cardNumberMasked: "•••• •••• •••• 9104",
      fullNumber: "5425 2100 8922 9104",
      cardExpiry: "12/28",
      cardCvv: "482",
      cardType: "MASTERCARD",
      cardStyle: "MIDNIGHT_DARK",
      isFrozen: false,
      spendingLimitCents: 300000, // $3,000.00
    },
  });

  // Create realistic transactions
  const now = new Date();
  const d = (daysAgo, hours = 12) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, 30, 0, 0);
    return date;
  };

  const sampleTransactions = [
    {
      desc: "Acme Corp Tech Salary",
      type: "INCOME",
      amount: 850000, // $8,500.00
      date: d(2),
      acc: checkingAccount.id,
      cat: categories["Salary & Wages"].id,
    },
    {
      desc: "Stripe UI/UX Consulting Payout",
      type: "INCOME",
      amount: 240000, // $2,400.00
      date: d(6),
      acc: checkingAccount.id,
      cat: categories["Freelance & Consulting"].id,
    },
    {
      desc: "Apple Store - Studio Display",
      type: "EXPENSE",
      amount: 159900, // $1,599.00
      date: d(3),
      acc: creditCardAccount.id,
      cat: categories["Tech & Software"].id,
    },
    {
      desc: "Whole Foods Market Organic Groceries",
      type: "EXPENSE",
      amount: 18450, // $184.50
      date: d(1),
      acc: checkingAccount.id,
      cat: categories["Groceries & Food"].id,
    },
    {
      desc: "Uber Premier Airport Transfer",
      type: "EXPENSE",
      amount: 6840, // $68.40
      date: d(4),
      acc: creditCardAccount.id,
      cat: categories["Transit & Travel"].id,
    },
    {
      desc: "Nobu Downtown Business Dinner",
      type: "EXPENSE",
      amount: 24500, // $245.00
      date: d(5),
      acc: creditCardAccount.id,
      cat: categories["Dining & Restaurants"].id,
    },
    {
      desc: "Equinox Luxury Fitness Club",
      type: "EXPENSE",
      amount: 32000, // $320.00
      date: d(7),
      acc: checkingAccount.id,
      cat: categories["Health & Wellness"].id,
    },
    {
      desc: "Amazon Web Services Hosting",
      type: "EXPENSE",
      amount: 8420, // $84.20
      date: d(8),
      acc: creditCardAccount.id,
      cat: categories["Tech & Software"].id,
    },
    {
      desc: "Vanguard S&P 500 Dividend",
      type: "INCOME",
      amount: 42000, // $420.00
      date: d(9),
      acc: cryptoAccount.id,
      cat: categories["Investments & Dividends"].id,
    },
    {
      desc: "Downtown Luxury Loft Rent",
      type: "EXPENSE",
      amount: 320000, // $3,200.00
      date: d(12),
      acc: checkingAccount.id,
      cat: categories["Housing & Rent"].id,
    },
    {
      desc: "Transfer to Savings Vault",
      type: "TRANSFER",
      amount: 150000, // $1,500.00
      date: d(10),
      acc: checkingAccount.id,
      transferAcc: savingsAccount.id,
    },
    {
      desc: "Trader Joe's Provisions",
      type: "EXPENSE",
      amount: 9230, // $92.30
      date: d(11),
      acc: checkingAccount.id,
      cat: categories["Groceries & Food"].id,
    },
    {
      desc: "Figma Professional Annual Subscription",
      type: "EXPENSE",
      amount: 14400, // $144.00
      date: d(14),
      acc: creditCardAccount.id,
      cat: categories["Tech & Software"].id,
    },
    {
      desc: "Blue Bottle Artisan Coffee",
      type: "EXPENSE",
      amount: 1850, // $18.50
      date: d(0, 9),
      acc: checkingAccount.id,
      cat: categories["Dining & Restaurants"].id,
    },
    {
      desc: "Netflix 4K Ultra Family",
      type: "EXPENSE",
      amount: 2299, // $22.99
      date: d(15),
      acc: creditCardAccount.id,
      cat: categories["Entertainment & Leisure"].id,
    },
  ];

  for (const item of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: item.acc,
        categoryId: item.cat || null,
        type: item.type,
        amountCents: item.amount,
        date: item.date,
        description: item.desc,
        status: "COMPLETED",
        transferAccountId: item.transferAcc || null,
      },
    });
  }

  // Create Budgets
  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Groceries & Food"].id,
      name: "Groceries & Essentials",
      limitCents: 60000, // $600.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Dining & Restaurants"].id,
      name: "Dining & Social",
      limitCents: 45000, // $450.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Tech & Software"].id,
      name: "Software & Digital Tools",
      limitCents: 200000, // $2,000.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Entertainment & Leisure"].id,
      name: "Entertainment & Fun",
      limitCents: 15000, // $150.00
      period: "MONTHLY",
    },
  });

  // Create Bills & Upcoming payments
  const futureDays = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: creditCardAccount.id,
      name: "AWS Cloud Infrastructure",
      amountCents: 8940, // $89.40
      dueDate: futureDays(3),
      recurrence: "MONTHLY",
      category: "Tech & Software",
      status: "UNPAID",
      autoPay: true,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: checkingAccount.id,
      name: "Consolidated Edison Electric",
      amountCents: 13580, // $135.80
      dueDate: futureDays(6),
      recurrence: "MONTHLY",
      category: "Utilities & Bills",
      status: "UNPAID",
      autoPay: false,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: checkingAccount.id,
      name: "Downtown Loft HOA & Water",
      amountCents: 28000, // $280.00
      dueDate: futureDays(12),
      recurrence: "MONTHLY",
      category: "Housing & Rent",
      status: "UNPAID",
      autoPay: true,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: creditCardAccount.id,
      name: "Spotify Premium Family",
      amountCents: 1999, // $19.99
      dueDate: d(2),
      recurrence: "MONTHLY",
      category: "Entertainment & Leisure",
      status: "PAID",
      autoPay: true,
    },
  });

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Salary Deposited",
      message: "$8,500.00 was deposited into Chase Premier Checking from Acme Corp.",
      type: "SUCCESS",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Upcoming Bill Reminder",
      message: "AWS Cloud Infrastructure ($89.40) is scheduled for auto-pay in 3 days.",
      type: "BILL_DUE",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Budget Status",
      message: "You have utilized 45% of your Groceries & Essentials monthly budget.",
      type: "INFO",
      isRead: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
