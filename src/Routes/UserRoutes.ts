import express from "express";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/UserValidation/UserValidation";

import {
  GetAllUsers,
  GetSingleUser,
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

export default UserRouter;
