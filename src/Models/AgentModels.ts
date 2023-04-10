import mongoose, { Schema, model } from "mongoose";

import { AgentDetails } from "../Interfaces/AllInterfaces";

import isEmail from "validator/lib/isEmail";

const AgentSchema: Schema<AgentDetails> = new Schema(
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
    role: {
      type: String,
      required: [true, "Please enter your role"],
      message: "You can be either User, Malam or Agents",
      enum: ["User", "Malam", "Agent"],
      default: "Agent",
    },
  },
  {
    timestamps: true,
  }
);

const AgentModels = model<AgentDetails>("Agents", AgentSchema);

export default AgentModels;
