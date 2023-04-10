import express from "express";

import {
  GetAllMalams,
  GetSingleMalams,
  MalamLogin,
  MalamRegistration,
} from "../Controllers/MalamControllers";

const MalamRouter = express.Router();

// Register Malams:
MalamRouter.route("/register-malam").post(MalamRegistration);

// Login Malams:
MalamRouter.route("/login-malam").post(MalamLogin);

// Get all Malams
MalamRouter.route("/getmalams").get(GetAllMalams);

// Get single Malams:
MalamRouter.route("/getmalam/:malamID").get(GetSingleMalams);

export default MalamRouter;
