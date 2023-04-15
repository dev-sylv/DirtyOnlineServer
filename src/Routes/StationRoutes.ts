import express from "express";

import {
  StationAssignMalam,
  StationCreatesMalam,
} from "../Controllers/StationController";

const StationRouter = express.Router();

// Register malams:
StationRouter.route("/registermalam/:stationID").post(StationCreatesMalam);

// Station assigning tasks to malams:
StationRouter.route("/assign-malam/:stationID/:malamID/:requestID").patch(
  StationAssignMalam
);

export default StationRouter;
