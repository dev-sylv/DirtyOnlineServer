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

AgentRouter.route("/register-agents").post(
  AgentRegisterValidation,
  AgentsRegistration
);
AgentRouter.route("/login-agents").post(AgentLoginValidation, AgentsLogin);
AgentRouter.route("/getallagents").get(GetAllAgent);
AgentRouter.route("/getallagents/:agentID").get(GetSingleAgent);

export default AgentRouter;
