import { NextFunction, Request, Response, response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import bcrypt from "bcrypt";
import UserModels from "../Models/UserModels";
import { MainAppError, HTTPCODES } from "../Utils/MainAppError";
import StationModels from "../Models/StationModels";
import RequestModels from "../Models/RequestModels";
import mongoose from "mongoose";
import MalamModels from "../Models/MalamModels";
import cron from "node-cron";
import CustomRequestModels from "../Models/CustomRequestsModels";
import { VerifyUsers } from "../EmailAuth/Email";
import crypto from "crypto";

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, address, email, password, stationName } = req.body;

    const token = crypto.randomBytes(48).toString("hex");

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
        token,
        isVerified: false,
      });

      VerifyUsers(users);

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

// Users Verification:
export const UsersVerification = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const User = await UserModels.findByIdAndUpdate(
      userID,
      {
        token: "",
        verified: true,
      },
      { new: true }
    );

    if (User) {
      return res.status(HTTPCODES.OK).json({
        message: "User Verification Successfull, proceed to login",
        data: User,
      });
    } else {
      next(
        new MainAppError({
          message: "Verification failed",
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

    const CheckUser = await UserModels.findOne({ email });

    const CheckPassword = await bcrypt.compare(password, CheckUser!.password);

    if (CheckPassword) {
      if (CheckUser) {
        if (CheckUser?.isVerified && CheckUser?.token === "") {
          // The access token that expires every 2 mins
          // const AccessToken = jwt.sign(
          //   {
          //     id: CheckUser?._id,
          //   },
          //   "AccessTokenSecret",
          //   {
          //     expiresIn: "40s",
          //   }
          // );
          // // The refresh token
          // const RefreshToken = jwt.sign(
          //   {
          //     id: CheckUser?._id,
          //   },
          //   "RefreshTokenSecret",
          //   { expiresIn: "1m" }
          // );

          return res.status(HTTPCODES.OK).json({
            message: "User Login successfull",
            data: CheckUser,
            // AccessToken: AccessToken,
            // RefreshToken: RefreshToken,
          });
        } else {
          next(
            new MainAppError({
              message: "User not Verified",
              httpcode: HTTPCODES.NOT_FOUND,
            })
          );
        }
      } else {
        next(
          new MainAppError({
            message: "User not Found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
    } else {
      next(
        new MainAppError({
          message: "Email or password not correct",
          httpcode: HTTPCODES.CONFLICT,
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
            user: getUser?.name,
            address: getUser?.address,
            requestMessage: `${getUser?.name} who resides at ${getUser?.address} made a request by ${Time} for a waste disposal`,
            requestStatus: true,
            assigned: false,
            DoneBy: "No One",
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

          // Schedule the user requests to reset back to 4 every 28 days
          cron.schedule("0 0 */28 * *", async () => {
            try {
              await UserModels.findByIdAndUpdate(
                req.params.userID,
                {
                  numberOfRequests: 4,
                },
                { new: true }
              );
            } catch (error) {
              return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
                message: "Couldn't reset",
              });
            }
          });

          return res.status(HTTPCODES.OK).json({
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
    const { requestID, malamID, stationID, userID } = req.params;
    //get the request to be closed
    const theRequestToClose = await RequestModels.findById(requestID);
    //get the malam assigned to it
    const assignedMalam = await MalamModels.findById(malamID);
    //get the station
    const TheStation = await StationModels.findById(stationID);
    // The user the request is being closed:
    const TheUser = await UserModels.findById(userID);

    //check if the request exists
    if (TheUser) {
      if (theRequestToClose?.assigned) {
        const ClosedRequest = await RequestModels.findByIdAndUpdate(
          theRequestToClose?._id,
          {
            requestMessage: `This request has been carried out by ${assignedMalam?.name}`,
            requestStatus: false,
            assigned: true,
            DoneBy: `${assignedMalam?.name}`,
            Pending: "Completed",
          },
          { new: true }
        );

        TheStation?.feedbacks.push(
          new mongoose.Types.ObjectId(ClosedRequest?._id)
        );
        TheStation?.save();

        TheUser?.RequestHistories.push(
          new mongoose.Types.ObjectId(ClosedRequest?._id)
        );
        TheUser?.save();

        const FreeMalam = await MalamModels.findByIdAndUpdate(
          assignedMalam?._id,
          { status: "Free" },
          { new: true }
        );
        return res.status(200).json({
          message: "Request Closed Successfully",
          RequestData: ClosedRequest,
          MalamData: FreeMalam,
        });
      } else {
        next(
          new MainAppError({
            message: "Request has not been assigned, You can't close it",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
    } else {
      next(
        new MainAppError({
          message: "User not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);

// User makes special request:
export const UserMakesSpecialRequest = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the user:
    const getUser = await UserModels.findById(req.params.userID)
      .populate("station")
      .populate("makeRequests");

    const getStation = await StationModels.findById(req.params.stationID);

    const { address } = req.body;

    if (getUser) {
      // Check if user station is in all the stations we have in the database
      if (getStation) {
        // User makes the requests:
        const Time = new Date().toString().split("2");
        const SpecialwasteRequests = await CustomRequestModels.create({
          requestMessage: `${getUser?.name} made a request by ${Time} for a waste disposal at ${address}`,
          requestType: "Custom Requests",
          requestStatus: true,
          assigned: false,
          DoneBy: "No One",
        });

        // Get the station the user is apportioned to and push the created request into it:
        getUser?.specialRequests.push(
          new mongoose.Types.ObjectId(SpecialwasteRequests?._id)
        );
        getUser?.save();

        // If the station exists, push the requests to the station to notify them:
        getStation?.specialRequests.push(
          new mongoose.Types.ObjectId(SpecialwasteRequests?._id)
        );
        getStation?.save();

        return res.status(HTTPCODES.OK).json({
          message: "Special Request sent successfully",
          data: SpecialwasteRequests,
          RequestNotification: `Dear ${getUser?.name}, your requests has been sent to your station @${getStation?.station}`,
        });
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

// User Update their profile:
export const UserUpdatesTheirProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber, address, station } = req.body;

    const { userID, stationID } = req.params;

    const User = await UserModels.findById(userID);

    // To check if the station the user wants to update to exists
    const CheckStation = await StationModels.findOne({ station: station });

    // Get the user current station and the array of users in the station:
    const GetUserStation = await StationModels.findById(stationID);

    // Once we have gotten the array of users, we want to compare the ID of users in that station to the one we want to remove from the station:
    // To delete the user from his former station:
    // Find the index of the particular user to remove from the users in the station:
    const GetParticularUserOutOfStation = GetUserStation?.users.findIndex(
      (el) => el === User?._id
    );

    // Then using splice, delete that particular user with the id
    const RemainingUsersInStation = GetUserStation?.users.splice(
      GetParticularUserOutOfStation!,
      1
    );

    if (User) {
      if (RemainingUsersInStation) {
        if (CheckStation) {
          const Update = await UserModels.findByIdAndUpdate(
            userID,
            {
              email,
              phoneNumber,
              address,
              station: CheckStation,
            },
            { new: true }
          );
          CheckStation?.users.push(new mongoose.Types.ObjectId(Update?._id));
          CheckStation?.save();

          const UpdatedFormerStation = await StationModels.findByIdAndUpdate(
            stationID,
            {
              users: RemainingUsersInStation,
            },
            { new: true }
          );

          return res.status(HTTPCODES.OK).json({
            message: "User profile updated successfully",
            data: Update,
          });
        } else {
          next(
            new MainAppError({
              message: "Station you want to update to not available",
              httpcode: HTTPCODES.BAD_REQUEST,
            })
          );
        }
      } else {
        next(
          new MainAppError({
            message: "You've not been removed from former station",
            httpcode: HTTPCODES.BAD_REQUEST,
          })
        );
      }
    } else {
      next(
        new MainAppError({
          message: "Couldn't update",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);
