import { Request, Response } from "express";
import { prisma } from "src/lib/prisma";
import Persona from "src/models/persona.model";
import { asyncHandler, sendResponse } from "src/utils";
import {
  createChatSchema,
  createMessageSchema,
  deleteMessageSchema,
  paginationSchema,
} from "@shared";
import { Role } from "../../generated/prisma/enums";
import { buildSystemPrompt, generateReply } from "src/services/ai.service";

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

export const deleteChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.chatId as string;
    if (!id) {
      return sendResponse(res, 400, false, "Invalid chat id", null);
    }
    const userId = req.user.id;
    try {
      await prisma.chat.delete({
        where: {
          id,
          userId,
        },
      });
      return sendResponse(res, 200, true, "Chat deleted successfully", null);
    } catch (error: any) {
      if (error.code === "P2025") {
        return sendResponse(res, 404, false, "Chat not found", null);
      } else {
        throw error;
      }
    }
  },
);

export const deleteMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const params = deleteMessageSchema.safeParse(req.params);
    if (!params.success) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid chat id or message id",
        null,
      );
    }
    const { chatId, messageId } = params.data;
    const userId = req.user.id;
    const chatExists = await prisma.chat.findFirst({
      where: {
        id: chatId as string,
        userId,
      },
    });
    if (!chatExists) {
      return sendResponse(res, 404, false, "Message not found", null);
    }
    try {
      await prisma.message.delete({
        where: {
          id: messageId,
          chatId,
        },
      });
      return sendResponse(res, 200, true, "Message deleted successfully", null);
    } catch (error: any) {
      if (error.code === "P2025") {
        return sendResponse(res, 404, false, "Message not found", null);
      } else {
        throw error;
      }
    }
  },
);

export const createChatMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.chatId as string;
    const userId = req.user.id;
    const body = createMessageSchema.safeParse(req.body);
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
    const { content } = body.data;

    const chatExists = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });
    if (!chatExists) {
      return sendResponse(res, 404, false, "Chat not found", null);
    }

    const personaId = chatExists.personaId;
    const persona = await Persona.findById(personaId);
    if (!persona) {
      return sendResponse(res, 404, false, "Persona not found", null);
    }

    const systemPrompt = buildSystemPrompt(persona);
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      skip: 0,
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });
    const orderedMessages = messages.reverse().map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const response = await generateReply(systemPrompt, orderedMessages);

    await prisma.message.createMany({
      data: [
        {
          chatId,
          role: Role.user,
          content,
        },
        {
          chatId,
          role: Role.assistant,
          content: response,
        },
      ],
    });

    return sendResponse(
      res,
      201,
      true,
      "Message created successfully",
      response,
    );
  },
);
