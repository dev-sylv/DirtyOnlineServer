"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const MalamSchema = new mongoose_1.Schema({
    name: {
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
    image: {
        type: String,
    },
    uniqueID: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    dateTime: {
        type: String,
    },
    status: {
        type: String,
        required: [true, "Please enter your status"],
        message: "Malaam can be free or on duty",
        enum: ["Free", "On-duty"],
        default: "Free",
    },
    role: {
        type: String,
        required: [true, "Please enter your role"],
        message: "You can be either User or Malam",
        enum: ["User", "Malam"],
        default: "Malam",
    },
}, {
    timestamps: true,
});
const MalamModels = (0, mongoose_1.model)("Malams", MalamSchema);
exports.default = MalamModels;
