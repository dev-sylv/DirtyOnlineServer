import mongoose, { Schema, model } from "mongoose";

import { UserDetails } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const UserSchema: Schema<UserDetails> = new Schema(
  {
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
      validate: [isEmail, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Please confirm your password"],
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
    },
    dateTime: {
      type: String,
    },
    role: {
      type: String,
      required: [true, "Please enter your role"],
      message: "You can be either User, Malam or Manager",
      enum: ["User", "Malam", "Manager"],
      default: "User",
    },
    station: {
      type: mongoose.Types.ObjectId,
      ref: "Stations",
    },
    numberOfRequests: {
      type: Number,
    },
    makeRequests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Requests",
      },
    ],
    specialRequests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Requests",
      },
    ],
    RequestHistories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Requests",
      },
    ],
    transactionHistory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Transaction Histories",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserModels = model<UserDetails>("Users", UserSchema);

export default UserModels;
