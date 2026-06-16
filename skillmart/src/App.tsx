import { Toaster } from "sonner";
import { useApp } from "./context/AppContext";
import { AppHeader } from "./components/shared/AppHeader";
import { AuthModal } from "./components/auth/AuthModal";

import { Splash } from "./screens/Splash";
import { Landing } from "./screens/Landing";
import { Dashboard } from "./screens/Dashboard";
import { Marketplace } from "./screens/Marketplace";
import { ProductDetail } from "./screens/ProductDetail";
import { Cart } from "./screens/Cart";
import { Checkout } from "./screens/Checkout";
import { Confirmation } from "./screens/Confirmation";
import { MyStore } from "./screens/MyStore";
import { AddListing } from "./screens/AddListing";
import { Profile } from "./screens/Profile";
import { Messages } from "./screens/Messages";

export default function App() {
  const { screen, isAuthenticated, loading } = useApp();

  if (loading) return <Splash />;

  /* Pre-auth screens render full-bleed, no header */
  if (screen === "splash") return <Splash />;
  if (!isAuthenticated) return <><Landing /><AuthModal /></>;

  /* Authenticated shell */
  const SCREEN_MAP: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    marketplace: <Marketplace />,
    product: <ProductDetail />,
    cart: <Cart />,
    checkout: <Checkout />,
    confirmation: <Confirmation />,
    "my-store": <MyStore />,
    "add-listing": <AddListing />,
    profile: <Profile />,
    messages: <Messages />,
  };

  return (
    <div className="min-h-screen bg-page text-page">
      <AppHeader />
      {SCREEN_MAP[screen] ?? <Dashboard />}
      <Toaster position="top-center" richColors />
    </div>
  );
}
