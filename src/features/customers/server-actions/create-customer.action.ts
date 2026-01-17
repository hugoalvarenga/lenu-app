"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "../schemas/customer.schema";
import type { ActionResponse } from "@/shared/types/api.types";
import type { Customer } from "../types";

export async function createCustomerAction(
  data: CreateCustomerInput
): Promise<ActionResponse<Customer>> {
  try {
    const validated = createCustomerSchema.parse(data);
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

    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        ...validated,
        email: validated.email || null,
        user_id: user.id,
      })
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
      message: "Cliente cadastrado com sucesso",
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
      error: "Erro ao cadastrar cliente",
    };
  }
}
