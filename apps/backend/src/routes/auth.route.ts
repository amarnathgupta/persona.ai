import { Router } from "express";
import { registerController } from "src/controllers";

const authRouter = Router();

authRouter.post("/signup", registerController);

export default authRouter;
