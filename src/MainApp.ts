import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";

import morgan from "morgan";

import { MainAppError, HTTPCODES } from "./Utils/MainAppError";

import { ErrorHandler } from "./Middlewares/ErrorHandler/ErrorHandler";

import UserRouter from "./Routes/UserRoutes";
import DirectorRouter from "./Routes/DirectorRoutes";
import StationRouter from "./Routes/StationRoutes";
import RequestRouter from "./Routes/RequestRoutes";

export const AppConfig = (app: Application) => {
  app.set("view engine", "ejs");
  app.use(express.json());
  app.use(express.static("pulic"));
  app.use(express.static(`${__dirname} public/css`));
  app.use(express.static(`${__dirname} public/asset`));
  app.use(cors());
  app.use(morgan("dev"));

  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
      message: "API READY FOR ecoBIN Project",
    });
  });

  app.get("/views/verify", (req: Request, res: Response) => {
    res.render("AccountVerification");
  });

  // Configuring the routes:
  app.use("/api/director", DirectorRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/stations", StationRouter);
  app.use("/api/requests", RequestRouter);

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
