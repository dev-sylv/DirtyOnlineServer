"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.EnvironmentVariables = {
    PORT: process.env.PORT,
    MONGODB_STRING: process.env.LIVE_URL,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GOOGLE_REFRESHTOKEN: process.env.GOOGLE_REFRESHTOKEN,
    GOOGLE_REDIRECT: process.env.GOOGLE_REDIRECT,
    Verification_URL: process.env.Verification_URL,
};
