import mongoose, { Schema, model } from "mongoose";

import { requestInterface } from "../Interfaces/AllInterfaces";

const RequestSchema = new Schema(
  {
    requestMessage: {
      type: String,
    },
    requestStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RequestModels = model<requestInterface>("Requests", RequestSchema);

export default RequestModels;
