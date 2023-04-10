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
exports.GetSingleUser = exports.GetAllUsers = exports.UsersLogin = exports.UsersRegistration = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const MainAppError_1 = require("../Utils/MainAppError");
// Users Registration:
exports.UsersRegistration = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, username, LGA, address, phone, password } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const findEmail = yield UserModels_1.default.findOne({ username });
    if (findEmail) {
        next(new MainAppError_1.MainAppError({
            message: "Agent with this account already exists",
            httpcode: MainAppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    const users = yield UserModels_1.default.create({
        username,
        name,
        email,
        role: "User",
        LGA,
        address,
        phone,
        password: hashedPassword,
        confirmPassword: hashedPassword,
    });
    return res.status(201).json({
        message: "Successfully created Users",
        data: users,
    });
}));
// Users Login:
exports.UsersLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email)
            next(new MainAppError_1.MainAppError({
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                message: "Please input your email",
            }));
        const user = yield UserModels_1.default.findOne({
            email,
            password,
        });
        if (!user)
            next(new MainAppError_1.MainAppError({
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
                message: "Login failed",
            }));
        return res.status(MainAppError_1.HTTPCODES.CREATED).json({
            message: "Login Successfull",
            data: user,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "Request failed",
            data: error,
        });
    }
}));
// Get all Users:
exports.GetAllUsers = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModels_1.default.find();
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
    const singleuser = yield UserModels_1.default.findById(req.params.userID);
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
