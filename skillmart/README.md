# SkillMart — Frontend

Student marketplace for buying/selling research papers, project code, books, and freelance time. Frontend-only build — uses mock data, no backend yet.

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

## What's Implemented

- Full auth flow (mock — no real backend yet): signup/login modal, logged-in state
- Marketplace: search, category filter, sort (popular/newest/price)
- Product detail page with related items, wishlist, add to cart
- Cart with quantity controls and platform fee calculation
- 3-step checkout (Contact → Payment → Review) with card/M-Pesa toggle
- Seller dashboard (My Store) with Listings / Sales / Analytics tabs
- Add Listing form
- Profile page with order history
- Dark mode toggle — wired and on-brand (no more blue swap)
- Toast notifications for cart actions (via `sonner`)

## What's Next (Backend — tomorrow)

Replace `src/data/mock.ts` calls with Supabase queries:
- `products` table → Marketplace, ProductDetail, Dashboard feeds
- `users` table + Supabase Auth → AuthModal, Profile
- `orders` table → Checkout, Confirmation, MyStore Sales tab
- Supabase Storage → file uploads in AddListing

All mock data lives in one file (`src/data/mock.ts`) specifically so it's a single swap point when the backend is ready.
