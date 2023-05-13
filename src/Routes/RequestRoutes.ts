import express from "express";
import {
  Get5RecentRequests,
  GetAllRequests,
  ViewAllCustomRequests,
} from "../Controllers/RequestController";

const RequestRouter = express.Router();

// Get all requests in the database:
RequestRouter.route("/all-requests").get(GetAllRequests);

// Get the 5 recent requests for the director's dashboard:
RequestRouter.route("/recent-requests").get(Get5RecentRequests);

// Get all custom requests in the database::
RequestRouter.route("/all-custom-requests").get(ViewAllCustomRequests);

export default RequestRouter;
