import dotenv from "dotenv";

dotenv.config();

export const EnvironmentVariables = {
  PORT: process.env.PORT as string,
  MONGODB_STRING: process.env.LIVE_URL as string,
  GOOGLE_ID: process.env.GOOGLE_ID as string,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET as string,
  GOOGLE_REFRESHTOKEN: process.env.GOOGLE_REFRESHTOKEN as string,
};
