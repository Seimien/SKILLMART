create extension if not exists "pgcrypto";

create type public.product_category as enum ('Research Papers', 'Project Code', 'Books', 'Hire');
create type public.order_status as enum ('Processing', 'Delivered', 'Shipped', 'Cancelled');
create type public.payment_method as enum ('card', 'mpesa');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_initials text not null default 'SM',
  bio text not null default '',
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  total_earned numeric(12,2) not null default 0 check (total_earned >= 0),
  total_sales integer not null default 0 check (total_sales >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  category public.product_category not null,
  image_url text not null default '',
  file_path text,
  badge text,
  tags text[] not null default '{}',
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews_count integer not null default 0 check (reviews_count >= 0),
  downloads_count integer not null default 0 check (downloads_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  platform_fee numeric(12,2) not null default 0 check (platform_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  status public.order_status not null default 'Processing',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  contact_name text not null,
  contact_email text not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,
  title text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.wishlists (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, reviewer_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'SkillMart User');

  insert into public.profiles (id, full_name, email, avatar_initials, bio)
  values (
    new.id,
    display_name,
    coalesce(new.email, ''),
    upper(left(regexp_replace(display_name, '[^A-Za-z0-9 ]', '', 'g'), 1) || left(split_part(display_name, ' ', 2), 1)),
    'SkillMart seller and buyer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;

create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

create policy "Users update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Active products are readable by everyone"
on public.products for select
using (is_active = true or seller_id = auth.uid());

create policy "Sellers create their own products"
on public.products for insert
with check (seller_id = auth.uid());

create policy "Sellers update their own products"
on public.products for update
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "Sellers delete their own products"
on public.products for delete
using (seller_id = auth.uid());

create policy "Buyers read their own orders"
on public.orders for select
using (buyer_id = auth.uid());

create policy "Sellers read orders containing their items"
on public.orders for select
using (
  exists (
    select 1 from public.order_items oi
    where oi.order_id = orders.id
    and oi.seller_id = auth.uid()
  )
);

create policy "Buyers create their own orders"
on public.orders for insert
with check (buyer_id = auth.uid());

create policy "Order items visible to buyer or seller"
on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and (o.buyer_id = auth.uid() or order_items.seller_id = auth.uid())
  )
);

create policy "Buyers create items for their orders"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and o.buyer_id = auth.uid()
  )
);

create policy "Users read their own wishlist"
on public.wishlists for select
using (user_id = auth.uid());

create policy "Users manage their own wishlist"
on public.wishlists for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Reviews are public"
on public.reviews for select
using (true);

create policy "Users create their own reviews"
on public.reviews for insert
with check (reviewer_id = auth.uid());

create policy "Users update their own reviews"
on public.reviews for update
using (reviewer_id = auth.uid())
with check (reviewer_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-files',
  'listing-files',
  false,
  52428800,
  array[
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;

create policy "Sellers upload listing files"
on storage.objects for insert
with check (bucket_id = 'listing-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Sellers read their listing files"
on storage.objects for select
using (bucket_id = 'listing-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Sellers update their listing files"
on storage.objects for update
using (bucket_id = 'listing-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Sellers delete their listing files"
on storage.objects for delete
using (bucket_id = 'listing-files' and auth.uid()::text = (storage.foldername(name))[1]);

create index products_category_idx on public.products(category);
create index products_seller_idx on public.products(seller_id);
create index products_created_at_idx on public.products(created_at desc);
create index order_items_seller_idx on public.order_items(seller_id);
create index orders_buyer_idx on public.orders(buyer_id, created_at desc);
