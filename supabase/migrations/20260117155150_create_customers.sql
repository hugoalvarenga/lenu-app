create table public.customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index customers_user_id_idx on public.customers(user_id);

alter table public.customers enable row level security;

create policy "Users can view own customers"
  on public.customers for select
  using (auth.uid() = user_id);

create policy "Users can insert own customers"
  on public.customers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own customers"
  on public.customers for update
  using (auth.uid() = user_id);

create policy "Users can delete own customers"
  on public.customers for delete
  using (auth.uid() = user_id);

create trigger customers_updated_at
  before update on public.customers
  for each row execute procedure public.handle_updated_at();
