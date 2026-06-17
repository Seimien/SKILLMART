# SkillMart — Student Marketplace (Frontend)

## Purpose / Name
**SkillMart** is a student marketplace where learners can **buy and sell research papers, project code, books, and freelance time**. This repository contains the **frontend application**.

## Tech stack
- **React 18 + TypeScript**
- **Vite** (build tool/dev server)
- **Tailwind CSS** + custom CSS tokens
- **Supabase** (`@supabase/supabase-js`) for:
  - Auth session
  - CRUD for products/listings and orders
  - Messaging threads
  - Storage for listing files
- UI utilities:
  - `sonner` toast notifications
  - `lucide-react` icons
  - `tailwind-merge`, `clsx`

> Note: The app is designed to work with Supabase tables defined in `supabase/migrations/*.sql`.

## Highlights (what the app does)
- Auth gating: public browsing + an authenticated “dashboard shell”
- Marketplace experience:
  - Browse categories
  - Search
  - Sort (popular/newest/price)
- Product detail:
  - Related items
  - Wishlist
  - Add-to-cart
  - (For “Hire” category) contact flow with direct CTA
- Cart:
  - Quantity controls
  - Platform fee + total calculations
- Checkout:
  - 3 steps: Contact → Method → Review
  - Card / M-Pesa UI toggle (no real payment processing)
  - Saves order to Supabase and shows confirmation
- Post-checkout:
  - Confirmation screen reads the most recent order
  - Profile page shows order history
- Seller tools (“My Store”):
  - Listings management
  - Sales table derived from order items
  - Analytics tiles
- Messaging:
  - Start a conversation from a product page
  - Send messages in a thread

## User flow (happy path)
1. Open app → Landing screen
2. Sign up / Log in via `AuthModal`
3. App enters authenticated shell (`AppHeader` + screen routing)
4. Browse marketplace → open a product → add to cart
5. Go to Cart → proceed to Checkout
6. Checkout stepper:
   - Enter contact details
   - Select payment method (Card or M-Pesa)
   - Review totals and place order
7. Confirmation screen appears → order id and totals shown
8. Order appears in:
   - Profile order history
   - Seller sales tables (items that belong to seller)

## Folder structure

## Folder Structure

```
src/
  types/index.ts          All TypeScript interfaces (Product, User, Order, etc.)
  data/mock.ts             Mock products, demo user, seed orders, testimonials
  context/
    AppContext.tsx         Cart, auth, navigation, wishlist state
    ThemeContext.tsx        Dark/light mode toggle (persisted to localStorage)
  components/
    shared/                 Reusable UI: ProductCard, AppHeader, Pill, StarRow, AvatarBubble
    auth/AuthModal.tsx       Login/signup overlay
  screens/                  One file per screen (Splash, Landing, Dashboard, Marketplace,
                             ProductDetail, Cart, Checkout, Confirmation, MyStore,
                             AddListing, Profile)
  App.tsx                   Screen router (~40 lines)
  main.tsx                  Entry point
  styles/
    theme.css               CSS variable tokens (light + dark — both on-brand maroon)
    index.css                Tailwind layer + utility classes
```

## Run Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Hot reload is enabled — edit any screen file and it updates instantly.

## Run with Docker

This repo includes:
- `Dockerfile` (multi-stage build + nginx runtime)
- `docker-compose.yml` (single service)
- `nginx.conf` (SPA route fallback)

Build and start:

```bash
docker compose up --build
```

Open:
- `http://localhost:8080`

