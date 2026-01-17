"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/shared/types/api.types";

export async function deleteCustomerAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const { count } = await supabase
      .from("rentals")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", id)
      .eq("status", "active");

    if (count && count > 0) {
      return {
        success: false,
        error: "Não é possível excluir um cliente com aluguel ativo",
      };
    }

    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/customers");

    return {
      success: true,
      message: "Cliente excluído com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao excluir cliente",
    };
  }
}
