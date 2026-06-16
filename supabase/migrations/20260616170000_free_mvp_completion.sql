alter table public.profiles
add column if not exists phone text not null default '',
add column if not exists payout_method text not null default 'manual',
add column if not exists payout_details text not null default '',
add column if not exists is_admin boolean not null default false;

alter table public.products
add column if not exists moderation_status text not null default 'approved'
check (moderation_status in ('pending', 'approved', 'rejected'));

alter table public.order_items
add column if not exists delivery_status text not null default 'pending'
check (delivery_status in ('pending', 'delivered')),
add column if not exists delivered_at timestamptz;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Conversation participants read messages"
on public.messages for select
using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Conversation participants send messages"
on public.messages for insert
with check (
  auth.uid() = sender_id
  and (auth.uid() = buyer_id or auth.uid() = seller_id)
);

create policy "Sellers update delivery for their order items"
on public.order_items for update
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "Admins moderate products"
on public.products for update
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

drop policy if exists "Active products are readable by everyone" on public.products;
create policy "Approved active products are readable by everyone"
on public.products for select
using ((is_active = true and moderation_status = 'approved') or seller_id = auth.uid());

create policy "Buyers read delivered listing files"
on storage.objects for select
using (
  bucket_id = 'listing-files'
  and exists (
    select 1
    from public.products p
    join public.order_items oi on oi.product_id = p.id
    join public.orders o on o.id = oi.order_id
    where p.file_path = storage.objects.name
      and o.buyer_id = auth.uid()
      and oi.delivery_status = 'delivered'
  )
);

create index if not exists messages_participants_idx on public.messages(buyer_id, seller_id, created_at desc);
create index if not exists messages_product_idx on public.messages(product_id, created_at desc);
