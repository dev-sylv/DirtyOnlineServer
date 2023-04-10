import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";
import MalamModels from "../Models/MalamModels";
import AgentModels from "../Models/AgentModels";

// Malam Registration:
export const MalamRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, phoneNumber, password, LGA } = req.body;

    const AgentCaretaker = await AgentModels.findById(req.params.agentID);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

// // Agents Login:
// export const AgentsLogin = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;

//     const CheckEmail = await AgentModels.findOne({ email });

//     if (!CheckEmail) {
//       next(
//         new MainAppError({
//           message: "User not Found",
//           httpcode: HTTPCODES.NOT_FOUND,
//         })
//       );
//     }

//     const CheckPassword = await bcrypt.compare(password, CheckEmail!.password);

//     if (!CheckPassword) {
//       next(
//         new MainAppError({
//           message: "Email or password not correct",
//           httpcode: HTTPCODES.CONFLICT,
//         })
//       );
//     }

//     if (CheckEmail && CheckPassword) {
//       return res.status(200).json({
//         message: "Login Successfull",
//         data: CheckEmail,
//       });
//     }
//   }
// );

// // Get all Agents:
// export const GetAllAgent = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const agents = await AgentModels.find();

//     if (!agents) {
//       next(
//         new MainAppError({
//           message: "Agents not found",
//           httpcode: HTTPCODES.NOT_FOUND,
//         })
//       );
//     }

//     return res.status(200).json({
//       message: "Successfully got all agents",
//       data: agents,
//     });
//   }
// );

// // Get a single Agent:
// export const GetSingleAgent = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const singleagent = await AgentModels.findById(req.params.userID);

//     if (!singleagent) {
//       next(
//         new MainAppError({
//           message: "Agents not found",
//           httpcode: HTTPCODES.NOT_FOUND,
//         })
//       );
//     }

//     return res.status(200).json({
//       message: "Successfully got this single agent",
//       data: singleagent,
//     });
//   }
// );
