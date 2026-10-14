const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "screenshots");

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();

  // 1. Capture Login Screen first
  console.log("Navigating to login page...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
  await new Promise((res) => setTimeout(res, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "login.png"), fullPage: false });
  console.log("Saved screenshot: login.png");

  // 2. Log in via UI demo button
  console.log("Authenticating via 1-Click Demo Login...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const demoBtn = buttons.find((b) => b.textContent && b.textContent.includes("Demo Login"));
    if (demoBtn) demoBtn.click();
  });
  await new Promise((res) => setTimeout(res, 2500));
  console.log("Authenticated into FinVessa as Spershika Sharma!");

  const routes = [
    { name: "dashboard.png", url: "http://localhost:3000/dashboard", waitMs: 1800 },
    { name: "analytics.png", url: "http://localhost:3000/analytics", waitMs: 1800 },
    { name: "cards.png", url: "http://localhost:3000/cards", waitMs: 1800 },
    { name: "transactions.png", url: "http://localhost:3000/transactions", waitMs: 1800 },
    { name: "accounts.png", url: "http://localhost:3000/accounts", waitMs: 1800 },
    { name: "budgets.png", url: "http://localhost:3000/budgets", waitMs: 1800 },
    { name: "bills.png", url: "http://localhost:3000/bills", waitMs: 1800 },
    { name: "how-it-works.png", url: "http://localhost:3000/how-it-works", waitMs: 1800 },
    { name: "settings.png", url: "http://localhost:3000/settings", waitMs: 1800 },
    { name: "landing.png", url: "http://localhost:3000", waitMs: 1800 },
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.url}...`);
    await page.goto(r.url, { waitUntil: "networkidle0", timeout: 15000 }).catch(() => {});
    await new Promise((res) => setTimeout(res, r.waitMs));
    const outPath = path.join(OUTPUT_DIR, r.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${r.name}`);
  }

  await browser.close();
  console.log("All screenshots captured successfully in public/screenshots!");
}

capture().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
