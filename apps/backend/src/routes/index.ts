import { Router } from "express";
import personaRouter from "./persona.route";

const router = Router();

router.use("/personas", personaRouter);

export default router;
