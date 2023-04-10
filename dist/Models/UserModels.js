"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    username: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail_1.default, "Please enter a valid email"],
    },
    phoneNumber: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
    },
    dateTime: {
        type: String,
    },
    LGA: {
        type: String,
        required: [true, "Please confirm your password"],
    },
    address: {
        type: String,
        required: [true, "Please confirm your password"],
    },
}, {
    timestamps: true,
});
const UserModels = (0, mongoose_1.model)("Users", UserSchema);
exports.default = UserModels;
