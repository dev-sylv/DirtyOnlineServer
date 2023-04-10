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
exports.GetSingleMalams = exports.GetAllMalams = exports.MalamLogin = exports.MalamRegistration = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const MainAppError_1 = require("../Utils/MainAppError");
const MalamModels_1 = __importDefault(require("../Models/MalamModels"));
const AgentModels_1 = __importDefault(require("../Models/AgentModels"));
const otp_generator_1 = __importDefault(require("otp-generator"));
// Malam Registration:
exports.MalamRegistration = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNumber, password, LGA } = req.body;
    const AgentCaretaker = yield AgentModels_1.default.findById(req.params.agentID);
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const MalamInitials = name.slice(0, 3);
    const findEmail = yield MalamModels_1.default.findOne({ name });
    if (findEmail) {
        next(new MainAppError_1.MainAppError({
            message: "Malam with this account already exists",
            httpcode: MainAppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    if ((AgentCaretaker === null || AgentCaretaker === void 0 ? void 0 : AgentCaretaker.role) === "Agent") {
        const Malam = yield MalamModels_1.default.create({
            name,
            LGA,
            phoneNumber,
            uniqueID: MalamInitials +
                otp_generator_1.default.generate(10, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                }),
            password: hashedPassword,
            confirmPassword: hashedPassword,
        });
        return res.status(201).json({
            message: `Malam account successfully created by Agent ${AgentCaretaker === null || AgentCaretaker === void 0 ? void 0 : AgentCaretaker.name}`,
            data: Malam,
        });
    }
    else {
        return res.status(400).json({
            message: "Only agents can register malams for now",
        });
    }
}));
// Malam Login:
exports.MalamLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = req.body;
    const CheckEmail = yield MalamModels_1.default.findOne({ phoneNumber });
    if (!CheckEmail) {
        next(new MainAppError_1.MainAppError({
            message: "User not Found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    const CheckPassword = yield bcrypt_1.default.compare(password, CheckEmail.password);
    if (!CheckPassword) {
        next(new MainAppError_1.MainAppError({
            message: "Email or password not correct",
            httpcode: MainAppError_1.HTTPCODES.CONFLICT,
        }));
    }
    if (CheckEmail && CheckPassword) {
        return res.status(200).json({
            message: "Malam Login Successfull",
            data: CheckEmail,
        });
    }
}));
// Get all Malams:
exports.GetAllMalams = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Malams = yield MalamModels_1.default.find();
    if (!Malams) {
        next(new MainAppError_1.MainAppError({
            message: "Malams not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got all Malams",
        data: Malams,
    });
}));
// Get a single Malams:
exports.GetSingleMalams = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleMalams = yield MalamModels_1.default.findById(req.params.malamID);
    if (!singleMalams) {
        next(new MainAppError_1.MainAppError({
            message: "Agents not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got this single mallam",
        data: singleMalams,
    });
}));
