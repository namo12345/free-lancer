import { z } from "zod";

const gigFieldsSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  budgetMin: z.number().positive().min(500),
  budgetMax: z.number().positive(),
  budgetType: z.enum(["fixed", "hourly"]),
  status: z.enum(["DRAFT", "OPEN"]).default("OPEN"),
  deadline: z
    .union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
    .optional(),
  duration: z.string().optional(),
  experienceLevel: z.enum(["Entry", "Intermediate", "Expert"]).optional(),
  isRemote: z.boolean().default(true),
  city: z.string().optional(),
  state: z.string().optional(),
  skillIds: z.array(z.string()).min(1).max(10),
});

export const createGigSchema = gigFieldsSchema.refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"],
});

export const updateGigSchema = gigFieldsSchema.partial();

export type CreateGigInput = z.infer<typeof createGigSchema>;
export type UpdateGigInput = z.infer<typeof updateGigSchema>;
