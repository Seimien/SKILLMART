# TODO - Auth/dashboard loading fixes (SkillMart)

## Step 1
Add detailed error reporting in `skillmart/src/context/AppContext.tsx` for failures during:
- `supabase.auth.getSession()`
- `refreshProducts()`
- `loadUserData()` (getProfile/ensureProfile + orders/wishlist/messages)

## Step 2
Re-run dev and reproduce login failure; capture console + toast error message.

## Step 3
Based on the captured error, adjust DB mapping/RLS/schema mismatch in `skillmart/src/lib/api.ts` or Supabase policies.

