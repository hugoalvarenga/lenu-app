create type public.book_status as enum ('available', 'rented', 'unavailable');

create table public.books (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  author text,
  isbn text,
  description text,
  cover_url text,
  status public.book_status default 'available' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index books_user_id_idx on public.books(user_id);
create index books_status_idx on public.books(status);

alter table public.books enable row level security;

create policy "Users can view own books"
  on public.books for select
  using (auth.uid() = user_id);

create policy "Users can insert own books"
  on public.books for insert
  with check (auth.uid() = user_id);

create policy "Users can update own books"
  on public.books for update
  using (auth.uid() = user_id);

create policy "Users can delete own books"
  on public.books for delete
  using (auth.uid() = user_id);

create trigger books_updated_at
  before update on public.books
  for each row execute procedure public.handle_updated_at();
