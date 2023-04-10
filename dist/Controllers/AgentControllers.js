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
exports.GetSingleAgent = exports.GetAllAgent = exports.AgentsLogin = exports.AgentsRegistration = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AgentModels_1 = __importDefault(require("../Models/AgentModels"));
const MainAppError_1 = require("../Utils/MainAppError");
// Agents Registration:
exports.AgentsRegistration = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, LGA, password } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const findEmail = yield AgentModels_1.default.findOne({ email });
    if (findEmail) {
        next(new MainAppError_1.MainAppError({
            message: "Agent with this account already exists",
            httpcode: MainAppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    const Agents = yield AgentModels_1.default.create({
        name,
        email,
        LGA,
        password: hashedPassword,
        confirmPassword: hashedPassword,
    });
    return res.status(201).json({
        message: "Successfully created Agent",
        data: Agents,
    });
}));
// Agents Login:
exports.AgentsLogin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const CheckEmail = yield AgentModels_1.default.findOne({ email });
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
            message: "Login Successfull",
            data: CheckEmail,
        });
    }
}));
// Get all Agents:
exports.GetAllAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield AgentModels_1.default.find();
    if (!agents) {
        next(new MainAppError_1.MainAppError({
            message: "Agents not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got all agents",
        data: agents,
    });
}));
// Get a single Agent:
exports.GetSingleAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleagent = yield AgentModels_1.default.findById(req.params.agentID);
    if (!singleagent) {
        next(new MainAppError_1.MainAppError({
            message: "Agents not found",
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got this single agent",
        data: singleagent,
    });
}));
