import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import StationModels from "../Models/StationModels";
import MalamModels from "../Models/MalamModels";
import otpgenerator from "otp-generator";
import bcrypt from "bcrypt";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import mongoose from "mongoose";
import RequestModels from "../Models/RequestModels";

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
        stationName: station.stationName,
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

// Station assigns malams:
export const StationAssignMalam = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Pick the station and malam you want to assign the task to:
    const { malamID, stationID, CurrentrequestID } = req.params;

    // To get the assigned station
    const Station = await StationModels.findById(stationID);
    // To get the assigned malam
    const AssignedMalam = await MalamModels.findById(malamID);
    // To get the current reques
    const CurrentRequest = await RequestModels.findById(CurrentrequestID);

    if (Station) {
      if (AssignedMalam?.status === "Free") {
        if (Station?.requests) {
          const RequestDone = await MalamModels.findByIdAndUpdate;
        } else {
          res.status(HTTPCODES.NOT_FOUND).json({
            message: "No requests was sent to this station",
          });
        }
      } else {
        res.status(HTTPCODES.NOT_FOUND).json({
          message: "Malam not found - Malam on duty",
        });
      }
    } else {
      res.status(HTTPCODES.NOT_FOUND).json({
        message: "Station not found",
      });
    }
  }
);
