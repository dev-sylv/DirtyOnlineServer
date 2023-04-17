"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOneStation = exports.GetAllStations = exports.GetOneMalam = exports.StationAssignMalam = exports.StationCreatesMalam = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const StationModels_1 = __importDefault(require("../Models/StationModels"));
const MalamModels_1 = __importDefault(require("../Models/MalamModels"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MainAppError_1 = require("../Utils/MainAppError");
const mongoose_1 = __importDefault(require("mongoose"));
const RequestModels_1 = __importDefault(require("../Models/RequestModels"));
// Station create malams:
exports.StationCreatesMalam = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const station = yield StationModels_1.default.findById(req.params.stationID);
    if (station) {
        const registerMalam = yield MalamModels_1.default.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            uniqueID: otp_generator_1.default.generate(20, {
                upperCaseAlphabets: false,
                specialChars: false,
                digits: true,
                lowerCaseAlphabets: false,
            }),
            role: "Malam",
            status: "Free",
        });
        station === null || station === void 0 ? void 0 : station.malams.push(new mongoose_1.default.Types.ObjectId(registerMalam === null || registerMalam === void 0 ? void 0 : registerMalam._id));
        station.save();
        return res.status(201).json({
            message: "Malam Successfully Registered",
            data: registerMalam,
            stationName: station.station,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Station was not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
// Station assigns malams:
exports.StationAssignMalam = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pick the station and malam you want to assign the task to:
    const { malamID, stationID, CurrentrequestID } = req.params;
    // To get the assigned station
    const Station = yield StationModels_1.default.findById(stationID);
    // To get the assigned malam
    const AssignedMalam = yield MalamModels_1.default.findById(malamID);
    // To get the current request
    const CurrentRequest = yield RequestModels_1.default.findById(CurrentrequestID);
    console.log(CurrentRequest);
    if (Station) {
        if ((AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.status) === "Free") {
            if (Station === null || Station === void 0 ? void 0 : Station.requests) {
                if (CurrentRequest) {
                    const RequestDone = yield MalamModels_1.default.findByIdAndUpdate(malamID, {
                        status: "On-duty",
                    }, {
                        new: true,
                    });
                    return res.status(MainAppError_1.HTTPCODES.ACCEPTED).json({
                        message: `Task assigned successfully to ${AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.name}`,
                        data: RequestDone,
                    });
                }
                else {
                    res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                        message: "Request not found",
                    });
                }
            }
            else {
                res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                    message: "No requests was sent to this station",
                });
            }
        }
        else {
            res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "Malam on duty",
            });
        }
    }
    else {
        res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
            message: "Station not found",
        });
    }
}));
// Get a single malam:
exports.GetOneMalam = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { malamID } = req.params;
    const Malam = yield MalamModels_1.default.findById(malamID);
    if (Malam) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${Malam === null || Malam === void 0 ? void 0 : Malam.name} date successfully gotten`,
            data: Malam,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Malam not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
// Get all stations:
exports.GetAllStations = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const AllStations = yield StationModels_1.default.find();
    if (AllStations) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Successfully got all stations",
            data: AllStations,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "No stations found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
// Get one stations:
exports.GetOneStation = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { stationID } = req.params;
    const OneStations = yield StationModels_1.default.findById(stationID);
    if (OneStations) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `Successfully got this ${OneStations === null || OneStations === void 0 ? void 0 : OneStations.station}`,
            data: OneStations,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Station not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
