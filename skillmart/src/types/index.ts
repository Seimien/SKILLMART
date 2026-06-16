/* ── App screens ── */
export type Screen =
  | "splash" | "landing" | "dashboard" | "marketplace" | "product"
  | "cart" | "checkout" | "confirmation" | "my-store" | "add-listing" | "profile" | "messages";

/* ── Marketplace categories ── */
export type Category = "All" | "Research Papers" | "Project Code" | "Books" | "Hire";

/* ── Domain models ── */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;       // initials
  bio: string;
  joinedDate: string;
  totalEarned: number;
  totalSales: number;
  rating: number;
  phone?: string;
  payoutMethod?: string;
  payoutDetails?: string;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  seller: string;
  sellerId: string;
  sellerAvatar: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  tags: string[];
  downloads?: number;
  createdAt?: string;
  filePath?: string | null;
}

export interface CartItem extends Product { qty: number; }

export interface OrderItem extends CartItem {
  orderItemId?: string;
  filePath?: string | null;
  deliveryStatus?: "pending" | "delivered";
  deliveredAt?: string | null;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Processing" | "Delivered" | "Shipped" | "Cancelled";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "card" | "mpesa";
}

export interface Message {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  senderId: string;
  body: string;
  createdAt: string;
  productTitle?: string;
  buyerName?: string;
  sellerName?: string;
}
