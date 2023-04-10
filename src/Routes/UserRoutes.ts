import express from "express";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/UserValidation/UserValidation";

const UserRouter = express.Router();

// Register users:
UserRouter.route("/registeruser").post(UserRegisterValidation);
UserRouter.route("/user/:userID/history").get(GetSingleUserHistory);
UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);
UserRouter.route("/getsingleuser/:userID").get(GetSingleUser);
UserRouter.route("/buyagiftcard/:userID/:businessID/:giftcardID").post(
  UserBuyAGiftCardWithATMcard
);

export default UserRouter;
