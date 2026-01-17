"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  updateCustomerSchema,
  type UpdateCustomerInput,
} from "../schemas/customer.schema";
import type { ActionResponse } from "@/shared/types/api.types";
import type { Customer } from "../types";

export async function updateCustomerAction(
  id: string,
  data: UpdateCustomerInput
): Promise<ActionResponse<Customer>> {
  try {
    const validated = updateCustomerSchema.parse(data);
    const supabase = await createClient();

    const { data: customer, error } = await supabase
      .from("customers")
      .update({
        ...validated,
        email: validated.email || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/customers");

    return {
      success: true,
      data: customer,
      message: "Cliente atualizado com sucesso",
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
      error: "Erro ao atualizar cliente",
    };
  }
}
