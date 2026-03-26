import { z } from "zod";

export const updateFreelancerProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  hourlyRate: z.number().positive().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isRemote: z.boolean().default(true),
  githubUrl: z.string().url().optional().or(z.literal("")),
  behanceUrl: z.string().url().optional().or(z.literal("")),
  dribbbleUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  skillIds: z.array(z.string()).max(15).optional(),
  upiId: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfsc: z.string().optional(),
  bankName: z.string().optional(),
});

export const updateEmployerProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  companyName: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type UpdateFreelancerProfileInput = z.infer<typeof updateFreelancerProfileSchema>;
export type UpdateEmployerProfileInput = z.infer<typeof updateEmployerProfileSchema>;
