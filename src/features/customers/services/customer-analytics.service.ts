import { createClient } from "@/lib/supabase/server";

export type CustomerStats = {
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  overdueRentals: number;
  averageRentalDays: number;
};

export type RentalHistory = {
  id: string;
  book: {
    id: string;
    title: string;
    author: string | null;
    cover_url: string | null;
  };
  start_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  status: "active" | "completed" | "cancelled";
  created_at: string;
};

export type TopBook = {
  book_id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  rental_count: number;
};

export async function getCustomerStats(
  customerId: string
): Promise<CustomerStats> {
  const supabase = await createClient();

  const { data: rentals, error } = await supabase
    .from("rentals")
    .select("status, start_date, expected_return_date, actual_return_date")
    .eq("customer_id", customerId);

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date();
  let totalDays = 0;
  let completedCount = 0;

  const stats = rentals.reduce(
    (acc, rental) => {
      acc.totalRentals++;

      if (rental.status === "active") {
        acc.activeRentals++;
        const expectedReturn = new Date(rental.expected_return_date);
        if (expectedReturn < now) {
          acc.overdueRentals++;
        }
      } else if (rental.status === "completed") {
        acc.completedRentals++;
        completedCount++;
        if (rental.actual_return_date) {
          const start = new Date(rental.start_date);
          const end = new Date(rental.actual_return_date);
          totalDays += Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      } else if (rental.status === "cancelled") {
        acc.cancelledRentals++;
      }

      return acc;
    },
    {
      totalRentals: 0,
      activeRentals: 0,
      completedRentals: 0,
      cancelledRentals: 0,
      overdueRentals: 0,
      averageRentalDays: 0,
    }
  );

  stats.averageRentalDays =
    completedCount > 0 ? Math.round(totalDays / completedCount) : 0;

  return stats;
}

export async function getCustomerRentalHistory(
  customerId: string
): Promise<RentalHistory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      id,
      start_date,
      expected_return_date,
      actual_return_date,
      status,
      created_at,
      book:books(id, title, author, cover_url)
    `
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((rental) => ({
    ...rental,
    book: rental.book as unknown as RentalHistory["book"],
  }));
}

export async function getCustomerTopBooks(
  customerId: string,
  limit = 5
): Promise<TopBook[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      book_id,
      book:books(id, title, author, cover_url)
    `
    )
    .eq("customer_id", customerId)
    .neq("status", "cancelled");

  if (error) {
    throw new Error(error.message);
  }

  type BookData = {
    id: string;
    title: string;
    author: string | null;
    cover_url: string | null;
  };

  const bookCounts = data.reduce(
    (acc, rental) => {
      const bookId = rental.book_id;
      const book = rental.book as unknown as BookData;
      if (!acc[bookId] && book) {
        acc[bookId] = {
          book_id: bookId,
          title: book.title,
          author: book.author,
          cover_url: book.cover_url,
          rental_count: 0,
        };
      }
      if (acc[bookId]) {
        acc[bookId].rental_count++;
      }
      return acc;
    },
    {} as Record<string, TopBook>
  );

  return Object.values(bookCounts)
    .sort((a, b) => b.rental_count - a.rental_count)
    .slice(0, limit);
}

