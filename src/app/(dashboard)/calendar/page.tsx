import { RentalCalendar, getRentals } from "@/features/rentals";
import { getBooks } from "@/features/books";
import { getCustomers } from "@/features/customers";

export default async function CalendarPage() {
  const [rentals, books, customers] = await Promise.all([
    getRentals(),
    getBooks(),
    getCustomers(),
  ]);

  return (
    <RentalCalendar rentals={rentals} books={books} customers={customers} />
  );
}
