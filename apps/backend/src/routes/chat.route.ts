import { Router } from "express";
import {
  createChatController,
  createChatMessageController,
  deleteChatController,
  deleteMessageController,
  getChatMessagesController,
  getChatsController,
} from "src/controllers";
import { authMiddleware } from "src/middlewares/auth.middleware";

const chatRouter = Router();

chatRouter.use(authMiddleware);
chatRouter.post("/", createChatController);
chatRouter.get("/", getChatsController);
chatRouter.get("/:chatId/messages", getChatMessagesController);
chatRouter.post("/:chatId/messages", createChatMessageController);
chatRouter.delete("/:chatId", deleteChatController);
chatRouter.delete("/:chatId/messages/:messageId", deleteMessageController);

export default chatRouter;
