import { Router } from "express";
import {
  createPersonaController,
  getAllPersonasController,
  getPersonaByIdController,
  updatePersonaController,
} from "src/controllers";

const personaRouter = Router();

personaRouter.get("/", getAllPersonasController);
personaRouter.get("/:id", getPersonaByIdController);

// creators only
personaRouter.post("/", createPersonaController);
personaRouter.patch("/:id", updatePersonaController);

export default personaRouter;
