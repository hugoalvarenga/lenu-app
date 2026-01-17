"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/shared/types/api.types";

export async function uploadCoverAction(
  formData: FormData
): Promise<ActionResponse<string>> {
  try {
    const supabase = await createClient();
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "Nenhum arquivo enviado",
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("book-covers")
      .upload(fileName, file);

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("book-covers").getPublicUrl(fileName);

    return {
      success: true,
      data: publicUrl,
    };
  } catch {
    return {
      success: false,
      error: "Erro ao fazer upload da imagem",
    };
  }
}
