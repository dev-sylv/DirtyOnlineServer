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
    uniqueID: {
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
  },
  {
    timestamps: true,
  }
);

const MalamModels = model<MalamDetails>("Malams", MalamSchema);

export default MalamModels;
