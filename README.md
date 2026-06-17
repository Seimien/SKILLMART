# SkillMart — Student Marketplace (Frontend + Supabase migrations)
Name: Joseph Seimien Mienwipia
ID: 23488-2023
URL: www.skillmartt.vercel.app
## App overview
**SkillMart** is a student marketplace where learners can **buy and sell research papers, project code, books, and freelance time**.

This repository includes:
- **`skillmart/`** — the **frontend** (React + TypeScript + Vite)
- **`supabase/`** — Supabase SQL migrations for the backend schema

---

## User flow (high level)
1. **Open app** → Landing / marketplace browsing
2. **Sign up / Log in** (auth modal)
3. Browse **Marketplace** → open a **Product/Listing**
4. **Add to cart** → go to **Cart**
5. **Checkout** (stepper)
   - Enter contact details
   - Choose payment method UI (Card or M-Pesa; mock/no real payment processing)
   - Review totals and place order
6. **Confirmation** screen shows the latest order details
7. Orders appear in:
   - **Profile** (order history)
   - **My Store** (seller sales + analytics)

---

## Core features / functional requirements
### Marketplace & discovery
- Browse listings
- Search and filter by category
- Sort (e.g., popular/newest/price)

### Product & listing
- Product detail view
- Related items
- Wishlist support
- Listing download/link handling for stored files

### Cart & checkout
- Cart quantity controls
- Platform fee + total calculation
- Multi-step checkout:
  - Contact → Payment → Review
- Saves orders to Supabase (`orders` + `order_items`)

### Seller tools (“My Store”)
- Manage seller listings
- View sales derived from order items
- Basic analytics tiles

### Messaging
- Start a conversation from product pages
- Persist message threads in Supabase (`messages`)

---

## Tech stack
### Frontend (`skillmart/`)
- React 18 + TypeScript
- Vite (build/dev)
- Tailwind CSS
- Supabase client (`@supabase/supabase-js`)

### Backend (`supabase/`)
- Supabase SQL migrations (tables used by the frontend)

---

## Environment variables (frontend)
The frontend reads Supabase configuration from Vite env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Make these available in local dev (via `.env.local`) and in Vercel for deployments.

---

## Running locally
From the repo root:

```bash
cd skillmart
npm install
npm run dev
```

---

## Docker (production serving)
This repo supports running the **frontend** in a container (nginx + built `dist/`).

From the repo root:

```bash
docker compose -f skillmart/docker-compose.yml up --build
```

Then open:
- `http://localhost:8080`

---

## CI/CD / Vercel
- Docker does **not** replace the Vercel workflow; it only provides an optional way to serve the built frontend.
- Ensure Vercel has the same VITE Supabase env vars so the frontend can connect to Supabase.

