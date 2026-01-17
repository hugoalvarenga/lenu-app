import { createClient } from "@/lib/supabase/server";
import type { Book, BookStatus } from "../types";

export async function getBooks(status?: BookStatus): Promise<Book[]> {
  const supabase = await createClient();

  let query = supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getBook(id: string): Promise<Book | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getAvailableBooks(): Promise<Book[]> {
  return getBooks("available");
}

export async function searchBooks(query: string): Promise<Book[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getBooksCount(): Promise<{
  total: number;
  available: number;
  rented: number;
}> {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  const { count: available } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");

  const { count: rented } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("status", "rented");

  return {
    total: total || 0,
    available: available || 0,
    rented: rented || 0,
  };
}
