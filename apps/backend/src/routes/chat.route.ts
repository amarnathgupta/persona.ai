import { Router } from "express";
import {
  createChatController,
  getChatMessagesController,
  getChatsController,
} from "src/controllers";
import { authMiddleware } from "src/middlewares/auth.middleware";

const chatRouter = Router();

chatRouter.use(authMiddleware);
chatRouter.post("/", createChatController);
chatRouter.get("/", getChatsController);
chatRouter.get("/:chatId/messages", getChatMessagesController);

export default chatRouter;
