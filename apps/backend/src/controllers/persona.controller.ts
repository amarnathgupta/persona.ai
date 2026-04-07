import { Request, Response } from "express";
import { personaSchema } from "@shared";
import Persona from "src/models/persona.model";

export const createPersonaController = async (req: Request, res: Response) => {
  const body = personaSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      success: false,
      message: "invalid request body",
      error: body.error.issues,
    });
  }
  const data = body.data;
  try {
    const persona = await Persona.create(data);
    if (!persona) {
      res.status(500).json({
        success: false,
        message: "error while creating persona",
      });
    }
    res.status(200).json({
      success: true,
      message: "persona created successfully",
      data: persona,
    });
  } catch (error: any) {
    console.log("error while creating persona", error);
    res.status(500).json({
      success: false,
      message: "error while creating persona",
      error: error.message,
    });
  }
};
