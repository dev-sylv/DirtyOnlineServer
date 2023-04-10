import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";
import MalamModels from "../Models/MalamModels";
import AgentModels from "../Models/AgentModels";
import otpgenerator from "otp-generator";

// Malam Registration:
export const MalamRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, phoneNumber, password, LGA } = req.body;

    const AgentCaretaker = await AgentModels.findById(req.params.agentID);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const MalamInitials = name.slice(0, 3);

    const findEmail = await MalamModels.findOne({ name });

    if (findEmail) {
      next(
        new MainAppError({
          message: "Malam with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    if (AgentCaretaker?.role === "Agent") {
      const Malam = await MalamModels.create({
        name,
        LGA,
        phoneNumber,
        uniqueID:
          MalamInitials +
          otpgenerator.generate(10, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
          }),
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      return res.status(201).json({
        message: "Successfully created Malam account",
        data: Malam,
      });
    } else {
      return res.status(400).json({
        message: "Only agents can register malams for now",
      });
    }
  }
);

// Malam Login:
export const MalamLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, password } = req.body;

    const CheckEmail = await MalamModels.findOne({ phoneNumber });

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
        message: "Malam Login Successfull",
        data: CheckEmail,
      });
    }
  }
);

// Get all Malams:
export const GetAllMalams = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Malams = await MalamModels.find();

    if (!Malams) {
      next(
        new MainAppError({
          message: "Malams not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got all Malams",
      data: Malams,
    });
  }
);

// Get a single Malams:
export const GetSingleMalams = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleMalams = await MalamModels.findById(req.params.gladID);

    if (!singleMalams) {
      next(
        new MainAppError({
          message: "Agents not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single mallam",
      data: singleMalams,
    });
  }
);
