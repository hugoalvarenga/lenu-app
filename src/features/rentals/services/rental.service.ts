import { createClient } from "@/lib/supabase/server";
import type { Rental, RentalWithRelations, RentalStatus } from "../types";

export async function getRentals(
  status?: RentalStatus
): Promise<RentalWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("rentals")
    .select(
      `
      *,
      book:books(*),
      customer:customers(*)
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as RentalWithRelations[]) || [];
}

export async function getRental(
  id: string
): Promise<RentalWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      *,
      book:books(*),
      customer:customers(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as RentalWithRelations;
}

export async function getActiveRentals(): Promise<RentalWithRelations[]> {
  return getRentals("active");
}

export async function getOverdueRentals(): Promise<RentalWithRelations[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      *,
      book:books(*),
      customer:customers(*)
    `
    )
    .eq("status", "active")
    .lt("expected_return_date", today)
    .order("expected_return_date");

  if (error) {
    throw new Error(error.message);
  }

  return (data as RentalWithRelations[]) || [];
}

export async function getRentalsCount(): Promise<{
  total: number;
  active: number;
  overdue: number;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { count: total } = await supabase
    .from("rentals")
    .select("*", { count: "exact", head: true });

  const { count: active } = await supabase
    .from("rentals")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: overdue } = await supabase
    .from("rentals")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .lt("expected_return_date", today);

  return {
    total: total || 0,
    active: active || 0,
    overdue: overdue || 0,
  };
}

export async function getRentalsByDateRange(
  startDate: string,
  endDate: string
): Promise<RentalWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      *,
      book:books(*),
      customer:customers(*)
    `
    )
    .or(
      `and(start_date.lte.${endDate},expected_return_date.gte.${startDate}),and(start_date.lte.${endDate},actual_return_date.gte.${startDate})`
    )
    .order("start_date");

  if (error) {
    throw new Error(error.message);
  }

  return (data as RentalWithRelations[]) || [];
}

export async function checkBookAvailability(
  bookId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase
    .from("rentals")
    .select("id", { count: "exact", head: true })
    .eq("book_id", bookId)
    .eq("status", "active")
    .lte("start_date", endDate)
    .gte("expected_return_date", startDate);

  if (excludeRentalId) {
    query = query.neq("id", excludeRentalId);
  }

  const { count } = await query;

  return count === 0;
}

export interface BlockedDateRange {
  start: Date;
  end: Date;
  customerName?: string;
}

export async function getBookBlockedDates(
  bookId: string
): Promise<BlockedDateRange[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      start_date,
      expected_return_date,
      actual_return_date,
      customer:customers(name)
    `
    )
    .eq("book_id", bookId)
    .eq("status", "active")
    .order("start_date");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((rental) => {
    const customer = rental.customer as unknown as { name: string } | null;
    return {
      start: new Date(rental.start_date),
      end: new Date(rental.actual_return_date || rental.expected_return_date),
      customerName: customer?.name,
    };
  });
}
