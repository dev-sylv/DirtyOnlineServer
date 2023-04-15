import express from "express";
import { StationCreatesMalam } from "../Controllers/StationController";

const StationRouter = express.Router();

// Register users:
StationRouter.route("/registermalam/:stationID").post(StationCreatesMalam);

export default StationRouter;
