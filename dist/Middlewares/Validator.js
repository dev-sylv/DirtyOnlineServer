"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const MainAppError_1 = require("../Utils/MainAppError");
const Validator = (schemaName, body, next) => {
    const value = schemaName.validate(body, {
        allowUnknown: true,
        abortEarly: false,
        stripUnknown: true,
    });
    try {
        value.error
            ? next(new MainAppError_1.MainAppError({
                httpcode: MainAppError_1.HTTPCODES.UNPROCESSABLE_IDENTITY,
                message: value.error.details[0].message,
            }))
            : next();
    }
    catch (error) {
        console.log(error);
    }
};
exports.Validator = Validator;
