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
exports.GetStationRequests = exports.ViewAllMalams = exports.StationLogin = exports.GetOneStation = exports.GetAllStations = exports.GetOneMalam = exports.StationAssignMalam = exports.StationCreatesMalam = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const StationModels_1 = __importDefault(require("../Models/StationModels"));
const MalamModels_1 = __importDefault(require("../Models/MalamModels"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MainAppError_1 = require("../Utils/MainAppError");
const mongoose_1 = __importDefault(require("mongoose"));
const RequestModels_1 = __importDefault(require("../Models/RequestModels"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
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
// Station assigns malams and the request closing automatically:
exports.StationAssignMalam = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pick the station and malam you want to assign the task to:
    const { malamID, stationID, userID, CurrentrequestID } = req.params;
    // To get the assigned station
    const Station = yield StationModels_1.default.findById(stationID);
    // To get the assigned malam
    const AssignedMalam = yield MalamModels_1.default.findById(malamID);
    // To get the user
    const TheUser = yield UserModels_1.default.findById(userID);
    // To get the current request
    const CurrentRequest = yield RequestModels_1.default.findById(CurrentrequestID);
    console.log(CurrentRequest);
    if (Station) {
        if (TheUser) {
            if ((AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.status) === "Free") {
                if (Station === null || Station === void 0 ? void 0 : Station.requests) {
                    if (CurrentRequest) {
                        // For the request to update to work in progress
                        const RequestInProgress = yield RequestModels_1.default.findByIdAndUpdate(CurrentRequest === null || CurrentRequest === void 0 ? void 0 : CurrentRequest._id, {
                            requestMessage: `This request has been assigned to ${AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.name}`,
                            requestStatus: true,
                            assigned: true,
                            Pending: `Work in Progress by ${AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.name}`,
                        }, { new: true });
                        Station === null || Station === void 0 ? void 0 : Station.feedbacks.push(new mongoose_1.default.Types.ObjectId(RequestInProgress === null || RequestInProgress === void 0 ? void 0 : RequestInProgress._id));
                        TheUser === null || TheUser === void 0 ? void 0 : TheUser.RequestHistories.push(new mongoose_1.default.Types.ObjectId(RequestInProgress === null || RequestInProgress === void 0 ? void 0 : RequestInProgress._id));
                        // To update the malam status to be on duty
                        const RequestDone = yield MalamModels_1.default.findByIdAndUpdate(malamID, {
                            status: "On-duty",
                        }, {
                            new: true,
                        });
                        //Close Request automatically after 2 hrs if user doesn't close the request
                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            const ClosedRequest = yield RequestModels_1.default.findByIdAndUpdate(CurrentRequest === null || CurrentRequest === void 0 ? void 0 : CurrentRequest._id, {
                                requestMessage: `This request has been carried out by ${AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.name}`,
                                requestStatus: false,
                                assigned: true,
                                DoneBy: `${AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam.name}`,
                                Pending: "Completed",
                            }, { new: true });
                            Station === null || Station === void 0 ? void 0 : Station.feedbacks.push(new mongoose_1.default.Types.ObjectId(ClosedRequest === null || ClosedRequest === void 0 ? void 0 : ClosedRequest._id));
                            TheUser === null || TheUser === void 0 ? void 0 : TheUser.RequestHistories.push(new mongoose_1.default.Types.ObjectId(ClosedRequest === null || ClosedRequest === void 0 ? void 0 : ClosedRequest._id));
                            const FreeMalam = yield MalamModels_1.default.findByIdAndUpdate(AssignedMalam === null || AssignedMalam === void 0 ? void 0 : AssignedMalam._id, { status: "Free" }, { new: true });
                            return res.status(200).json({
                                message: "Request Closed Successfully",
                                RequestData: ClosedRequest,
                                MalamData: FreeMalam,
                            });
                        }), 7200000);
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
            next(new MainAppError_1.MainAppError({
                message: "Couldn't get user that made the request",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
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
// Station login:
exports.StationLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const StationEmail = yield StationModels_1.default.findOne({ email });
    const StationPassword = StationEmail === null || StationEmail === void 0 ? void 0 : StationEmail.password;
    if (email === StationEmail && password === StationPassword) {
        next(new MainAppError_1.MainAppError({
            message: "Wrong station credentials",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    else {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Station login successful",
            data: StationEmail,
        });
    }
}));
// View all malams:
exports.ViewAllMalams = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Malam = yield MalamModels_1.default.find().sort({ createdAt: -1 });
    if (Malam) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `All ${Malam === null || Malam === void 0 ? void 0 : Malam.length} malams successfully gotten`,
            data: Malam,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Malams not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
// Get a particular station request:
exports.GetStationRequests = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const StationRequests = yield StationModels_1.default.findById(req.params.stationID);
    if (!StationRequests) {
        next(new MainAppError_1.MainAppError({
            message: "Station Account not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    const Requests = yield StationModels_1.default.findById(req.params.stationID).populate({
        path: "requests",
        options: {
            sort: { createdAt: -1 },
        },
    });
    return res.status(200).json({
        message: "Successfully got this business account",
        data: Requests.requests,
    });
}));
