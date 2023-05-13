import mongoose, { Schema, model } from "mongoose";

import { requestInterface } from "../Interfaces/AllInterfaces";

const RequestSchema = new Schema(
  {
    user: {
      type: String,
    },
    address: {
      type: String,
    },
    requestMessage: {
      type: String,
    },
    requestStatus: {
      type: Boolean,
      default: false,
    },
    assigned: {
      type: Boolean,
      default: false,
    },
    DoneBy: {
      type: String,
    },
    Pending: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RequestModels = model<requestInterface>("Requests", RequestSchema);

export default RequestModels;
