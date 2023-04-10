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
