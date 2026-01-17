"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createBookSchema, type CreateBookInput } from "../schemas/book.schema";
import type { ActionResponse } from "@/shared/types/api.types";
import type { Book } from "../types";

export async function createBookAction(
  data: CreateBookInput,
  coverUrl?: string | null
): Promise<ActionResponse<Book>> {
  try {
    const validated = createBookSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    const { data: book, error } = await supabase
      .from("books")
      .insert({
        ...validated,
        user_id: user.id,
        cover_url: coverUrl || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/books");

    return {
      success: true,
      data: book,
      message: "Livro cadastrado com sucesso",
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
      error: "Erro ao cadastrar livro",
    };
  }
}
