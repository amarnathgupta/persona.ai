import z from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createChatSchema = z.object({
  personaId: objectIdSchema,
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val > 0, "Page must be greater than 0"),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val > 0 && val <= 20, "Limit must be 1-20"),
});

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  chatId: z.string(),
});
