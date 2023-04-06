import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";

import morgan from "morgan";

import UserRouter from "./Routes/UserRoutes";

import BusinessRouter from "./Routes/BusinessRoutes";

import GiftCardRoutes from "./Routes/GiftCardRoutes";

import { AppError, HTTPCODES } from "./Utils/AppError";

import { ErrorHandler } from "./Middlewares/ErrorHandler/ErrorHandler";

export const AppConfig = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // Configuring the routes:
  app.use("/api", UserRouter);
  app.use("/api", BusinessRouter);
  app.use("/api", GiftCardRoutes);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: `This router ${req.originalUrl} does not exist`,
        httpcode: HTTPCODES.NOT_FOUND,
        name: "Route Error",
        isOperational: false,
      })
    );
  });
  app.use(ErrorHandler);
};
