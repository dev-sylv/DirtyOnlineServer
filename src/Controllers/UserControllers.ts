import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import UserModels from "../Models/UserModels";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";
import StationModels from "../Models/StationModels";
import RequestModels from "../Models/RequestModels";
import mongoose from "mongoose";
import MalamModels from "../Models/MalamModels";

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, address, email, password, stationName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findUser = await UserModels.findOne({ email });

    if (findUser) {
      next(
        new MainAppError({
          message: "User with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const FindStation = await StationModels.findOne({ station: stationName });
    if (FindStation) {
      const users = await UserModels.create({
        name,
        email,
        role: "User",
        address,
        password: hashedPassword,
        station: FindStation,
        numberOfRequests: 4,
      });

      FindStation?.users.push(new mongoose.Types.ObjectId(users?._id));
      FindStation?.save();

      return res.status(201).json({
        message: "Successfully created User",
        data: users,
      });
    } else {
      next(
        new MainAppError({
          message: "Station not found, Could not register user",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

// Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email)
      next(
        new MainAppError({
          httpcode: HTTPCODES.BAD_REQUEST,
          message: "Please input your email address",
        })
      );
    const user = await UserModels.findOne({
      email,
    }).populate({
      path: "station",
      options: {
        createdAt: -1,
      },
    });
    if (!user)
      next(
        new MainAppError({
          httpcode: HTTPCODES.NOT_FOUND,
          message: "Invalid account",
        })
      );
    const CheckPassword = await bcrypt.compare(password, user!.password);

    if (CheckPassword) {
      return res.status(HTTPCODES.CREATED).json({
        message: "Login Successfull",
        data: user,
      });
    } else {
      next(
        new MainAppError({
          httpcode: HTTPCODES.NOT_FOUND,
          message: "Email or password not correct",
        })
      );
    }
  }
);

// Get all Users:
export const GetAllUsers = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserModels.find().populate({
      path: "station",
      options: {
        createdAt: -1,
      },
    });

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
    const singleuser = await UserModels.findById(req.params.userID).populate({
      path: "station",
      options: {
        createdAt: -1,
      },
    });

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

// User makes a request:
export const UserMakesARequest = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the user:
    const getUser = await UserModels.findById(req.params.userID)
      .populate("station")
      .populate("makeRequests");

    const getStation = await StationModels.findById(req.params.stationID);

    if (getUser) {
      // Check if user station is in all the stations we have in the database
      if (getStation) {
        // If user can still make requests
        if (getUser!.numberOfRequests > 0) {
          // User makes the requests:
          const Time = new Date().toString();
          const DisposewasteRequests = await RequestModels.create({
            requestMessage: `${getUser?.name} who resides at ${getUser?.address} made a request by ${Time} for a waste disposal`,
            requestStatus: true,
          });
          // Get the station the user is apportioned to and push the created request into it:
          getUser?.makeRequests.push(
            new mongoose.Types.ObjectId(DisposewasteRequests?._id)
          );
          getUser?.save();

          // If the station exists, push the requests to the station to notify them:
          getStation?.requests.push(
            new mongoose.Types.ObjectId(DisposewasteRequests?._id)
          );
          getStation?.save();

          // Update the decrement of the user no of requests remaining:
          const DecreaseRequests = await UserModels.findByIdAndUpdate(
            req.params.userID,
            {
              numberOfRequests: getUser?.numberOfRequests - 1,
            },
            { new: true }
          );
          return res.status(HTTPCODES.OK).json({
            Station: getStation,
            message: "Request sent successfully",
            data: DisposewasteRequests,
            RemainingRequest: `Your requests for this month is remaining ${DecreaseRequests?.numberOfRequests}`,
            RequestData: DecreaseRequests,
            RequestNotification: `Dear ${getUser?.name}, your requests has been sent to your station @${getStation?.station}`,
          });
        } else {
          // If the no of request is more than 4
          next(
            new MainAppError({
              message: "You can't make any other requests till next month",
              httpcode: HTTPCODES.BAD_REQUEST,
            })
          );
        }
      } else {
        next(
          // If station does not exist
          new MainAppError({
            message: "This station does not exist",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
    } else {
      next(
        new MainAppError({
          message: "User account not found",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

// User closes a request:
export const UserClosesARequest = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the request to be closed
    const theRequestToClose = await RequestModels.findById(
      req.params.requestID
    );
    //get the malam assigned to it
    const assignedMalam = await MalamModels.findById(req.params.malamID);
    //check if the request exists
    if (theRequestToClose) {
      await RequestModels.findByIdAndUpdate(
        theRequestToClose?._id,
        {
          requestMessage: `This request has been carried out by ${assignedMalam?.name}`,
          requestStatus: false,
        },
        { new: true }
      );
    } else {
      next(
        new MainAppError({
          message: "request not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);
