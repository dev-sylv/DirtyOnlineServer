import { Schema, model } from "mongoose";

import { MalamDetails } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const MalamSchema: Schema<MalamDetails> = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const MalamModels = model<MalamDetails>("Malams", MalamSchema);

export default MalamModels;
