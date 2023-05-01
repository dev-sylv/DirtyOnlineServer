"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RequestController_1 = require("../Controllers/RequestController");
const RequestRouter = express_1.default.Router();
// Get all requests in the database::
RequestRouter.route("/all-requests").get(RequestController_1.GetAllRequests);
// Get the 5 recent requests for the director's dashboard:
RequestRouter.route("/recent-requests").get(RequestController_1.Get5RecentRequests);
// Get all custom requests in the database::
RequestRouter.route("/all-custom-requests").get(RequestController_1.ViewAllCustomRequests);
exports.default = RequestRouter;
