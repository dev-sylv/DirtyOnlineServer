import { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import bcrypt from "bcrypt";
import DirectorModels from "../Models/ManagerModels";
import StationModels from "../Models/StationModels";

// Create a director:
export const DirectorRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!name || !email) {
      next(
        new MainAppError({
          message: "Please provide neccessary credentials",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
    const Director = await DirectorModels.create({
      name,
      email,
      phoneNumber,
      password,
      role,
      station: [],
      users: [],
      isVerified: true,
    });

    if (!Director) {
      next(
        new MainAppError({
          message: "Unable to register director",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }

    return res.status(201).json({
      message: "Director Successfully registered",
      data: Director,
    });
  }
);
// Director Login:
export const DirectorLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    if (!name || !email)
      next(
        new MainAppError({
          httpcode: HTTPCODES.BAD_REQUEST,
          message: "Please input your login credentials",
        })
      );
    const Director = await DirectorModels.findOne({
      email,
    });
    if (!Director)
      next(
        new MainAppError({
          httpcode: HTTPCODES.NOT_FOUND,
          message: "Login failed",
        })
      );
    return res.status(HTTPCODES.CREATED).json({
      message: "Login Successfull",
      data: Director,
    });
  }
);
// Director Creates stations:
export const DirectorCreatesStation = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { stationName, email, phoneNumber, address, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!stationName || !email) {
      next(
        new MainAppError({
          message: "Please provide neccessary credentials",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
    const Station = await StationModels.create({
      stationName,
      email,
      phoneNumber,
      address,
      password: hashedPassword,
      users: [],
      requests: [],
      transactionHistory: [],
      feedbacks: [],
    });
    await DirectorModels.updateOne(req.params.directorID, {
      $push: { stations: Station },
    });
    if (!Station) {
      next(
        new MainAppError({
          message: "Unable to register director",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
    return res.status(201).json({
      message: "Station Successfully created",
      data: Station,
    });
  }
);
//To Get Director
export const GetDirector = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Director = await DirectorModels.find();
    if (!Director)
      next(
        new MainAppError({
          httpcode: HTTPCODES.NOT_FOUND,
          message: "Get failed",
        })
      );
    return res.status(HTTPCODES.CREATED).json({
      message: "Successfull",
      data: Director,
    });
  }
);
