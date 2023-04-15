import mongoose, { Schema, model } from "mongoose";

import { stationInterface } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const StationSchema = new Schema(
  {
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
      validate: [isEmail, "Please enter a valid email"],
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
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
    requests: [
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
    malams: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Malams",
      },
    ],
    feedbacks: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StationModels = model<stationInterface>("Stations", StationSchema);

export default StationModels;
