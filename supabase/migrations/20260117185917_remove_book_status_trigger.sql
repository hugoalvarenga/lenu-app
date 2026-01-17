drop trigger if exists update_book_status_on_rental_change on public.rentals;

drop function if exists public.update_book_status_on_rental();

update public.books set status = 'available' where status = 'rented';
