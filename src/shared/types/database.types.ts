export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookStatus = "available" | "rented" | "unavailable";
export type RentalStatus = "active" | "returned" | "overdue" | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          author: string | null;
          isbn: string | null;
          description: string | null;
          cover_url: string | null;
          status: BookStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          status?: BookStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          status?: BookStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rentals: {
        Row: {
          id: string;
          book_id: string;
          customer_id: string;
          start_date: string;
          expected_return_date: string;
          actual_return_date: string | null;
          status: RentalStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          customer_id: string;
          start_date: string;
          expected_return_date: string;
          actual_return_date?: string | null;
          status?: RentalStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          customer_id?: string;
          start_date?: string;
          expected_return_date?: string;
          actual_return_date?: string | null;
          status?: RentalStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      book_status: BookStatus;
      rental_status: RentalStatus;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Rental = Database["public"]["Tables"]["rentals"]["Row"];

export type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
export type BookUpdate = Database["public"]["Tables"]["books"]["Update"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];
export type RentalInsert = Database["public"]["Tables"]["rentals"]["Insert"];
export type RentalUpdate = Database["public"]["Tables"]["rentals"]["Update"];

export type RentalWithRelations = Rental & {
  book: Book;
  customer: Customer;
};
