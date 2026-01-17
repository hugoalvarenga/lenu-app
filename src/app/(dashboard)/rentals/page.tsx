import { RentalList, getRentals } from "@/features/rentals";
import { getBooks } from "@/features/books";
import { getCustomers } from "@/features/customers";

export default async function RentalsPage() {
  const [rentals, books, customers] = await Promise.all([
    getRentals(),
    getBooks(),
    getCustomers(),
  ]);

  return <RentalList rentals={rentals} books={books} customers={customers} />;
}
