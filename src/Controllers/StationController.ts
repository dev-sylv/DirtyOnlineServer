import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import StationModels from "../Models/StationModels";
import MalamModels from "../Models/MalamModels";
import otpgenerator from "otp-generator";
import bcrypt from "bcrypt";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import mongoose from "mongoose";
import RequestModels from "../Models/RequestModels";
import UserModels from "../Models/UserModels";

// Station create malams:
export const StationCreatesMalam = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const station = await StationModels.findById(req.params.stationID);
    if (station) {
      const registerMalam = await MalamModels.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        uniqueID: otpgenerator.generate(20, {
          upperCaseAlphabets: false,
          specialChars: false,
          digits: true,
          lowerCaseAlphabets: false,
        }),
        role: "Malam",
        status: "Free",
      });
      station?.malams.push(new mongoose.Types.ObjectId(registerMalam?._id));
      station.save();

      return res.status(201).json({
        message: "Malam Successfully Registered",
        data: registerMalam,
        stationName: station.station,
      });
    } else {
      next(
        new MainAppError({
          message: "Station was not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);

// Station assigns malams and the :
export const StationAssignMalam = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Pick the station and malam you want to assign the task to:
    const { malamID, stationID, userID, CurrentrequestID } = req.params;

    // To get the assigned station
    const Station = await StationModels.findById(stationID);
    // To get the assigned malam
    const AssignedMalam = await MalamModels.findById(malamID);
    // To get the user
    const TheUser = await UserModels.findById(userID);
    // To get the current request
    const CurrentRequest = await RequestModels.findById(CurrentrequestID);
    console.log(CurrentRequest);
    if (Station) {
      if (TheUser) {
        if (AssignedMalam?.status === "Free") {
          if (Station?.requests) {
            if (CurrentRequest) {
              // For the request to update to work in progress
              const RequestInProgress = await RequestModels.findByIdAndUpdate(
                CurrentRequest?._id,
                {
                  requestMessage: `This request has been assigned to ${AssignedMalam?.name}`,
                  requestStatus: true,
                  assigned: true,
                  Pending: `Work in Progress by ${AssignedMalam?.name}`,
                },
                { new: true }
              );

              Station?.feedbacks.push(
                new mongoose.Types.ObjectId(RequestInProgress?._id)
              );
              TheUser?.RequestHistories.push(
                new mongoose.Types.ObjectId(RequestInProgress?._id)
              );

              // To update the malam status to be on duty
              const RequestDone = await MalamModels.findByIdAndUpdate(
                malamID,
                {
                  status: "On-duty",
                },
                {
                  new: true,
                }
              );
              //Close Request automatically after 2 hrs if user doesn't close the request
              setTimeout(async () => {
                const ClosedRequest = await RequestModels.findByIdAndUpdate(
                  CurrentRequest?._id,
                  {
                    requestMessage: `This request has been carried out by ${AssignedMalam?.name}`,
                    requestStatus: false,
                    assigned: true,
                    DoneBy: `${AssignedMalam?.name}`,
                    Pending: "Completed",
                  },
                  { new: true }
                );

                Station?.feedbacks.push(
                  new mongoose.Types.ObjectId(ClosedRequest?._id)
                );
                TheUser?.RequestHistories.push(
                  new mongoose.Types.ObjectId(ClosedRequest?._id)
                );

                const FreeMalam = await MalamModels.findByIdAndUpdate(
                  AssignedMalam?._id,
                  { status: "Free" },
                  { new: true }
                );
                return res.status(200).json({
                  message: "Request Closed Successfully",
                  RequestData: ClosedRequest,
                  MalamData: FreeMalam,
                });
              }, 120000);

              return res.status(HTTPCODES.ACCEPTED).json({
                message: `Task assigned successfully to ${AssignedMalam?.name}`,
                data: RequestDone,
              });
            } else {
              res.status(HTTPCODES.NOT_FOUND).json({
                message: "Request not found",
              });
            }
          } else {
            res.status(HTTPCODES.NOT_FOUND).json({
              message: "No requests was sent to this station",
            });
          }
        } else {
          res.status(HTTPCODES.NOT_FOUND).json({
            message: "Malam on duty",
          });
        }
      } else {
        next(
          new MainAppError({
            message: "Couldn't get user that made the request",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
    } else {
      res.status(HTTPCODES.NOT_FOUND).json({
        message: "Station not found",
      });
    }
  }
);

// Get a single malam:
export const GetOneMalam = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { malamID } = req.params;
    const Malam = await MalamModels.findById(malamID);

    if (Malam) {
      return res.status(HTTPCODES.OK).json({
        message: `${Malam?.name} date successfully gotten`,
        data: Malam,
      });
    } else {
      next(
        new MainAppError({
          message: "Malam not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);

// Get all stations:
export const GetAllStations = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const AllStations = await StationModels.find();
    if (AllStations) {
      return res.status(HTTPCODES.OK).json({
        message: "Successfully got all stations",
        data: AllStations,
      });
    } else {
      next(
        new MainAppError({
          message: "No stations found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);

// Get one stations:
export const GetOneStation = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { stationID } = req.params;
    const OneStations = await StationModels.findById(stationID);

    if (OneStations) {
      return res.status(HTTPCODES.OK).json({
        message: `Successfully got this ${OneStations?.station}`,
        data: OneStations,
      });
    } else {
      next(
        new MainAppError({
          message: "Station not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }
  }
);
