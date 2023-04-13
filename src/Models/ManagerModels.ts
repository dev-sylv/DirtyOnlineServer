import mongoose, { Schema, model } from "mongoose";

import { ManagerDetails } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const DirectorSchema = new Schema(
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
        type: mongoose.Types.ObjectId,
        ref: "Stations",
      },
    ],
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
    isVerified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const DirectorModels = model<ManagerDetails>("Director", DirectorSchema);

export default DirectorModels;
