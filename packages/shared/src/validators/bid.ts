import { z } from "zod";

export const createBidSchema = z.object({
  gigId: z.string().min(1),
  amount: z.number().positive().min(500),
  deliveryDays: z.number().int().positive().min(1).max(365),
  coverLetter: z.string().min(50).max(2000),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;
