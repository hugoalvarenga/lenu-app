"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/shared/types/api.types";

export async function returnBookAction(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("rentals")
      .update({
        status: "returned",
        actual_return_date: today,
      })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/rentals");
    revalidatePath("/books");
    revalidatePath("/calendar");

    return {
      success: true,
      message: "Devolução registrada com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao registrar devolução",
    };
  }
}
