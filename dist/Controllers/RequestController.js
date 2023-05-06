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
exports.ViewAllCustomRequests = exports.Get5RecentRequests = exports.GetAllRequests = void 0;
const AsyncHandler_1 = require("../Utils/AsyncHandler");
const RequestModels_1 = __importDefault(require("../Models/RequestModels"));
const MainAppError_1 = require("../Utils/MainAppError");
const CustomRequestsModels_1 = __importDefault(require("../Models/CustomRequestsModels"));
// Get all requests in the database:
exports.GetAllRequests = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Requests = yield RequestModels_1.default.find().sort({ createdAt: -1 });
    if (!Requests) {
        next(new MainAppError_1.MainAppError({
            message: "No requests found",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    else {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `Got all ${Requests === null || Requests === void 0 ? void 0 : Requests.length} requests`,
            data: Requests,
        });
    }
}));
// Get the 5 recent requests for the director's dashboard:
exports.Get5RecentRequests = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Requests = yield RequestModels_1.default.find()
        .limit(5)
        .sort({ createdAt: -1 });
    if (!Requests) {
        next(new MainAppError_1.MainAppError({
            message: "No recent requests found",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    else {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `Got all ${Requests === null || Requests === void 0 ? void 0 : Requests.length} requests`,
            data: Requests,
        });
    }
}));
// View all custom requests:
exports.ViewAllCustomRequests = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Customrequests = yield CustomRequestsModels_1.default.find().sort({
        createdAt: -1,
    });
    if (!Customrequests) {
        next(new MainAppError_1.MainAppError({
            message: "No custom requests found",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
    else {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `All ${Customrequests === null || Customrequests === void 0 ? void 0 : Customrequests.length} custom requests gotten`,
            data: Customrequests,
        });
    }
}));
