import express from "express";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/UserValidation/UserValidation";

import {
  GetAllUsers,
  GetSingleUser,
  UserClosesARequest,
  UserMakesARequest,
  UsersLogin,
  UsersRegistration,
} from "../Controllers/UserControllers";

const UserRouter = express.Router();

// Register users:
UserRouter.route("/registeruser").post(
  UserRegisterValidation,
  UsersRegistration
);

// Login users:
UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);

// Get all users
UserRouter.route("/getuser").get(GetAllUsers);

// Get single users:
UserRouter.route("/getuser/:userID").get(GetSingleUser);

// User makes a request:
UserRouter.route("/make-request/:userID/:stationID").patch(UserMakesARequest);

//User closes Request
UserRouter.route("/close-request/:malamID/:requestID/:stationID").patch(
  UserClosesARequest
);

export default UserRouter;
