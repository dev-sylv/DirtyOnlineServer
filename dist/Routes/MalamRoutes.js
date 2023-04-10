"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MalamControllers_1 = require("../Controllers/MalamControllers");
const MalamRouter = express_1.default.Router();
// Register Malams:
MalamRouter.route("/register-malam").post(MalamControllers_1.MalamRegistration);
// Login Malams:
MalamRouter.route("/login-malam").post(MalamControllers_1.MalamLogin);
// Get all Malams
MalamRouter.route("/getmalams").get(MalamControllers_1.GetAllMalams);
// Get single Malam:
MalamRouter.route("/getmalam/:malamID").get(MalamControllers_1.GetSingleMalams);
exports.default = MalamRouter;
