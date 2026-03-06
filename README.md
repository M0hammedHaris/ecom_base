# ecom_base

A production-ready, scalable e-commerce foundation built with **Next.js 16+**, **React 19**, **Tailwind CSS 4**, **shadcn/ui**, and **Drizzle ORM**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| Database | SQLite (dev) / Turso LibSQL (prod) |
| ORM | Drizzle ORM |
| Validation | Zod |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Biome |
| Language | TypeScript (strict) |

## Project Structure

```
src/
├── app/
│   ├── (shop)/            # Customer-facing routes
│   │   ├── layout.tsx     # Header + Footer layout
│   │   ├── products/      # Product listing & detail
│   │   │   └── [slug]/    # Individual product page
│   │   └── cart/          # Shopping cart
│   ├── (admin)/           # Admin panel
│   │   └── admin/
│   │       ├── page.tsx   # Dashboard
│   │       └── products/  # Product management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Redirects to /products
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── product/           # Product components
│   ├── cart/              # Cart components
│   └── layout/            # Header & Footer
├── lib/
│   ├── db/
│   │   ├── index.ts       # Drizzle client
│   │   └── schema.ts      # Database schema
│   ├── actions/
│   │   ├── cart.ts        # Cart Server Actions
│   │   └── products.ts    # Product Server Actions
│   └── utils.ts           # Utilities (cn, formatPrice, slugify)
└── tests/                 # Vitest test suites
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local as needed
```

### 3. Set up the database

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run lint:biome` | Biome lint + format |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run Vitest test suite |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Drizzle Studio |

## Architecture Decisions

- **React Server Components (RSC)** for all data-fetching pages (products, cart, admin)
- **Server Actions** for all mutations (addToCart, updateCartItem, createProduct, deleteProduct)
- **Session-based cart** using HTTP-only cookies (no auth required)
- **Optimistic UI** via `useTransition` in client components
- **Zod validation** on all Server Actions for input safety
- **Drizzle ORM** with type-safe queries and automatic schema migrations

## Pages

| Route | Description |
|-------|-------------|
| `/products` | Product catalog with filtering & search |
| `/products/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management (CRUD) |
