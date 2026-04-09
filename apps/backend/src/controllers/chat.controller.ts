import { Request, Response } from "express";
import { prisma } from "src/lib/prisma";
import Persona from "src/models/persona.model";
import { asyncHandler, sendResponse } from "src/utils";
import { createChatSchema, paginationSchema } from "@shared";

export const createChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const query = createChatSchema.safeParse(req.body);
    if (!query.success) {
      return sendResponse(
        res,
        400,
        false,
        "invalid request body",
        null,
        query.error.issues,
      );
    }
    const personaId = query.data.personaId;

    const persona = await Persona.findById(personaId);
    if (!persona) {
      return sendResponse(res, 404, false, "Persona not found", null);
    }

    try {
      const chat = await prisma.chat.create({
        data: {
          personaId,
          userId,
          title: persona.name,
        },
      });

      return sendResponse(res, 201, true, "Chat created successfully", chat);
    } catch (error: any) {
      if (error.code === "P2002") {
        const chatExists = await prisma.chat.findFirst({
          where: {
            personaId,
            userId,
          },
        });
        return sendResponse(res, 400, false, "Chat already exists", chatExists);
      }

      throw error;
    }
  },
);

export const getChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const query = paginationSchema.safeParse(req.query);
    if (!query.success) {
      return sendResponse(
        res,
        400,
        false,
        "invalid request query",
        null,
        query.error.issues,
      );
    }
    const { page, limit } = query.data;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.chat.count({
        where: {
          userId,
        },
      }),
    ]);
    return sendResponse(res, 200, true, "Chats fetched successfully", {
      chats,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  },
);

export const getChatMessagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.chatId as string;
    if (!id) {
      return sendResponse(res, 400, false, "Invalid chat id", null);
    }
    const userId = req.user.id;
    const chatExists = await prisma.chat.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!chatExists) {
      return sendResponse(res, 404, false, "Chat not found", null);
    }
    const query = paginationSchema.safeParse(req.query);
    if (!query.success) {
      return sendResponse(
        res,
        400,
        false,
        "invalid request query",
        null,
        query.error.issues,
      );
    }
    const { page, limit } = query.data;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          chatId: id,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.message.count({
        where: {
          chatId: id,
        },
      }),
    ]);
    return sendResponse(res, 200, true, "Messages fetched successfully", {
      messages,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  },
);
