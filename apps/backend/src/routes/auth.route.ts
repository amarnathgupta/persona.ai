import { Router } from "express";
import { loginController, registerController } from "src/controllers";

const authRouter = Router();

authRouter.post("/signup", registerController);
authRouter.post("/login", loginController);

export default authRouter;
