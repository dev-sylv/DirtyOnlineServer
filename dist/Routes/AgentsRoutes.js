"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AgentValidation_1 = require("../Middlewares/AgentValidation/AgentValidation");
const AgentControllers_1 = require("../Controllers/AgentControllers");
const AgentRouter = express_1.default.Router();
// Register an agent
AgentRouter.route("/register-agents").post(AgentValidation_1.AgentRegisterValidation, AgentControllers_1.AgentsRegistration);
// Agent login
AgentRouter.route("/login-agents").post(AgentValidation_1.AgentLoginValidation, AgentControllers_1.AgentsLogin);
// Get all agents
AgentRouter.route("/getallagents").get(AgentControllers_1.GetAllAgent);
// Get single agent
AgentRouter.route("/getallagents/:agentID").get(AgentControllers_1.GetSingleAgent);
exports.default = AgentRouter;
