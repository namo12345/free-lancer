import { z } from "zod";

export const createInvoiceSchema = z.object({
  gigId: z.string().min(1),
  milestones: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    amount: z.number().positive(),
  })).min(1),
  dueDate: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
