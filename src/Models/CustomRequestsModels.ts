import { Schema, model } from "mongoose";

import { requestInterface } from "../Interfaces/AllInterfaces";

const RequestSchema = new Schema(
  {
    requestMessage: {
      type: String,
    },
    requestType: {
      type: String,
      default: "Custom Requests",
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

const CustomRequestModels = model<requestInterface>(
  "Special Requests",
  RequestSchema
);

export default CustomRequestModels;
