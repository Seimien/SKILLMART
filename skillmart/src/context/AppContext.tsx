import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import {
  createListing,
  createOrder,
  deleteListing,
  ensureProfile,
  getDownloadUrl,
  getProfile,
  listMessages,
  listOrders,
  listProducts,
  listWishlist,
  markOrderItemDelivered,
  sendMessage,
  setWishlistItem,
  updateProfile,
} from "../lib/api";
import type { CartItem, Category, Message, Order, Product, Screen, User } from "../types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NewListingInput {
  title: string;
  category: Category;
  price: number;
  description: string;
  tags: string[];
  imageUrl?: string;
  file?: File | null;
}

interface CheckoutInput {
  contactName: string;
  contactEmail: string;
  method: "card" | "mpesa";
  subtotal: number;
  fee: number;
  total: number;
}

interface AppCtx {
  screen: Screen;
  go: (s: Screen) => void;
  loading: boolean;
  products: Product[];
  myListings: Product[];
  refreshProducts: () => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  orders: Order[];
  lastOrder: Order | null;
  submitOrder: (input: CheckoutInput) => Promise<void>;
  messages: Message[];
  selectedThread: Message | null;
  openThread: (message: Message) => void;
  startConversation: (product: Product) => Promise<void>;
  sendThreadMessage: (body: string) => Promise<void>;
  saveProfile: (input: { fullName: string; bio: string; phone: string; payoutMethod: string; payoutDetails: string }) => Promise<void>;
  markDelivered: (orderItemId: string) => Promise<void>;
  downloadItem: (filePath: string) => Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<"signed-in" | "confirm-email">;
  logout: () => Promise<void>;
  authModal: "none" | "login" | "signup";
  setAuthModal: (v: "none" | "login" | "signup") => void;
  wishlist: string[];
  toggleWishlist: (id: string) => Promise<void>;
  publishListing: (input: NewListingInput) => Promise<void>;
  removeListing: (id: string) => Promise<void>;
}

