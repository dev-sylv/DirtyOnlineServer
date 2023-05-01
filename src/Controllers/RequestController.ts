import { NextFunction } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import RequestModels from "../Models/RequestModels";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { Request, Response } from "express";
import CustomRequestModels from "../Models/CustomRequestsModels";

// Get all requests in the database:
export const GetAllRequests = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Requests = await RequestModels.find().sort({ createdAt: -1 });
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
    const Requests = await RequestModels.find()
      .limit(5)
      .sort({ createdAt: -1 });
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

// View all custom requests:
export const ViewAllCustomRequests = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Customrequests = await CustomRequestModels.find().sort({
      createdAt: -1,
    });

    if (!Customrequests) {
      next(
        new MainAppError({
          message: "No custom requests found",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    } else {
      return res.status(HTTPCODES.OK).json({
        message: `All ${Customrequests?.length} custom requests gotten`,
        data: Customrequests,
      });
    }
  }
);
