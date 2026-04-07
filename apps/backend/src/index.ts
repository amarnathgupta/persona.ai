import "dotenv/config";
import app from "./app";
import { connectDB } from "./db/connect";
import { env } from "./config/env";

const PORT = env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
