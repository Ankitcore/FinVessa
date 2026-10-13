const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Indian banking and financial data...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.virtualCard.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Indian demo user
  const passwordHash = await bcrypt.hash("Demo123!*", 10);
  const user = await prisma.user.create({
    data: {
      name: "Spershika Sharma",
      email: "spershika@finvessa.in",
      passwordHash,
      currency: "INR",
      theme: "dark",
      balanceHidden: false,
    },
  });

  // Also create aliases so existing links continue to work seamlessly
  await prisma.user.create({
    data: {
      name: "Spershika Sharma",
      email: "demo@finvessa.in",
      passwordHash,
      currency: "INR",
      theme: "dark",
      balanceHidden: false,
    },
  });

  console.log(`Created Indian user: ${user.name} (${user.email})`);

  // Create standard Indian categories
  const categoriesData = [
    // Income
    { name: "Salary & Corporate", type: "INCOME", icon: "Briefcase", color: "#10B981" },
    { name: "Freelance & Consulting", type: "INCOME", icon: "Laptop", color: "#06B6D4" },
    { name: "Mutual Funds & Dividends", type: "INCOME", icon: "TrendingUp", color: "#8B5CF6" },
    { name: "Cashbacks & UPI Rewards", type: "INCOME", icon: "RotateCcw", color: "#3B82F6" },
    // Expense
    { name: "Rent & Society Maintenance", type: "EXPENSE", icon: "Home", color: "#F43F5E" },
    { name: "Groceries & Blinkit", type: "EXPENSE", icon: "ShoppingCart", color: "#F59E0B" },
    { name: "Dining & Swiggy/Zomato", type: "EXPENSE", icon: "Utensils", color: "#EC4899" },
    { name: "Electronics & Gadgets", type: "EXPENSE", icon: "Cpu", color: "#8B5CF6" },
    { name: "Electricity & Utilities", type: "EXPENSE", icon: "Zap", color: "#06B6D4" },
    { name: "Cabs & Transit (Uber/Ola)", type: "EXPENSE", icon: "Plane", color: "#3B82F6" },
    { name: "Fitness & Cult.fit", type: "EXPENSE", icon: "Heart", color: "#10B981" },
    { name: "Movies & Entertainment", type: "EXPENSE", icon: "Film", color: "#A855F7" },
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

  // Create Indian Bank Accounts
  const hdfcAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "HDFC Bank Salary Account",
      type: "CHECKING",
      balanceCents: 14585000, // ₹1,45,850.00
      currency: "INR",
      color: "#8B5CF6",
    },
  });

  const sbiSavingsAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "SBI Wealth Super Savings",
      type: "SAVINGS",
      balanceCents: 48000000, // ₹4,80,000.00
      currency: "INR",
      color: "#06B6D4",
    },
  });

  const iciciCreditCard = await prisma.account.create({
    data: {
      userId: user.id,
      name: "ICICI Sapphiro RuPay Card",
      type: "CREDIT_CARD",
      balanceCents: 1845000, // ₹18,450.00 current billing liability
      currency: "INR",
      color: "#A855F7",
    },
  });

  const zerodhaAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Zerodha Kite & Groww Portfolio",
      type: "INVESTMENT",
      balanceCents: 26500000, // ₹2,65,000.00
      currency: "INR",
      color: "#10B981",
    },
  });

  // Create Virtual Cards
  await prisma.virtualCard.create({
    data: {
      userId: user.id,
      accountId: iciciCreditCard.id,
      cardholderName: "SPERSHIKA SHARMA",
      cardNumberMasked: "•••• •••• •••• 8291",
      fullNumber: "6521 8920 1840 8291",
      cardExpiry: "08/29",
      cardCvv: "739",
      cardType: "RUPAY",
      cardStyle: "PURPLE_CYAN",
      isFrozen: false,
      spendingLimitCents: 15000000, // ₹1,50,000.00 limit
    },
  });

  await prisma.virtualCard.create({
    data: {
      userId: user.id,
      accountId: hdfcAccount.id,
      cardholderName: "SPERSHIKA SHARMA",
      cardNumberMasked: "•••• •••• •••• 4109",
      fullNumber: "4242 8100 8922 4109",
      cardExpiry: "12/28",
      cardCvv: "482",
      cardType: "VISA",
      cardStyle: "MIDNIGHT_DARK",
      isFrozen: false,
      spendingLimitCents: 5000000, // ₹50,000.00 limit
    },
  });

  // Create realistic Indian transactions
  const now = new Date();
  const d = (daysAgo, hours = 12) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, 30, 0, 0);
    return date;
  };

  const sampleTransactions = [
    {
      desc: "TCS Engineering Monthly Salary",
      type: "INCOME",
      amount: 18500000, // ₹1,85,000.00
      date: d(2),
      acc: hdfcAccount.id,
      cat: categories["Salary & Corporate"].id,
    },
    {
      desc: "UPI Client Payout - UI Design",
      type: "INCOME",
      amount: 4500000, // ₹45,000.00
      date: d(6),
      acc: hdfcAccount.id,
      cat: categories["Freelance & Consulting"].id,
    },
    {
      desc: "Croma Store - Apple Studio Display",
      type: "EXPENSE",
      amount: 2899000, // ₹28,990.00
      date: d(3),
      acc: iciciCreditCard.id,
      cat: categories["Electronics & Gadgets"].id,
    },
    {
      desc: "Blinkit 10-Min Organic Groceries",
      type: "EXPENSE",
      amount: 284000, // ₹2,840.00
      date: d(1),
      acc: hdfcAccount.id,
      cat: categories["Groceries & Blinkit"].id,
    },
    {
      desc: "Uber Premier Bangalore Airport Cab",
      type: "EXPENSE",
      amount: 148000, // ₹1,480.00
      date: d(4),
      acc: iciciCreditCard.id,
      cat: categories["Cabs & Transit (Uber/Ola)"].id,
    },
    {
      desc: "Swiggy Gourmet Family Dinner",
      type: "EXPENSE",
      amount: 165000, // ₹1,650.00
      date: d(5),
      acc: iciciCreditCard.id,
      cat: categories["Dining & Swiggy/Zomato"].id,
    },
    {
      desc: "Cult.fit Elite Annual Fitness Pass",
      type: "EXPENSE",
      amount: 1250000, // ₹12,500.00
      date: d(7),
      acc: hdfcAccount.id,
      cat: categories["Fitness & Cult.fit"].id,
    },
    {
      desc: "AWS Cloud Infrastructure Mumbai",
      type: "EXPENSE",
      amount: 684000, // ₹6,840.00
      date: d(8),
      acc: iciciCreditCard.id,
      cat: categories["Electronics & Gadgets"].id,
    },
    {
      desc: "Zerodha Nifty 50 Index Dividend",
      type: "INCOME",
      amount: 480000, // ₹4,800.00
      date: d(9),
      acc: zerodhaAccount.id,
      cat: categories["Mutual Funds & Dividends"].id,
    },
    {
      desc: "Prestige Whitefield Apartment Rent",
      type: "EXPENSE",
      amount: 3800000, // ₹38,000.00
      date: d(12),
      acc: hdfcAccount.id,
      cat: categories["Rent & Society Maintenance"].id,
    },
    {
      desc: "Transfer to SBI Savings Vault",
      type: "TRANSFER",
      amount: 3500000, // ₹35,000.00
      date: d(10),
      acc: hdfcAccount.id,
      transferAcc: sbiSavingsAccount.id,
    },
    {
      desc: "Zepto Superfast Essentials",
      type: "EXPENSE",
      amount: 89000, // ₹890.00
      date: d(11),
      acc: hdfcAccount.id,
      cat: categories["Groceries & Blinkit"].id,
    },
    {
      desc: "Airtel Xstream 5G Fiber Broadband",
      type: "EXPENSE",
      amount: 176800, // ₹1,768.00
      date: d(14),
      acc: iciciCreditCard.id,
      cat: categories["Electricity & Utilities"].id,
    },
    {
      desc: "Blue Tokai Coffee Roasters Bandra",
      type: "EXPENSE",
      amount: 42000, // ₹420.00
      date: d(0, 9),
      acc: hdfcAccount.id,
      cat: categories["Dining & Swiggy/Zomato"].id,
    },
    {
      desc: "BookMyShow IMAX 3D Movie Tickets",
      type: "EXPENSE",
      amount: 112000, // ₹1,120.00
      date: d(15),
      acc: iciciCreditCard.id,
      cat: categories["Movies & Entertainment"].id,
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

  // Create Indian Budgets
  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Groceries & Blinkit"].id,
      name: "Groceries & Blinkit",
      limitCents: 2000000, // ₹20,000.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Dining & Swiggy/Zomato"].id,
      name: "Swiggy, Zomato & Dining",
      limitCents: 1500000, // ₹15,000.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Electronics & Gadgets"].id,
      name: "Tech & Software Tools",
      limitCents: 3500000, // ₹35,000.00
      period: "MONTHLY",
    },
  });

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: categories["Movies & Entertainment"].id,
      name: "Entertainment & Weekend Fun",
      limitCents: 800000, // ₹8,000.00
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
      accountId: iciciCreditCard.id,
      name: "Tata Power / BESCOM Electricity",
      amountCents: 342000, // ₹3,420.00
      dueDate: futureDays(4),
      recurrence: "MONTHLY",
      category: "Electricity & Utilities",
      status: "UNPAID",
      autoPay: true,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: hdfcAccount.id,
      name: "Airtel Xstream 5G Fiber Broadband",
      amountCents: 176800, // ₹1,768.00
      dueDate: futureDays(7),
      recurrence: "MONTHLY",
      category: "Electricity & Utilities",
      status: "UNPAID",
      autoPay: false,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: hdfcAccount.id,
      name: "Prestige Lakeside Society Maintenance",
      amountCents: 450000, // ₹4,500.00
      dueDate: futureDays(12),
      recurrence: "MONTHLY",
      category: "Rent & Society Maintenance",
      status: "UNPAID",
      autoPay: true,
    },
  });

  await prisma.bill.create({
    data: {
      userId: user.id,
      accountId: iciciCreditCard.id,
      name: "Cult.fit Monthly Pass",
      amountCents: 199900, // ₹1,999.00
      dueDate: d(2),
      recurrence: "MONTHLY",
      category: "Fitness & Cult.fit",
      status: "PAID",
      autoPay: true,
    },
  });

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Salary Credited",
      message: "₹1,85,000.00 was deposited into HDFC Bank Salary Account from TCS.",
      type: "SUCCESS",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Upcoming Bill Reminder",
      message: "Tata Power Electricity (₹3,420.00) is due for payment in 4 days.",
      type: "BILL_DUE",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Budget Status",
      message: "You have utilized 38% of your Groceries & Blinkit monthly limit.",
      type: "INFO",
      isRead: true,
    },
  });

  console.log("Indian database seeded successfully for Spershika Sharma!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
