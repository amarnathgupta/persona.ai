import { Router } from "express";
import {
  createPersonaController,
  getAllPersonasController,
} from "src/controllers";

const personaRouter = Router();

personaRouter.post("/", createPersonaController);
personaRouter.get("/", getAllPersonasController);

export default personaRouter;
