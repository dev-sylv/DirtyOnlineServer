import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import UserModels from "../Models/UserModels";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, username, LGA, address, phone, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findEmail = await UserModels.findOne({ username });

    if (findEmail) {
      next(
        new MainAppError({
          message: "Agent with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const users = await UserModels.create({
      username,
      name,
      email,
      role: "User",
      LGA,
      address,
      phone,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    return res.status(201).json({
      message: "Successfully created Users",
      data: users,
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
