import { Router } from "express";
import {
  createPersonaController,
  deletePersonaController,
  getAllPersonasController,
  getPersonaByIdController,
  updatePersonaController,
} from "src/controllers";
import { authMiddleware } from "src/middlewares/auth.middleware";
import { creatorOnlyMiddleware } from "src/middlewares/creatorOnly.middleware";

const personaRouter = Router();

personaRouter.use(authMiddleware);
personaRouter.get("/", getAllPersonasController);
personaRouter.get("/:id", getPersonaByIdController);
personaRouter.post("/", createPersonaController);

// creators only
personaRouter.use("/:id", creatorOnlyMiddleware);
personaRouter.patch("/:id", updatePersonaController);
personaRouter.delete("/:id", deletePersonaController);

export default personaRouter;
