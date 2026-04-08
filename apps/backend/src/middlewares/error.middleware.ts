import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(`Error in ${req.method} ${req.originalUrl}`);
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message + "1234567890" || "Internal Server Error",
  });
};
