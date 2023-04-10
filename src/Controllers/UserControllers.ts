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

// Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email)
        next(
          new MainAppError({
            httpcode: HTTPCODES.BAD_REQUEST,
            message: "Please input your email",
          })
        );
      const user = await UserModels.findOne({
        email,
        password,
      });
      if (!user)
        next(
          new MainAppError({
            httpcode: HTTPCODES.NOT_FOUND,
            message: "Login failed",
          })
        );
      return res.status(HTTPCODES.CREATED).json({
        message: "Login Successfull",
        data: user,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "Request failed",
        data: error,
      });
    }
  }
);

// Get all Agents:
export const GetAllAgent = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const agents = await AgentModels.find();

    if (!agents) {
      next(
        new MainAppError({
          message: "Agents not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got all agents",
      data: agents,
    });
  }
);
