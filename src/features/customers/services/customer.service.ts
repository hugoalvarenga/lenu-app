import { createClient } from "@/lib/supabase/server";
import type { Customer } from "../types";

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getCustomersCount(): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  return count || 0;
}

export const getCustomerById = getCustomer;
