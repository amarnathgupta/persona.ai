import { asyncHandler, sendResponse } from "src/utils";
import { Request, Response } from "express";
import { prisma } from "src/lib/prisma";
import { createUserSchema } from "@shared";
import bcrypt from "bcrypt";
import { env } from "src/config/env";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createUserSchema.safeParse(req.body);
    if (!body.success) {
      return sendResponse(
        res,
        400,
        false,
        "invalid request body",
        null,
        body.error.issues,
      );
    }
    const { email, username, password } = body.data;
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    if (userExists) {
      return sendResponse(
        res,
        400,
        false,
        "user already exists with email or username",
        null,
      );
    }
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: passwordHash,
      },
    });

    return sendResponse(res, 201, true, "user created successfully");
  },
);
