import dotenv from "dotenv";

dotenv.config();

export const EnvironmentVariables = {
  PORT: process.env.PORT as string,
  MONGODB_STRING: process.env.LIVE_URL as string,
};
