import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import UserModels from "../Models/UserModels";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";
import StationModels from "../Models/StationModels";

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, address, phoneNumber, password, stationName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findUser = await UserModels.findOne({ phoneNumber });

    if (findUser) {
      next(
        new MainAppError({
          message: "User with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const FindStation = await StationModels.findOne({ stationName });

    if (FindStation) {
      const users = await UserModels.create({
        name,
        role: "User",
        address,
        phoneNumber,
        password: hashedPassword,
        station: FindStation,
        numberOfRequests: 4,
      });

      await StationModels.updateOne(
        { id: FindStation._id },
        { $push: { users: users } }
      );
      return res.status(201).json({
        message: "Successfully created User",
        data: users,
      });
    } else {
      next(
        new MainAppError({
          message: "Could not register user",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

// Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber)
      next(
        new MainAppError({
          httpcode: HTTPCODES.BAD_REQUEST,
          message: "Please input your phone number",
        })
      );
    const user = await UserModels.findOne({
      phoneNumber,
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
  }
);

// Get all Users:
export const GetAllUsers = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserModels.find();

    if (!users) {
      next(
        new MainAppError({
          message: "Users not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got all users",
      data: users,
    });
  }
);

// Get a single User:
export const GetSingleUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleuser = await UserModels.findById(req.params.userID);

    if (!singleuser) {
      next(
        new MainAppError({
          message: "This user could not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single user",
      data: singleuser,
    });
  }
);
