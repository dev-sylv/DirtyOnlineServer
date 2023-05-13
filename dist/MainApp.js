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
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const DirectorRoutes_1 = __importDefault(require("./Routes/DirectorRoutes"));
const StationRoutes_1 = __importDefault(require("./Routes/StationRoutes"));
const RequestRoutes_1 = __importDefault(require("./Routes/RequestRoutes"));
const AppConfig = (app) => {
    app.set("view engine", "ejs");
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.get("/", (req, res) => {
        return res.status(200).json({
            message: "API READY FOR ecoBIN Project",
        });
    });
    // Rendering ejs file on the browser:
    app.get("/views/verify", (req, res) => {
        res.render("AccountVerification");
    });
    // Configuring the routes:
    app.use("/api/director", DirectorRoutes_1.default);
    app.use("/api/users", UserRoutes_1.default);
    app.use("/api/stations", StationRoutes_1.default);
    app.use("/api/requests", RequestRoutes_1.default);
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
