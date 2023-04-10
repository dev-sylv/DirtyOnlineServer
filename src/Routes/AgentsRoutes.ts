import express from "express";

import {
  AgentRegisterValidation,
  AgentLoginValidation,
} from "../Middlewares/AgentValidation/AgentValidation";

import {
  AgentsLogin,
  AgentsRegistration,
  GetAllAgent,
  GetSingleAgent,
} from "../Controllers/AgentControllers";

const AgentRouter = express.Router();

// Register an agent
AgentRouter.route("/register-agents").post(
  AgentRegisterValidation,
  AgentsRegistration
);

// Agent login
AgentRouter.route("/login-agents").post(AgentLoginValidation, AgentsLogin);
// Get all agents
AgentRouter.route("/getallagents").get(GetAllAgent);
// Get single agent
AgentRouter.route("/getallagents/:agentID").get(GetSingleAgent);

export default AgentRouter;
