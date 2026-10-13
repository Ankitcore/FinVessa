# Nova Finance — Premium Wealth & Cash Flow Management Platform

Nova Finance is a complete, production-ready full-stack personal finance application designed with an obsidian-dark glassmorphism fintech aesthetic, purple/violet and cyan glowing gradients, interactive financial analytics, virtual bank cards, atomic multi-account transfers, category budget utilization trackers, and bill scheduling.

---

## 💎 Key Features & Working Pages

### 1. Executive Dashboard (`/dashboard`)
- **Authoritative Metrics**: Total balance across accounts, qualifying monthly income, monthly expenses, net cash flow, and savings percentage.
- **Interactive Cash Flow Analytics**: Recharts dual-gradient bar chart and smoothed area trend chart with month-by-month toggle.
- **Holographic Virtual Card**: Obsidian metallic mesh card with EMV chip simulation, contactless waves, masked number toggle, and CVV reveal.
- **Upcoming Payments**: Scheduled bill reminders with immediate "Pay Now" actions that log corresponding expense transactions.
- **Spending by Category**: Real-time progress breakdown across dining, groceries, tech, housing, and utilities.
- **Global Privacy Eye**: Top bar and card toggle that conceals/reveals balances (`••••••`) across the entire application instantly.
- **Quick Action Trigger**: One-click modal to log Income, Expense, or Transfers from anywhere.

### 2. Transaction Ledger (`/transactions`)
- **Full CRUD Capabilities**: Add, edit, or delete transactions with confirmation modals.
- **Atomic Balance Reversals**: Updating or deleting past transactions atomically recalibrates account balances.
- **Granular Filtering & Search**: Instant description search, category filters, account filters, and type filters (`INCOME`, `EXPENSE`, `TRANSFER`).
- **Sorting & Pagination**: Sort by date or amount in ascending/descending order with server-backed pagination.

### 3. Account Portfolios (`/accounts`)
- **Multi-Account Types**: Checking, High-Yield Savings, Credit Cards (Liabilities), Investment Portfolios, and Cash Wallets.
- **Atomic Money Transfers**: Multi-step transfers between accounts run inside ACID database transactions with debits and credits synchronized.
- **Account-Specific Ledgers**: Inspect any specific account to view its historical activity and balance contribution.

### 4. Deep Financial Analytics (`/analytics`)
- **Multi-Month Trend Analysis**: 6-month and 12-month selectable horizons.
- **Category Donut Distribution**: Recharts pie chart with percentage shares and interactive tooltips.
- **Savings Rate Dynamics**: Tracks month-over-month savings velocity.

### 5. Category Budgets (`/budgets`)
- **Real-Time Utilization Meters**: Calculates actual spending directly from qualifying current-month transactions.
- **Overrun Alerts**: Visual indicators when approaching (80%) or exceeding (100%+) assigned limits.

### 6. Bills & Recurring Obligations (`/bills`)
- **Schedule Management**: Monthly, weekly, yearly, and one-off bill scheduling.
- **Overdue Detection**: Automatically flags unpaid bills with past due dates.
- **One-Click Settlement**: Settles bills and optionally records an expense transaction against the funding account.

### 7. Virtual Obsidian Cards (`/cards`)
- **Card Security Controls**: 1-click Freeze/Unfreeze card status.
- **Spending Limits**: Configure and update monthly authorization caps.
- **Card Issuance**: Issue new virtual cards with Visa Infinite or Mastercard styling.

### 8. User Settings (`/settings`)
- **Currency Preferences**: Select USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), CAD, or AUD to dynamically format the entire application.
- **Data Export**: Export your complete financial ledger, budgets, accounts, and bills as a JSON backup.
- **Cryptographic Password Change**: Bcrypt-backed credential update.

### 9. Custom 404 Page (`/_not-found`)
- Branded glassmorphism error view with quick return navigation.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, custom glassmorphism utilities & CSS variables
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Database & ORM**: SQLite (zero-config local default) / PostgreSQL ready via Prisma ORM
- **Authentication**: Secure HTTP-only JWT cookies, bcryptjs password hashing
- **Form Validation**: Zod
- **Unit Testing**: Vitest
- **Integration Testing**: Custom live HTTP verification runner (`scripts/test-api.js`)

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
# SQLite (default for instant zero-config setup):
DATABASE_URL="file:./dev.db"

# PostgreSQL (for production deployments):
# DATABASE_URL="postgresql://postgres:password@localhost:5432/novafinance?schema=public"

JWT_SECRET="nova-finance-secure-jwt-secret-key-32-chars-long-2026"
NEXT_PUBLIC_APP_NAME="Nova Finance"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed
```bash
# Push schema to SQLite
npx prisma db push

# Seed rich demonstration accounts, transactions, budgets, and bills
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials

For instant testing, use the 1-Click Demo Login button on the `/login` page or log in with:
- **Email**: `demo@novafinance.com`
- **Password**: `Demo123!*`

Alternatively, create a new user on `/signup` which automatically provisions standard starting accounts and default expense categories.

---

## 🧪 Testing & Verification

### Run Unit Tests
```bash
npm run test
```
Runs 8 Vitest unit tests verifying:
- Internal transfer exclusions from income/expense sums.
- Zero-income safe handling for savings rates.
- Budget utilization math and threshold limits.
- Upcoming vs. overdue bill classification.
- Minor-unit currency rounding & privacy masking.
- Bcrypt password hashing & JWT token verification.

### Run Live HTTP Integration Tests
With the server running on port 3000:
```bash
node scripts/test-api.js
```
Verifies live API responses, cookies, and HTTP 200/404 statuses for all pages.

### Production Build
```bash
npm run build
npm run start
```
Compiles and starts the optimized production server.
