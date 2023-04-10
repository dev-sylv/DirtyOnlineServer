import { Schema, model } from "mongoose";

import { UserDetails } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const UserSchema: Schema<UserDetails> = new Schema(
  {
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
      validate: [isEmail, "Please enter a valid email"],
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
  },
  {
    timestamps: true,
  }
);

const UserModels = model<UserDetails>("Users", UserSchema);

export default UserModels;
