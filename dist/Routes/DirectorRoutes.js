"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DirectorController_1 = require("../Controllers/DirectorController");
const DirectorRouter = express_1.default.Router();
//Get director
DirectorRouter.route("/getdir").get(DirectorController_1.GetDirector);
// Register director:
DirectorRouter.route("/register-director").post(DirectorController_1.DirectorRegistration);
// Login director:
DirectorRouter.route("/login-director").post(DirectorController_1.DirectorLogin);
// Create a station:
DirectorRouter.route("/new-station/:directorID").post(DirectorController_1.DirectorCreatesStation);
exports.default = DirectorRouter;
