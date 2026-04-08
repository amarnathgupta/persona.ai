import { NextFunction, Request, Response } from "express";
import Persona from "src/models/persona.model";
import { asyncHandler } from "src/utils";

export const creatorOnlyMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const personaId = req.params.id;

    const persona = await Persona.findById(personaId, { createdBy: 1 }).lean();
    if (!persona || !persona.createdBy) {
      return res.status(404).json({
        success: false,
        message: "Persona not found",
      });
    }

    if (persona.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    next();
  },
);
