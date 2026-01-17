"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateBookSchema, type UpdateBookInput } from "../schemas/book.schema";
import type { ActionResponse } from "@/shared/types/api.types";
import type { Book } from "../types";

export async function updateBookAction(
  id: string,
  data: UpdateBookInput,
  coverUrl?: string | null
): Promise<ActionResponse<Book>> {
  try {
    const validated = updateBookSchema.parse(data);
    const supabase = await createClient();

    const updateData: Record<string, unknown> = { ...validated };
    if (coverUrl !== undefined) {
      updateData.cover_url = coverUrl;
    }

    const { data: book, error } = await supabase
      .from("books")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/books");
    revalidatePath(`/books/${id}`);

    return {
      success: true,
      data: book,
      message: "Livro atualizado com sucesso",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Dados inválidos",
      };
    }

    return {
      success: false,
      error: "Erro ao atualizar livro",
    };
  }
}
