insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true);

create policy "Users can upload book covers"
  on storage.objects for insert
  with check (
    bucket_id = 'book-covers'
    and auth.role() = 'authenticated'
  );

create policy "Users can update own book covers"
  on storage.objects for update
  using (
    bucket_id = 'book-covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own book covers"
  on storage.objects for delete
  using (
    bucket_id = 'book-covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Public can view book covers"
  on storage.objects for select
  using (bucket_id = 'book-covers');
