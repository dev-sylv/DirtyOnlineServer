import express, { Application, Request, Response } from "express";
import { DBCONNECTION } from "./Config/Database";

import { EnvironmentVariables } from "./Config/EnvironmentVariables";
import { AppConfig } from "./app";

const port = EnvironmentVariables.PORT;

const app: Application = express();
AppConfig(app);
DBCONNECTION();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API READY FOR GIFT CARD IDEA CONSUMPTION",
  });
});

const server = app.listen(port, () => {
  console.log("");
  console.log("Server is up and running on port", port);
});

// To protect my server from crashing when users do what they are not supposed to do
process.on("uncaughtException", (error: Error) => {
  // console.log("Stop here: uncaughtexpression")
  // console.log(error)
  process.exit(1);
});

process.on("unhandledRejection", (res) => {
  server.close(() => {
    process.exit(1);
  });
});
