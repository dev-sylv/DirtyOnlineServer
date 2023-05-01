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
const DirectorSchema = new mongoose_1.Schema({
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
    phoneNumber: {
        type: Number,
    },
    accountDetails: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
    },
    role: {
        type: String,
        required: [true, "Please enter your role"],
        message: "You can be either User or Manager",
        enum: ["User", "Director"],
        default: "Director",
    },
    stations: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Stations",
        },
    ],
    users: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Users",
        },
    ],
    isVerified: {
        type: Boolean,
    },
}, {
    timestamps: true,
});
const DirectorModels = (0, mongoose_1.model)("Director", DirectorSchema);
exports.default = DirectorModels;
