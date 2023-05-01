"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const StationSchema = new mongoose_1.Schema({
    station: {
        type: String,
        required: [true, "Please enter your  station name"],
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
    address: {
        type: String,
        required: [true, "Please confirm your password"],
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
    },
    users: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Users",
        },
    ],
    requests: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Requests",
        },
    ],
    specialRequests: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Requests",
        },
    ],
    transactionHistory: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Transaction Histories",
        },
    ],
    malams: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Malams",
        },
    ],
    feedbacks: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Requests",
        },
    ],
}, {
    timestamps: true,
});
const StationModels = (0, mongoose_1.model)("Stations", StationSchema);
exports.default = StationModels;
