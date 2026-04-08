import express from "express";
import cors from "cors";
import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// routes
app.use("/api", router);

// error handler - GLOBAL CATCHER
app.use(errorMiddleware);

export default app;
