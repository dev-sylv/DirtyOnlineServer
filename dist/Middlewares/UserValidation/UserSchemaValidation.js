"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserSchemaValidation = {
    Register: joi_1.default.object({
        Username: joi_1.default.string().required(),
        LGA: joi_1.default.string().required(),
        Phoneno: joi_1.default.number().required(),
        address: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    }),
    Login: joi_1.default.object({
        Username: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).required(),
    }),
};
