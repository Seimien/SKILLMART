import { supabase } from "./supabase";
import type { CartItem, Category, Message, Order, Product, User } from "../types";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  avatar_initials: string;
  bio: string;
  rating: number;
  total_earned: number;
  total_sales: number;
  phone?: string;
  payout_method?: string;
  payout_details?: string;
  is_admin?: boolean;
  created_at: string;
};

type ProductRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  image_url: string;
  file_path: string | null;
  badge: string | null;
  tags: string[];
  rating: number;
  reviews_count: number;
  downloads_count: number;
  created_at: string;
  profiles?: Pick<ProfileRow, "full_name" | "avatar_initials"> | null;
};

type OrderRow = {
  id: string;
  total: number;
  status: Order["status"];
  payment_method: "card" | "mpesa";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  order_items?: {
    id?: string;
    product_id: string | null;
    seller_id: string | null;
    title: string;
    unit_price: number;
    quantity: number;
    delivery_status?: "pending" | "delivered";
    delivered_at?: string | null;
    products?: {
      category: Category;
      image_url: string;
      file_path: string | null;
      profiles?: Pick<ProfileRow, "full_name" | "avatar_initials"> | null;
    } | null;
  }[];
};

type MessageRow = {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  products?: { title: string } | null;
  buyer?: Pick<ProfileRow, "full_name"> | null;
  seller?: Pick<ProfileRow, "full_name"> | null;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=260&fit=crop";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? "S"}${parts[1]?.[0] ?? "M"}`.toUpperCase();
}

export function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    avatar: row.avatar_initials || initials(row.full_name),
    bio: row.bio,
    joinedDate: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    totalEarned: Number(row.total_earned ?? 0),
    totalSales: Number(row.total_sales ?? 0),
    rating: Number(row.rating ?? 0),
    phone: row.phone ?? "",
    payoutMethod: row.payout_method ?? "manual",
    payoutDetails: row.payout_details ?? "",
    isAdmin: Boolean(row.is_admin),
  };
}

export function mapProduct(row: ProductRow): Product {
  const sellerName = row.profiles?.full_name ?? "SkillMart Seller";

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    seller: sellerName,
    sellerId: row.seller_id,
    sellerAvatar: row.profiles?.avatar_initials ?? initials(sellerName),
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews_count ?? 0),
    image: row.image_url || fallbackImage,
    badge: row.badge ?? undefined,
    tags: row.tags ?? [],
    downloads: Number(row.downloads_count ?? 0),
    createdAt: row.created_at,
    filePath: row.file_path,
  };
}

export function mapOrder(row: OrderRow): Order {
  return {
    id: row.id.slice(0, 8).toUpperCase(),
    date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    items: (row.order_items ?? []).map((item) => ({
      orderItemId: item.id,
      id: item.product_id ?? item.title,
      sellerId: item.seller_id ?? "",
      seller: item.products?.profiles?.full_name ?? "",
      sellerAvatar: item.products?.profiles?.avatar_initials ?? "SM",
      title: item.title,
      description: "",
      category: item.products?.category ?? "Books",
      image: item.products?.image_url || fallbackImage,
      filePath: item.products?.file_path ?? null,
      price: Number(item.unit_price),
      rating: 0,
      reviews: 0,
      tags: [],
      qty: item.quantity,
      deliveryStatus: item.delivery_status ?? "pending",
      deliveredAt: item.delivered_at ?? null,
    })),
  };
}

export function mapMessage(row: MessageRow): Message {
  return {
    id: row.id,
    productId: row.product_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
    productTitle: row.products?.title,
    buyerName: row.buyer?.full_name,
    sellerName: row.seller?.full_name,
  };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return mapProfile(data as ProfileRow);
}

export async function updateProfile(userId: string, input: {
  fullName: string;
  bio: string;
  phone: string;
  payoutMethod: string;
  payoutDetails: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      avatar_initials: initials(input.fullName),
      bio: input.bio,
      phone: input.phone,
      payout_method: input.payoutMethod,
      payout_details: input.payoutDetails,
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return mapProfile(data as ProfileRow);
}

export async function listProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(full_name, avatar_initials)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function listOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(id, product_id, seller_id, title, unit_price, quantity, delivery_status, delivered_at, products(category, image_url, file_path, profiles(full_name, avatar_initials)))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}

export async function listWishlist() {
  const { data, error } = await supabase.from("wishlists").select("product_id");
  if (error) throw error;
  return (data ?? []).map((row) => row.product_id as string);
}

export async function createListing(input: {
  sellerId: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  tags: string[];
  imageUrl?: string;
  file?: File | null;
}) {
  let filePath: string | null = null;

  if (input.file) {
    filePath = `${input.sellerId}/${crypto.randomUUID()}-${input.file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-files")
      .upload(filePath, input.file);
    if (uploadError) throw uploadError;
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: input.sellerId,
      title: input.title,
      category: input.category,
      price: input.price,
      description: input.description,
      tags: input.tags,
      image_url: input.imageUrl || fallbackImage,
      file_path: filePath,
      badge: "New",
    })
    .select("*, profiles(full_name, avatar_initials)")
    .single();

  if (error) throw error;
  return mapProduct(data as ProductRow);
}

export async function deleteListing(productId: string) {
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;
}

export async function setWishlistItem(userId: string, productId: string, active: boolean) {
  if (active) {
    const { error } = await supabase.from("wishlists").insert({ user_id: userId, product_id: productId });
    if (error && error.code !== "23505") throw error;
    return;
  }

  const { error } = await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}

export async function createOrder(input: {
  buyerId: string;
  contactName: string;
  contactEmail: string;
  method: "card" | "mpesa";
  cart: CartItem[];
  subtotal: number;
  fee: number;
  total: number;
}) {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: input.buyerId,
      contact_name: input.contactName,
      contact_email: input.contactEmail,
      payment_method: input.method,
      payment_status: "pending",
      subtotal: input.subtotal,
      platform_fee: input.fee,
      total: input.total,
    })
    .select("*")
    .single();

  if (error) throw error;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      seller_id: item.sellerId,
      title: item.title,
      unit_price: item.price,
      quantity: item.qty,
      delivery_status: "pending",
    }))
  );

  if (itemsError) throw itemsError;

  return mapOrder({
    ...(order as OrderRow),
    order_items: input.cart.map((item) => ({
      product_id: item.id,
      seller_id: item.sellerId,
      title: item.title,
      unit_price: item.price,
      quantity: item.qty,
      delivery_status: "pending",
      delivered_at: null,
      products: {
        category: item.category,
        image_url: item.image,
        file_path: item.filePath ?? null,
        profiles: { full_name: item.seller, avatar_initials: item.sellerAvatar },
      },
    })),
  });
}

export async function listMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*, products(title), buyer:buyer_id(full_name), seller:seller_id(full_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as MessageRow[]).map(mapMessage);
}

export async function sendMessage(input: {
  productId: string;
  buyerId: string;
  sellerId: string;
  senderId: string;
  body: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      product_id: input.productId,
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      sender_id: input.senderId,
      body: input.body,
    })
    .select("*, products(title), buyer:buyer_id(full_name), seller:seller_id(full_name)")
    .single();

  if (error) throw error;
  return mapMessage(data as MessageRow);
}

export async function markOrderItemDelivered(orderItemId: string) {
  const { error } = await supabase
    .from("order_items")
    .update({ delivery_status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", orderItemId);

  if (error) throw error;
}

export async function getDownloadUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("listing-files")
    .createSignedUrl(filePath, 60 * 10);

  if (error) throw error;
  return data.signedUrl;
}
