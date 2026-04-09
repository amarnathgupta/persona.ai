import { Request, Response } from "express";
import { createPersonaSchema, querySchema, updatePersonaSchema } from "@shared";
import Persona from "src/models/persona.model";
import { asyncHandler, sendResponse } from "src/utils";
import mongoose from "mongoose";

export const createPersonaController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createPersonaSchema.safeParse(req.body);
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
    data.createdBy = req.user.id;

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
    const response = querySchema.safeParse(req.query);
    if (!response.success) {
      return sendResponse(
        res,
        400,
        false,
        "invalid request query",
        null,
        response.error.issues,
      );
    }
    const { page, limit, search, tag } = response.data;

    const skip = (page - 1) * limit;

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

    const query = Persona.find(filter).limit(limit).skip(skip);

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
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  },
);

const validateObjectId = (id?: string) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return id;
};

export const getPersonaByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = validateObjectId(req.params.id as string);

    // TODO: check through REDIS cache

    const persona = await Persona.findById(id).lean();
    if (!persona) {
      return sendResponse(res, 404, false, "persona not found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "persona fetched successfully",
      persona,
    );
  },
);

export const updatePersonaController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = validateObjectId(req.params.id as string);
    const body = updatePersonaSchema.safeParse(req.body);
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
    const persona = await Persona.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!persona) {
      return sendResponse(res, 404, false, "persona not found", null);
    }

    // TODO: invalidate REDIS cache

    return sendResponse(
      res,
      200,
      true,
      "persona updated successfully",
      persona,
    );
  },
);

export const deletePersonaController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = validateObjectId(req.params.id as string);
    const persona = await Persona.findByIdAndDelete(id);
    if (!persona) {
      return sendResponse(res, 404, false, "persona not found", null);
    }

    // TODO: invalidate REDIS cache

    return sendResponse(
      res,
      200,
      true,
      "persona deleted successfully",
      persona,
    );
  },
);
