create type public.rental_status as enum ('active', 'returned', 'overdue', 'cancelled');

create table public.rentals (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  start_date date not null,
  expected_return_date date not null,
  actual_return_date date,
  status public.rental_status default 'active' not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index rentals_book_id_idx on public.rentals(book_id);
create index rentals_customer_id_idx on public.rentals(customer_id);
create index rentals_status_idx on public.rentals(status);
create index rentals_dates_idx on public.rentals(start_date, expected_return_date);

alter table public.rentals enable row level security;

create policy "Users can view rentals of own books"
  on public.rentals for select
  using (
    exists (
      select 1 from public.books
      where books.id = rentals.book_id
      and books.user_id = auth.uid()
    )
  );

create policy "Users can insert rentals for own books"
  on public.rentals for insert
  with check (
    exists (
      select 1 from public.books
      where books.id = rentals.book_id
      and books.user_id = auth.uid()
    )
  );

create policy "Users can update rentals of own books"
  on public.rentals for update
  using (
    exists (
      select 1 from public.books
      where books.id = rentals.book_id
      and books.user_id = auth.uid()
    )
  );

create policy "Users can delete rentals of own books"
  on public.rentals for delete
  using (
    exists (
      select 1 from public.books
      where books.id = rentals.book_id
      and books.user_id = auth.uid()
    )
  );

create trigger rentals_updated_at
  before update on public.rentals
  for each row execute procedure public.handle_updated_at();

create or replace function public.update_book_status_on_rental()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.books set status = 'rented' where id = NEW.book_id;
  elsif TG_OP = 'UPDATE' then
    if NEW.status = 'returned' or NEW.status = 'cancelled' then
      update public.books set status = 'available' where id = NEW.book_id;
    end if;
  elsif TG_OP = 'DELETE' then
    update public.books set status = 'available' where id = OLD.book_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger update_book_status_on_rental_change
  after insert or update or delete on public.rentals
  for each row execute procedure public.update_book_status_on_rental();
