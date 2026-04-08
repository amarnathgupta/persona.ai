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
    data.personality = data.personality || {};
    data.tags = data.tags || [];
    const persona = await Persona.create(data);
    return sendResponse(
      res,
      201,
      true,
      "persona created successfully",
      persona,
    );
  },
);

export const getAllPersonasController = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, tag } = req.query;
    const pageInt = parseInt(page as string) || 1;
    const limitInt = Math.min(parseInt(limit as string) || 10, 20);

    const skip = (pageInt - 1) * limitInt;

    const filter: any = {};

    // text search
    if (search) {
      filter.$text = { $search: search as string };
    }

    // tags filter
    if (tag) {
      const tagArray = (tag as string).split(",");
      filter.tags = { $in: tagArray };
    }

    const query = Persona.find(filter).limit(limitInt).skip(skip);

    if (search) {
      query
        .sort({ score: { $meta: "textScore" } })
        .select({ score: { $meta: "textScore" } });
    } else {
      query.sort({ createdAt: -1 });
    }

    const [personas, total] = await Promise.all([
      query,
      Persona.countDocuments(filter),
    ]);

    return sendResponse(res, 200, true, "personas fetched successfully", {
      personas,
      total,
      page: pageInt,
      limit: limitInt,
      pages: Math.ceil(total / limitInt),
    });
  },
);
