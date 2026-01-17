import { z } from "zod";

export const createRentalSchema = z.object({
  book_id: z.string().uuid("Selecione um livro"),
  customer_id: z.string().uuid("Selecione um cliente"),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  expected_return_date: z.string().min(1, "Data de devolução é obrigatória"),
  notes: z.string().optional(),
});

export const updateRentalSchema = createRentalSchema.partial();

export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type UpdateRentalInput = z.infer<typeof updateRentalSchema>;
