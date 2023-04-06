import express, { Application, Request, Response } from "express";
import { DBCONNECTION } from "./Config/Database";

import { EnvironmentVariables } from "./Config/EnvironmentVariables";
import { AppConfig } from "./MainApp";

const port = EnvironmentVariables.PORT;

const app: Application = express();
AppConfig(app);
DBCONNECTION();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API READY FOR DIRTY ONLINE PROJECT",
  });
});

const server = app.listen(port, () => {
  console.log("");
  console.log("Server is up and running on port", port);
});

// To protect my server from crashing when users do what they are not supposed to do
process.on("uncaughtException", (error: Error) => {
  process.exit(1);
});

process.on("unhandledRejection", (res) => {
  server.close(() => {
    process.exit(1);
  });
});
