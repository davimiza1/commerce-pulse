create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (owner_id, email)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  sku text not null,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  unique (owner_id, sku)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  order_number text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  total numeric(12, 2) not null check (total >= 0),
  status text not null default 'Processing' check (status in ('Paid', 'Processing', 'Refunded')),
  created_at timestamptz not null default now(),
  unique (owner_id, order_number)
);

alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.orders to authenticated;

create policy "customers_owner_access" on public.customers
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "products_owner_access" on public.products
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "orders_owner_access" on public.orders
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create index if not exists customers_owner_id_idx on public.customers(owner_id);
create index if not exists products_owner_id_idx on public.products(owner_id);
create index if not exists orders_owner_id_idx on public.orders(owner_id);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_product_id_idx on public.orders(product_id);
