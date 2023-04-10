"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const MainAppError_1 = require("./Utils/MainAppError");
const ErrorHandler_1 = require("./Middlewares/ErrorHandler/ErrorHandler");
const AgentsRoutes_1 = __importDefault(require("./Routes/AgentsRoutes"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const MalamRoutes_1 = __importDefault(require("./Routes/MalamRoutes"));
const AppConfig = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    // Configuring the routes:
    app.use("/api/agents", AgentsRoutes_1.default);
    app.use("api/users", UserRoutes_1.default);
    app.use("api/malams", MalamRoutes_1.default);
    app.all("*", (req, res, next) => {
        next(new MainAppError_1.MainAppError({
            message: `This router ${req.originalUrl} does not exist`,
            httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            name: "Route Error",
            isOperational: false,
        }));
    });
    app.use(ErrorHandler_1.ErrorHandler);
};
exports.AppConfig = AppConfig;
