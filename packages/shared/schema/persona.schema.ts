import { z } from "zod";

export const personaSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters long"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long"),

  systemPrompt: z
    .string()
    .trim()
    .min(10, "System prompt must be at least 10 characters long"),

  tone: z
    .enum([
      "formal",
      "casual",
      "flirty",
      "mysterious",
      "aggressive",
      "nurturing",
    ])
    .default("casual"),

  personality: z
    .object({
      traits: z.array(z.string()).optional(),
      quirks: z.array(z.string()).optional(),
      backstory: z.string().optional(),
      exampleDialogue: z
        .array(
          z.object({
            user: z.string(),
            persona: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),

  avatar: z.string().optional(),
  bannerImage: z.string().optional(),

  createdBy: z.string().optional(),

  isPublic: z.boolean().default(true),

  tags: z.array(z.string()).optional(),

  totalChats: z.number().default(0),
});

export const createPersonaSchema = personaSchema;

export const updatePersonaSchema = personaSchema.partial().omit({
  createdBy: true,
  totalChats: true,
});

export const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1"))
    .refine((val) => val > 0, "Page must be greater than 0"),
  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || "10"), 20))
    .refine((val) => val > 0 && val <= 20, "Limit must be 1-20"),
  search: z.string().optional(),
  tag: z.string().optional(),
});
