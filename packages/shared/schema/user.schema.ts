import z from "zod";

export const userSchema = z.object({
  email: z.email(),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createUserSchema = userSchema;
export const loginUserSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});
