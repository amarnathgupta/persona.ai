import { Router } from "express";
import { createChatController, getChatsController } from "src/controllers";
import { authMiddleware } from "src/middlewares/auth.middleware";

const chatRouter = Router();

chatRouter.use(authMiddleware);
chatRouter.post("/", createChatController);
chatRouter.get("/", getChatsController);

export default chatRouter;
