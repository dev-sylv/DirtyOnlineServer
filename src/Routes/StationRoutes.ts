import express from "express";

import {
  GetAllStations,
  GetOneMalam,
  GetOneStation,
  GetStationRequests,
  StationAssignMalam,
  StationCreatesMalam,
  StationLogin,
  ViewAllMalams,
} from "../Controllers/StationController";

const StationRouter = express.Router();

// Register malams:
StationRouter.route("/registermalam/:stationID").post(StationCreatesMalam);

// Station assigning tasks to malams:
StationRouter.route(
  "/assign-malam/:stationID/:userID/:malamID/:CurrentrequestID"
).patch(StationAssignMalam);

// Get a single malam:
StationRouter.route("/malam/:malamID").get(GetOneMalam);

// View all malams:
StationRouter.route("/all-malams").get(ViewAllMalams);

// Get All Stations:
StationRouter.route("/all-stations").get(GetAllStations);

// Get One Stations:
StationRouter.route("/all-stations/:stationID").get(GetOneStation);

// Station login:
StationRouter.route("/login-station").post(StationLogin);

// Get Station requests:
StationRouter.route("/station/:stationID/requests").get(GetStationRequests);

export default StationRouter;
