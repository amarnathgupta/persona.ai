import { Router } from "express";
import {
  getMeController,
  loginController,
  registerController,
} from "src/controllers";
import { authMiddleware } from "src/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", registerController);
authRouter.post("/login", loginController);

// protected routes
authRouter.use(authMiddleware);
authRouter.get("/me", getMeController);

export default authRouter;
