"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/shared/types/api.types";

export async function cancelRentalAction(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("rentals")
      .update({
        status: "cancelled",
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
      message: "Aluguel cancelado com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao cancelar aluguel",
    };
  }
}
