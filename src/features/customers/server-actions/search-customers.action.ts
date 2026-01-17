"use server";

import { searchCustomers, getCustomers } from "../services/customer.service";
import type { Customer } from "../types";
import type { ActionResponse } from "@/shared/types/api.types";

export async function searchCustomersAction(
  query: string
): Promise<ActionResponse<Customer[]>> {
  try {
    const customers = query.trim()
      ? await searchCustomers(query)
      : await getCustomers();

    return {
      success: true,
      data: customers,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar clientes",
    };
  }
}
