import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
