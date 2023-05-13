"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequestSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const RequestModels = (0, mongoose_1.model)("Requests", RequestSchema);
exports.default = RequestModels;
