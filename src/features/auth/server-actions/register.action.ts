"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import type { ActionResponse } from "@/shared/types/api.types";

export async function registerAction(
  data: RegisterInput
): Promise<ActionResponse<null>> {
  try {
    const validated = registerSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return {
          success: false,
          error: "Este email já está cadastrado",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Dados inválidos",
      };
    }

    return {
      success: false,
      error: "Erro ao criar conta",
    };
  }

  redirect("/books");
}
