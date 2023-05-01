import { NextFunction } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import RequestModels from "../Models/RequestModels";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { Request, Response } from "express";

// Get all requests in the database:
export const GetAllRequests = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Requests = await RequestModels.find();
    if (!Requests) {
      next(
        new MainAppError({
          message: "No requests found",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    } else {
      return res.status(HTTPCODES.OK).json({
        message: `Got all ${Requests?.length} requests`,
        data: Requests,
      });
    }
  }
);

// Get the 5 recent requests for the director's dashboard:
export const Get5RecentRequests = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Requests = await RequestModels.find().limit(5);
    if (!Requests) {
      next(
        new MainAppError({
          message: "No recent requests found",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    } else {
      return res.status(HTTPCODES.OK).json({
        message: `Got all ${Requests?.length} requests`,
        data: Requests,
      });
    }
  }
);
