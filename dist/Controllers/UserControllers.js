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
exports.UserUpdatesTheirProfile = exports.UserMakesSpecialRequest = exports.UserClosesARequest = exports.UserMakesARequest = exports.GetSingleUser = exports.GetAllUsers = exports.UsersLogin = exports.UsersVerification = exports.UsersRegistration = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const MainAppError_1 = require("../Utils/MainAppError");
const StationModels_1 = __importDefault(require("../Models/StationModels"));
const RequestModels_1 = __importDefault(require("../Models/RequestModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const MalamModels_1 = __importDefault(require("../Models/MalamModels"));
const node_cron_1 = __importDefault(require("node-cron"));
const CustomRequestsModels_1 = __importDefault(require("../Models/CustomRequestsModels"));
const Email_1 = require("../EmailAuth/Email");
const crypto_1 = __importDefault(require("crypto"));
// Users Registration:
exports.UsersRegistration = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, email, password, stationName } = req.body;
    const token = crypto_1.default.randomBytes(48).toString("hex");
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const findUser = yield UserModels_1.default.findOne({ email });
    if (findUser) {
        next(new MainAppError_1.MainAppError({
            message: "User with this account already exists",
            httpcode: MainAppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    const FindStation = yield StationModels_1.default.findOne({ station: stationName });
    if (FindStation) {
        const users = yield UserModels_1.default.create({
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
        (0, Email_1.VerifyUsers)(users);
        FindStation === null || FindStation === void 0 ? void 0 : FindStation.users.push(new mongoose_1.default.Types.ObjectId(users === null || users === void 0 ? void 0 : users._id));
        FindStation === null || FindStation === void 0 ? void 0 : FindStation.save();
        return res.status(201).json({
            message: "Successfully created User",
            data: users,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Station not found, Could not register user",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
// Users Verification:
exports.UsersVerification = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const User = yield UserModels_1.default.findByIdAndUpdate(userID, {
        token: "",
        isVerified: true,
    }, { new: true });
    if (User) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "User Verification Successfull, proceed to login",
            data: User,
        });
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Verification failed",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
// Users Login:
exports.UsersLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const CheckUser = yield UserModels_1.default.findOne({ email });
    const CheckPassword = yield bcrypt_1.default.compare(password, CheckUser.password);
    if (CheckPassword) {
        if (CheckUser) {
            if ((CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser.isVerified) && (CheckUser === null || CheckUser === void 0 ? void 0 : CheckUser.token) === "") {
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
                return res.status(MainAppError_1.HTTPCODES.OK).json({
                    message: "User Login successfull",
                    data: CheckUser,
                    // AccessToken: AccessToken,
                    // RefreshToken: RefreshToken,
                });
            }
            else {
                next(new MainAppError_1.MainAppError({
                    message: "User not Verified",
                    httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
                }));
            }
        }
        else {
            next(new MainAppError_1.MainAppError({
                message: "User not Found",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Email or password not correct",
            httpcode: MainAppError_1.HTTPCODES.CONFLICT,
        }));
    }
}));
// Get all Users:
exports.GetAllUsers = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModels_1.default.find().populate({
        path: "station",
        options: {
            createdAt: -1,
        },
    });
    if (!users) {
        next(new MainAppError_1.MainAppError({
            message: "Users not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got all users",
        data: users,
    });
}));
// Get a single User:
exports.GetSingleUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleuser = yield UserModels_1.default.findById(req.params.userID).populate({
        path: "station",
        options: {
            createdAt: -1,
        },
    });
    if (!singleuser) {
        next(new MainAppError_1.MainAppError({
            message: "This user could not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got this single user",
        data: singleuser,
    });
}));
// User makes a request:
exports.UserMakesARequest = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user:
    const getUser = yield UserModels_1.default.findById(req.params.userID)
        .populate("station")
        .populate("makeRequests");
    const getStation = yield StationModels_1.default.findById(req.params.stationID);
    if (getUser) {
        // Check if user station is in all the stations we have in the database
        if (getStation) {
            // If user can still make requests
            if (getUser.numberOfRequests > 0) {
                // User makes the requests:
                const Time = new Date().toString();
                const DisposewasteRequests = yield RequestModels_1.default.create({
                    user: getUser === null || getUser === void 0 ? void 0 : getUser.name,
                    address: getUser === null || getUser === void 0 ? void 0 : getUser.address,
                    requestMessage: `${getUser === null || getUser === void 0 ? void 0 : getUser.name} who resides at ${getUser === null || getUser === void 0 ? void 0 : getUser.address} made a request by ${Time} for a waste disposal`,
                    requestStatus: true,
                    assigned: false,
                    DoneBy: "No One",
                });
                // Get the station the user is apportioned to and push the created request into it:
                getUser === null || getUser === void 0 ? void 0 : getUser.makeRequests.push(new mongoose_1.default.Types.ObjectId(DisposewasteRequests === null || DisposewasteRequests === void 0 ? void 0 : DisposewasteRequests._id));
                getUser === null || getUser === void 0 ? void 0 : getUser.save();
                // If the station exists, push the requests to the station to notify them:
                getStation === null || getStation === void 0 ? void 0 : getStation.requests.push(new mongoose_1.default.Types.ObjectId(DisposewasteRequests === null || DisposewasteRequests === void 0 ? void 0 : DisposewasteRequests._id));
                getStation === null || getStation === void 0 ? void 0 : getStation.save();
                // Update the decrement of the user no of requests remaining:
                const DecreaseRequests = yield UserModels_1.default.findByIdAndUpdate(req.params.userID, {
                    numberOfRequests: (getUser === null || getUser === void 0 ? void 0 : getUser.numberOfRequests) - 1,
                }, { new: true });
                // Schedule the user requests to reset back to 4 every 28 days
                node_cron_1.default.schedule("0 0 */28 * *", () => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        yield UserModels_1.default.findByIdAndUpdate(req.params.userID, {
                            numberOfRequests: 4,
                        }, { new: true });
                    }
                    catch (error) {
                        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
                            message: "Couldn't reset",
                        });
                    }
                }));
                return res.status(MainAppError_1.HTTPCODES.OK).json({
                    message: "Request sent successfully",
                    data: DisposewasteRequests,
                    RemainingRequest: `Your requests for this month is remaining ${DecreaseRequests === null || DecreaseRequests === void 0 ? void 0 : DecreaseRequests.numberOfRequests}`,
                    RequestData: DecreaseRequests,
                    RequestNotification: `Dear ${getUser === null || getUser === void 0 ? void 0 : getUser.name}, your requests has been sent to your station @${getStation === null || getStation === void 0 ? void 0 : getStation.station}`,
                });
            }
            else {
                // If the no of request is more than 4
                next(new MainAppError_1.MainAppError({
                    message: "You can't make any other requests till next month",
                    httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                }));
            }
        }
        else {
            next(
            // If station does not exist
            new MainAppError_1.MainAppError({
                message: "This station does not exist",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "User account not found",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
// User closes a request:
exports.UserClosesARequest = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestID, malamID, stationID, userID } = req.params;
    //get the request to be closed
    const theRequestToClose = yield RequestModels_1.default.findById(requestID);
    //get the malam assigned to it
    const assignedMalam = yield MalamModels_1.default.findById(malamID);
    //get the station
    const TheStation = yield StationModels_1.default.findById(stationID);
    // The user the request is being closed:
    const TheUser = yield UserModels_1.default.findById(userID);
    //check if the request exists
    if (TheUser) {
        if (theRequestToClose === null || theRequestToClose === void 0 ? void 0 : theRequestToClose.assigned) {
            const ClosedRequest = yield RequestModels_1.default.findByIdAndUpdate(theRequestToClose === null || theRequestToClose === void 0 ? void 0 : theRequestToClose._id, {
                requestMessage: `This request has been carried out by ${assignedMalam === null || assignedMalam === void 0 ? void 0 : assignedMalam.name}`,
                requestStatus: false,
                assigned: true,
                DoneBy: `${assignedMalam === null || assignedMalam === void 0 ? void 0 : assignedMalam.name}`,
                Pending: "Completed",
            }, { new: true });
            TheStation === null || TheStation === void 0 ? void 0 : TheStation.feedbacks.push(new mongoose_1.default.Types.ObjectId(ClosedRequest === null || ClosedRequest === void 0 ? void 0 : ClosedRequest._id));
            TheStation === null || TheStation === void 0 ? void 0 : TheStation.save();
            TheUser === null || TheUser === void 0 ? void 0 : TheUser.RequestHistories.push(new mongoose_1.default.Types.ObjectId(ClosedRequest === null || ClosedRequest === void 0 ? void 0 : ClosedRequest._id));
            TheUser === null || TheUser === void 0 ? void 0 : TheUser.save();
            const FreeMalam = yield MalamModels_1.default.findByIdAndUpdate(assignedMalam === null || assignedMalam === void 0 ? void 0 : assignedMalam._id, { status: "Free" }, { new: true });
            return res.status(200).json({
                message: "Request Closed Successfully",
                RequestData: ClosedRequest,
                MalamData: FreeMalam,
            });
        }
        else {
            next(new MainAppError_1.MainAppError({
                message: "Request has not been assigned, You can't close it",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "User not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
}));
// User makes special request:
exports.UserMakesSpecialRequest = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user:
    const getUser = yield UserModels_1.default.findById(req.params.userID)
        .populate("station")
        .populate("makeRequests");
    const getStation = yield StationModels_1.default.findById(req.params.stationID);
    const { address } = req.body;
    if (getUser) {
        // Check if user station is in all the stations we have in the database
        if (getStation) {
            // User makes the requests:
            const Time = new Date().toString().split("2");
            const SpecialwasteRequests = yield CustomRequestsModels_1.default.create({
                requestMessage: `${getUser === null || getUser === void 0 ? void 0 : getUser.name} made a request by ${Time} for a waste disposal at ${address}`,
                requestType: "Custom Requests",
                requestStatus: true,
                assigned: false,
                DoneBy: "No One",
            });
            // Get the station the user is apportioned to and push the created request into it:
            getUser === null || getUser === void 0 ? void 0 : getUser.specialRequests.push(new mongoose_1.default.Types.ObjectId(SpecialwasteRequests === null || SpecialwasteRequests === void 0 ? void 0 : SpecialwasteRequests._id));
            getUser === null || getUser === void 0 ? void 0 : getUser.save();
            // If the station exists, push the requests to the station to notify them:
            getStation === null || getStation === void 0 ? void 0 : getStation.specialRequests.push(new mongoose_1.default.Types.ObjectId(SpecialwasteRequests === null || SpecialwasteRequests === void 0 ? void 0 : SpecialwasteRequests._id));
            getStation === null || getStation === void 0 ? void 0 : getStation.save();
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "Special Request sent successfully",
                data: SpecialwasteRequests,
                RequestNotification: `Dear ${getUser === null || getUser === void 0 ? void 0 : getUser.name}, your requests has been sent to your station @${getStation === null || getStation === void 0 ? void 0 : getStation.station}`,
            });
        }
        else {
            next(
            // If station does not exist
            new MainAppError_1.MainAppError({
                message: "This station does not exist",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "User account not found",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
// User Update their profile:
exports.UserUpdatesTheirProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, address, station } = req.body;
    const { userID, stationID } = req.params;
    const User = yield UserModels_1.default.findById(userID);
    // To check if the station the user wants to update to exists
    const CheckStation = yield StationModels_1.default.findOne({ station: station });
    // Get the user current station and the array of users in the station:
    const GetUserStation = yield StationModels_1.default.findById(stationID);
    // Once we have gotten the array of users, we want to compare the ID of users in that station to the one we want to remove from the station:
    // To delete the user from his former station:
    // Find the index of the particular user to remove from the users in the station:
    const GetParticularUserOutOfStation = GetUserStation === null || GetUserStation === void 0 ? void 0 : GetUserStation.users.findIndex((el) => el === (User === null || User === void 0 ? void 0 : User._id));
    // Then using splice, delete that particular user with the id
    const RemainingUsersInStation = GetUserStation === null || GetUserStation === void 0 ? void 0 : GetUserStation.users.splice(GetParticularUserOutOfStation, 1);
    if (User) {
        if (RemainingUsersInStation) {
            if (CheckStation) {
                const Update = yield UserModels_1.default.findByIdAndUpdate(userID, {
                    email,
                    phoneNumber,
                    address,
                    station: CheckStation,
                }, { new: true });
                CheckStation === null || CheckStation === void 0 ? void 0 : CheckStation.users.push(new mongoose_1.default.Types.ObjectId(Update === null || Update === void 0 ? void 0 : Update._id));
                CheckStation === null || CheckStation === void 0 ? void 0 : CheckStation.save();
                const UpdatedFormerStation = yield StationModels_1.default.findByIdAndUpdate(stationID, {
                    users: RemainingUsersInStation,
                }, { new: true });
                return res.status(MainAppError_1.HTTPCODES.OK).json({
                    message: "User profile updated successfully",
                    data: Update,
                });
            }
            else {
                next(new MainAppError_1.MainAppError({
                    message: "Station you want to update to not available",
                    httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                }));
            }
        }
        else {
            next(new MainAppError_1.MainAppError({
                message: "You've not been removed from former station",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "Couldn't update",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
