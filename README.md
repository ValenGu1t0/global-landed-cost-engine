# 🌐 Global Landed Cost Engine

An enterprise-grade **Global Trade Management (GTM) & Multi-Modal Landed Cost Platform** built with **Next.js 15, TypeScript, Drizzle ORM, and Neon Serverless PostgreSQL**.

Designed to replace fragile, error-prone corporate Excel spreadsheets with an automated, deterministic calculation pipeline that computes true cross-border product margins, 3D container packing yields, customs tariffs, and multi-leg freight allocation on the fly.

---

## 🚀 Key Highlights & Architectural Features

### 1. Deterministic Landed Cost Calculation Engine
- **Cross-Border Cost Waterfall**: Dynamically calculates and allocates multi-leg logistics across product units:
  $$\text{Duty Cost} = (\text{FOB} \times \text{Duty \%}) + \text{Fixed Duty per Piece}$$
  $$\text{Section 301 Tariff} = \text{FOB} \times \text{Tariff \%}$$
  $$\text{Ocean Freight per Unit} = \frac{\text{Contract Rate}}{\text{Optimal Units in Container (40HC)}}$$
  $$\text{Destination Ground Freight per Unit} = \frac{\text{53FT Domestic Linehaul Rate}}{\text{Optimal Units in 53FT Dry Van}}$$
  $$\text{Net Landed Cost} = \text{FOB} + \text{Duty} + \text{Tariff} + \text{Ocean Freight} + \text{Inland Drayage} + \text{Port Handling} + \text{Ground Delivery}$$

### 2. Multi-Modal 3D Container Pack Optimization
- Simulates dimensional packing across **5 international & domestic container equipment types**:
  - **40' High Cube (40HC)** (76.0 CBM nominal volume)
  - **45' High Cube (45HC)** (86.0 CBM nominal volume)
  - **40' Standard (40STD)** (67.0 CBM nominal volume)
  - **20' Standard (20STD)** (33.0 CBM nominal volume)
  - **53' Domestic Dry Van (53FT)** (110.0 CBM nominal volume)
- **Constraint Solver**: Computes volumetric carton yield ($L \times W \times H$) vs. legal maximum road payload limits ($\approx 26,000 \text{ kg}$) to detect whether a shipment is **cube-constrained** or **weight-constrained**.

### 3. Interactive Engine Execution & Terminal Logs
- In addition to real-time calculation on create/update, users can trigger the full **`⚡ Run Calculation Engine`** pipeline on `/dashboard/products_view` to recompute logistics matrices across all catalogue items with live terminal streaming and execution timing.

### 4. Self-Contained Template Downloads (SharePoint-Free)
- Completely unlinked from private enterprise intranets or Microsoft 365 tenants.
- Features embedded downloadable `.xlsx` templates for active bulk product creation, attribute updates, SKU re-coding, and product status lifecycle workflows.

### 5. Cloud Demo Guardrails & Database Protection
- Designed for safe public portfolio demonstration on Vercel:
  - **Row Limits**: Max 10 rows per Excel upload to prevent serverless execution timeouts.
  - **User Quotas**: Persistent PostgreSQL-backed rate limiter (`demo_rate_limits`) allowing up to 10 product creations per user per day.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5 (Strict Mode)
- **Database & ORM**: Neon Serverless PostgreSQL with Drizzle ORM
- **Authentication**: Clerk Auth (Consumer mode with organization tenancy support)
- **State & Data Fetching**: TanStack Query (React Query v5), `nuqs` (URL query state)
- **Data Tables**: TanStack Table v8 with column pinning, pagination, and multi-filters
- **UI & Styling**: Tailwind CSS, Radix UI primitives, Lucide Icons, Tabler Icons
- **Spreadsheet Processing**: SheetJS (`xlsx`) and `exceljs`

---

## 📐 Parameters & Governance Structure

The platform organizes global trade variables into two distinct lifecycle paradigms:

| Parameter Category | Lifecycle & Cardinality | Examples | Engine Impact |
| :--- | :--- | :--- | :--- |
| **Commodity Classifications** | **Multiple Concurrent ($N$ Active)** | HTS Codes, Section 301 Tariffs, Free Trade Agreements | Dictates statutory customs duty % and trade exemptions mapped by SKU material and origin. |
| **Carrier Contracts & Rates** | **Single Active (Deprecates Previous)** | Ocean Freight Lanes, Domestic Ground Linehauls, Port Fees | Amortized per piece across container load capacities; historical revisions are archived automatically. |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- `pnpm` (v9+)
- A [Neon PostgreSQL](https://neon.tech) database
- A [Clerk](https://clerk.com) application for authentication

### 1. Clone & Install
```bash
git clone git@github-personal:ValenGu1t0/global-landed-cost-engine.git
cd global-landed-cost-engine
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/dashboard/overview"
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL="/dashboard/overview"
```

### 3. Initialize Database & Seed Catalogue
```bash
# Push Drizzle schema to Neon
pnpm drizzle-kit push

# Seed logistics parameters and demo product catalogue
pnpm db:seed
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👨‍💻 Author

**Valentino Privitera**  
- GitHub: [@ValenGu1t0](https://github.com/ValenGu1t0)  
- Portfolio Showcase: Global Landed Cost Engine
