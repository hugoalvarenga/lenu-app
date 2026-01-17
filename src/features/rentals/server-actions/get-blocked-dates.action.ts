"use server";

import { getBookBlockedDates, type BlockedDateRange } from "../services/rental.service";
import type { ActionResponse } from "@/shared/types/api.types";

export async function getBlockedDatesAction(
  bookId: string
): Promise<ActionResponse<BlockedDateRange[]>> {
  try {
    const blockedDates = await getBookBlockedDates(bookId);

    return {
      success: true,
      data: blockedDates,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar datas bloqueadas",
    };
  }
}
