"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const MainAppError_1 = require("../../Utils/MainAppError");
const DevError = (err, res) => {
    return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
        error: err,
        message: err.message,
        stack: err.stack,
        status: err.httpcode,
    });
};
const ErrorHandler = (err, req, res, next) => {
    DevError(err, res);
};
exports.ErrorHandler = ErrorHandler;
