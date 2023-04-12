import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";

import morgan from "morgan";

import { MainAppError, HTTPCODES } from "./Utils/MainAppError";

import { ErrorHandler } from "./Middlewares/ErrorHandler/ErrorHandler";
import AgentRouter from "./Routes/AgentsRoutes";
import UserRouter from "./Routes/UserRoutes";
import MalamRouter from "./Routes/MalamRoutes";
import DirectorRouter from "./Routes/DirectorRoutes";

export const AppConfig = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  // Configuring the routes:
  app.use("/api/director", DirectorRouter);
  app.use("/api/agents", AgentRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/malams", MalamRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new MainAppError({
        message: `This router ${req.originalUrl} does not exist`,
        httpcode: HTTPCODES.NOT_FOUND,
        name: "Route Error",
        isOperational: false,
      })
    );
  });
  app.use(ErrorHandler);
};
