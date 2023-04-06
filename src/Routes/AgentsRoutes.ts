import express from "express";

import {
  AgentRegisterValidation,
  AgentLoginValidation,
} from "../Middlewares/AgentValidation/AgentValidation";

import {
  AgentsLogin,
  AgentsRegistration,
} from "../Controllers/AgentControllers";

const AgentRouter = express.Router();

AgentRouter.route("/register-agents").post(
  AgentRegisterValidation,
  AgentsRegistration
);
AgentRouter.route("/login-agents").post(AgentLoginValidation, AgentsLogin);

export default AgentRouter;
