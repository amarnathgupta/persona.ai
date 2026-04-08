import { Request, Response } from "express";
import { personaSchema } from "@shared";
import Persona from "src/models/persona.model";
import { asyncHandler, sendResponse } from "src/utils";

export const createPersonaController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = personaSchema.safeParse(req.body);
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
    const data = body.data;
    const persona = await Persona.create(data);
    return sendResponse(
      res,
      200,
      true,
      "persona created successfully",
      persona,
    );
  },
);
