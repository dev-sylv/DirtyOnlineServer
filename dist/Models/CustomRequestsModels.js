"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequestSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const CustomRequestModels = (0, mongoose_1.model)("Special Requests", RequestSchema);
exports.default = CustomRequestModels;
