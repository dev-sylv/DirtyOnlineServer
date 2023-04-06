import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import AgentModels from "../Models/AgentModels";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";

// Agents Registration:
export const AgentsRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, LGA, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findEmail = await AgentModels.findOne({ email });

    if (findEmail) {
      next(
        new MainAppError({
          message: "Agent with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const Agents = await AgentModels.create({
      name,
      email,
      LGA,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    return res.status(201).json({
      message: "Successfully created Agent",
      data: Agents,
    });
  }
);

// Agents Login:
export const AgentsLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const CheckEmail = await AgentModels.findOne({ email });

    if (!CheckEmail) {
      next(
        new MainAppError({
          message: "User not Found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    const CheckPassword = await bcrypt.compare(password, CheckEmail!.password);

    if (!CheckPassword) {
      next(
        new MainAppError({
          message: "Email or password not correct",
          httpcode: HTTPCODES.CONFLICT,
        })
      );
    }

    if (CheckEmail && CheckPassword) {
      return res.status(200).json({
        message: "Login Successfull",
        data: CheckEmail,
      });
    }
  }
);

// Get a single Agent:
export const GetSingleAgent = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleagent = await AgentModels.findById(req.params.userID);

    if (!singleagent) {
      next(
        new MainAppError({
          message: "Agents not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single agent",
      data: singleagent,
    });
  }
);