const Ctx = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("splash");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<Message | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<"none" | "login" | "signup">("none");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const isAuthenticated = Boolean(user);
  const myListings = useMemo(
    () => products.filter((product) => product.sellerId === user?.id),
    [products, user?.id]
  );

  const go = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const refreshProducts = useCallback(async () => {
    const nextProducts = await listProducts();
    setProducts(nextProducts);
    setSelectedProduct((current) => nextProducts.find((p) => p.id === current?.id) ?? current);
  }, []);

  const loadUserData = useCallback(async (authUser: SupabaseUser) => {
    let profile: User;

    try {
      profile = await getProfile(authUser.id);
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code !== "PGRST116") throw error;
      profile = await ensureProfile({
        userId: authUser.id,
        email: authUser.email ?? "",
        fullName: typeof authUser.user_metadata?.full_name === "string" ? authUser.user_metadata.full_name : undefined,
      });
    }

    const [nextOrders, nextWishlist] = await Promise.all([
      listOrders(),
      listWishlist(),
    ]);

    setUser(profile);
    setOrders(nextOrders);
    setWishlist(nextWishlist);
    setMessages(await listMessages());
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const { data } = await supabase.auth.getSession();
        await refreshProducts();

        if (data.session?.user && active) {
          await loadUserData(data.session.user);
          setScreen("dashboard");
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not load SkillMart data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setOrders([]);
        setWishlist([]);
        return;
      }

      loadUserData(session.user).catch((error) => {
        console.error(error);
        toast.error("Could not load your account.");
      });
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadUserData, refreshProducts]);

  const addToCart = useCallback((p: Product) => {
    if (p.category === "Hire") {
      toast("Hire listings are contacted directly.");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      return exists
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });
    toast.success(`"${p.title.slice(0, 30)}..." added to cart`, { duration: 2000 });
  }, []);

  const removeFromCart = useCallback((id: string) =>
    setCart((p) => p.filter((i) => i.id !== id)), []);

  const updateQty = useCallback((id: string, delta: number) =>
    setCart((p) =>
      p.flatMap((i) =>
        i.id !== id ? [i] : i.qty + delta <= 0 ? [] : [{ ...i, qty: i.qty + delta }]
      )
    ), []);

  const clearCart = useCallback(() => setCart([]), []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await loadUserData(data.user);
    setAuthModal("none");
    go("dashboard");
  }, [go, loadUserData]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) throw error;

    if (!data.session) {
      return "confirm-email";
    }

    if (data.user) await loadUserData(data.user);
    setAuthModal("none");
    go("dashboard");
    return "signed-in";
  }, [go, loadUserData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCart([]);
    setOrders([]);
    setWishlist([]);
    go("landing");
  }, [go]);

  const toggleWishlist = useCallback(async (id: string) => {
    if (!user) {
      setAuthModal("login");
      return;
    }

    const active = !wishlist.includes(id);
    setWishlist((p) => active ? [...p, id] : p.filter((item) => item !== id));

    try {
      await setWishlistItem(user.id, id, active);
      toast(active ? "Added to wishlist" : "Removed from wishlist", { duration: 1500 });
    } catch (error) {
      setWishlist((p) => active ? p.filter((item) => item !== id) : [...p, id]);
      console.error(error);
      toast.error("Wishlist update failed.");
    }
  }, [user, wishlist]);

  const publishListing = useCallback(async (input: NewListingInput) => {
    if (!user) throw new Error("Please sign in before creating a listing.");
    const product = await createListing({ ...input, sellerId: user.id });
    setProducts((prev) => [product, ...prev]);
    toast.success("Listing created and live on the marketplace.");
  }, [user]);

  const removeListing = useCallback(async (id: string) => {
    await deleteListing(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success("Listing removed.");
  }, []);

  const submitOrder = useCallback(async (input: CheckoutInput) => {
    if (!user) throw new Error("Please sign in before checkout.");
    if (cart.length === 0) throw new Error("Your cart is empty.");

    const order = await createOrder({
      buyerId: user.id,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      method: input.method,
      cart,
      subtotal: input.subtotal,
      fee: input.fee,
      total: input.total,
    });

    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    clearCart();
    go("confirmation");
  }, [cart, clearCart, go, user]);

  const openThread = useCallback((message: Message) => {
    setSelectedThread(message);
    go("messages");
  }, [go]);

  const startConversation = useCallback(async (product: Product) => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    if (product.sellerId === user.id) {
      toast("This is your listing.");
      return;
    }

    const existing = messages.find((message) =>
      message.productId === product.id &&
      message.buyerId === user.id &&
      message.sellerId === product.sellerId
    );

    if (existing) {
      openThread(existing);
      return;
    }

    const message = await sendMessage({
      productId: product.id,
      buyerId: user.id,
      sellerId: product.sellerId,
      senderId: user.id,
      body: `Hi, I am interested in "${product.title}".`,
    });
    setMessages((prev) => [message, ...prev]);
    openThread(message);
  }, [messages, openThread, user]);

  const sendThreadMessage = useCallback(async (body: string) => {
    if (!user || !selectedThread) return;
    const message = await sendMessage({
      productId: selectedThread.productId,
      buyerId: selectedThread.buyerId,
      sellerId: selectedThread.sellerId,
      senderId: user.id,
      body,
    });
    setMessages((prev) => [message, ...prev]);
    setSelectedThread(message);
  }, [selectedThread, user]);

  const saveProfile = useCallback(async (input: { fullName: string; bio: string; phone: string; payoutMethod: string; payoutDetails: string }) => {
    if (!user) throw new Error("Please sign in first.");
    const nextUser = await updateProfile(user.id, input);
    setUser(nextUser);
    toast.success("Profile updated.");
  }, [user]);

  const markDelivered = useCallback(async (orderItemId: string) => {
    await markOrderItemDelivered(orderItemId);
    setOrders(await listOrders());
    toast.success("Item marked as delivered.");
  }, []);

  const downloadItem = useCallback(async (filePath: string) => {
    const url = await getDownloadUrl(filePath);
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <Ctx.Provider value={{
      screen, go, loading,
      products, myListings, refreshProducts, selectedProduct, setSelectedProduct,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      orders, lastOrder, submitOrder,
      messages, selectedThread, openThread, startConversation, sendThreadMessage,
      saveProfile, markDelivered, downloadItem,
      isAuthenticated, user, signIn, signUp, logout,
      authModal, setAuthModal,
      wishlist, toggleWishlist,
      publishListing, removeListing,
    }}>
      {children}
    </Ctx.Provider>
  );
}
