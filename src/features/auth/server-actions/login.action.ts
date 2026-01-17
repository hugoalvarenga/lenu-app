"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import type { ActionResponse } from "@/shared/types/api.types";

export async function loginAction(
  data: LoginInput
): Promise<ActionResponse<null>> {
  try {
    const validated = loginSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message === "Invalid login credentials"
          ? "Email ou senha inválidos"
          : error.message,
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
      error: "Erro ao fazer login",
    };
  }

  redirect("/books");
}
