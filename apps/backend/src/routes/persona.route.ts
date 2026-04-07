import { Router } from "express";
import { createPersonaController } from "src/controllers";

const personaRouter = Router();

personaRouter.post("/", createPersonaController);

export default personaRouter;
