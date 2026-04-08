import { asyncHandler, sendResponse } from "src/utils";
import { Request, Response } from "express";
import { prisma } from "src/lib/prisma";
import { createUserSchema, loginUserSchema } from "@shared";
import bcrypt from "bcrypt";
import { env } from "src/config/env";
import jwt from "jsonwebtoken";

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

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginUserSchema.safeParse(req.body);
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
    const { identifier, password } = body.data;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      },
    });
    if (!user) {
      return sendResponse(res, 404, false, "user not found", null);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return sendResponse(res, 401, false, "invalid password", null);
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return sendResponse(res, 200, true, "user logged in successfully", {
      token,
    });
  },
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return sendResponse(res, 404, false, "user not found", null);
    }
    return sendResponse(res, 200, true, "user fetched successfully", user);
  },
);
