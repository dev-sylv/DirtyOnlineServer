"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StationController_1 = require("../Controllers/StationController");
const StationRouter = express_1.default.Router();
// Register malams:
StationRouter.route("/registermalam/:stationID").post(StationController_1.StationCreatesMalam);
// Station assigning tasks to malams:
StationRouter.route("/assign-malam/:stationID/:malamID/:CurrentrequestID").patch(StationController_1.StationAssignMalam);
// Get a single malam:
StationRouter.route("/malam/:malamID").get(StationController_1.GetOneMalam);
// Get All Stations:
StationRouter.route("/all-stations").get(StationController_1.GetAllStations);
// Get One Stations:
StationRouter.route("/all-stations/:stationID").get(StationController_1.GetOneStation);
exports.default = StationRouter;
