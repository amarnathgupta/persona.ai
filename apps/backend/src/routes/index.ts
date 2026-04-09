import { Router } from "express";
import personaRouter from "./persona.route";
import authRouter from "./auth.route";
import chatRouter from "./chat.route";

const router = Router();

router.use("/personas", personaRouter);
router.use("/auth", authRouter);
router.use("/chats", chatRouter);

export default router;
