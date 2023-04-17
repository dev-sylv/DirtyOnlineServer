"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserValidation_1 = require("../Middlewares/UserValidation/UserValidation");
const UserControllers_1 = require("../Controllers/UserControllers");
const UserRouter = express_1.default.Router();
// Register users:
UserRouter.route("/registeruser").post(UserValidation_1.UserRegisterValidation, UserControllers_1.UsersRegistration);
// Login users:
UserRouter.route("/loginuser").post(UserValidation_1.UserLoginValidation, UserControllers_1.UsersLogin);
// Get all users
UserRouter.route("/getuser").get(UserControllers_1.GetAllUsers);
// Get single users:
UserRouter.route("/getuser/:userID").get(UserControllers_1.GetSingleUser);
// User makes a request:
UserRouter.route("/make-request/:userID/:stationID").patch(UserControllers_1.UserMakesARequest);
//User closes Request
UserRouter.route("/close-request/:userID/:malamID/:requestID/:stationID").patch(UserControllers_1.UserClosesARequest);
exports.default = UserRouter;
