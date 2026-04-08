import { Router } from "express";
import personaRouter from "./persona.route";
import authRouter from "./auth.route";

const router = Router();

router.use("/personas", personaRouter);
router.use("/auth", authRouter);

export default router;
