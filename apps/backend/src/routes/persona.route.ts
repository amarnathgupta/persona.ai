import { Router } from "express";
import {
  createPersonaController,
  getAllPersonasController,
  getPersonaByIdController,
} from "src/controllers";

const personaRouter = Router();

personaRouter.post("/", createPersonaController);
personaRouter.get("/", getAllPersonasController);
personaRouter.get("/:id", getPersonaByIdController);

export default personaRouter;
