import express from "express";
import {
  Get5RecentRequests,
  GetAllRequests,
} from "../Controllers/RequestController";

const RequestRouter = express.Router();

// Get all requests in the database::
RequestRouter.route("/all-requests").get(GetAllRequests);

// Get the 5 recent requests for the director's dashboard:
RequestRouter.route("/recent-requests").get(Get5RecentRequests);
