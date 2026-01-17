"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createRentalSchema,
  type CreateRentalInput,
} from "../schemas/rental.schema";
import { checkBookAvailability } from "../services";
import type { ActionResponse } from "@/shared/types/api.types";
import type { Rental } from "../types";

export async function createRentalAction(
  data: CreateRentalInput
): Promise<ActionResponse<Rental>> {
  try {
    const validated = createRentalSchema.parse(data);
    const supabase = await createClient();

    const isAvailable = await checkBookAvailability(
      validated.book_id,
      validated.start_date,
      validated.expected_return_date
    );

    if (!isAvailable) {
      return {
        success: false,
        error: "Este livro já está alugado neste período",
      };
    }

    const { data: rental, error } = await supabase
      .from("rentals")
      .insert({
        ...validated,
        status: "active",
      })
      .select()
      .single();

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
      data: rental,
      message: "Aluguel registrado com sucesso",
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
      error: "Erro ao registrar aluguel",
    };
  }
}
