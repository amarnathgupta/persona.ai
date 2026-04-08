import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "src/utils";
import jwt from "jsonwebtoken";
import { env } from "src/config/env";

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized1",
      });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET as string);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized2",
      });
    }

    next();
  },
);
