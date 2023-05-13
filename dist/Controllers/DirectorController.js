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
exports.GetDirector = exports.DirectorCreatesStation = exports.DirectorLogin = exports.DirectorRegistration = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const MainAppError_1 = require("../Utils/MainAppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ManagerModels_1 = __importDefault(require("../Models/ManagerModels"));
const StationModels_1 = __importDefault(require("../Models/StationModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
// Create a director:
exports.DirectorRegistration = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password } = req.body;
    const GetAllUsers = yield UserModels_1.default.find();
    const GetAllStations = yield StationModels_1.default.find();
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    if (!name || !email) {
        next(new MainAppError_1.MainAppError({
            message: "Please provide neccessary credentials",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    const Directors = yield ManagerModels_1.default.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role: "Director",
        station: GetAllStations,
        users: GetAllUsers,
        isVerified: true,
    });
    if (!Directors) {
        next(new MainAppError_1.MainAppError({
            message: "Unable to register director",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(201).json({
        message: "Director Successfully registered",
        data: Directors,
    });
}));
// Director Login:
exports.DirectorLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email)
        next(new MainAppError_1.MainAppError({
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            message: "Please input your login credentials",
        }));
    const Director = yield ManagerModels_1.default.findOne({
        email,
        name,
    }).populate([
        {
            path: "users",
        },
    ]);
    if (!Director)
        next(new MainAppError_1.MainAppError({
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            message: "Login failed",
        }));
    return res.status(MainAppError_1.HTTPCODES.CREATED).json({
        message: "Login Successfull",
        data: Director,
    });
}));
// Director Creates stations:
exports.DirectorCreatesStation = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { station, email, phoneNumber, address, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    if (!station || !email) {
        next(new MainAppError_1.MainAppError({
            message: "Please provide neccessary credentials",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    const CheckStationName = yield StationModels_1.default.findOne({ station });
    const director = yield ManagerModels_1.default.findById(req.params.directorID);
    if (director) {
        if (CheckStationName) {
            next(new MainAppError_1.MainAppError({
                message: "Station with this name already exists",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        if (!CheckStationName) {
            const Station = yield StationModels_1.default.create({
                station,
                email,
                phoneNumber,
                address,
                password,
                users: [],
                requests: [],
                transactionHistory: [],
                feedbacks: [],
            });
            director === null || director === void 0 ? void 0 : director.stations.push(new mongoose_1.default.Types.ObjectId(Station === null || Station === void 0 ? void 0 : Station._id));
            director === null || director === void 0 ? void 0 : director.save();
            return res.status(201).json({
                message: "Station Successfully created",
                data: Station,
            });
        }
    }
    else {
        next(new MainAppError_1.MainAppError({
            message: "You are not authorized",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
//To Get Director
exports.GetDirector = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Director = yield ManagerModels_1.default.find();
    if (!Director)
        next(new MainAppError_1.MainAppError({
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            message: "Get failed",
        }));
    return res.status(MainAppError_1.HTTPCODES.CREATED).json({
        message: "Successfull",
        data: Director,
    });
}));
