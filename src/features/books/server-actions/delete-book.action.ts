"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/shared/types/api.types";

export async function deleteBookAction(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const { error: rentalsError, count } = await supabase
      .from("rentals")
      .select("*", { count: "exact", head: true })
      .eq("book_id", id)
      .eq("status", "active");

    if (count && count > 0) {
      return {
        success: false,
        error: "Não é possível excluir um livro com aluguel ativo",
      };
    }

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/books");

    return {
      success: true,
      message: "Livro excluído com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao excluir livro",
    };
  }
}
