import "dotenv/config";

const isMigration = process.env.USE_DIRECT === "true";

export const env = {
  DATABASE_URL: isMigration ? process.env.DIRECT_URL : process.env.DATABASE_URL,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || "11"),
};
