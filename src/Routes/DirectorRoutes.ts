import express from "express";
import {
  DirectorCreatesStation,
  DirectorLogin,
  DirectorRegistration,
  GetDirector,
} from "../Controllers/DirectorController";

const DirectorRouter = express.Router();

//Get director
DirectorRouter.route("/getdir").get(GetDirector);
// Register director:
DirectorRouter.route("/register-director").post(DirectorRegistration);
// Login director:
DirectorRouter.route("/login-director").post(DirectorLogin);
// Create a station:
DirectorRouter.route("/new-station").post(DirectorCreatesStation);

export default DirectorRouter;
