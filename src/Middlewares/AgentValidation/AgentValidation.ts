import { RequestHandler } from "express";
import { AgentSchemaValidation } from "./AgentSchemaValidation";
import { Validator } from "../Validator";

export const AgentRegisterValidation: RequestHandler = (req, res, next) =>
  Validator(AgentSchemaValidation.Register, req.body, next);

export const AgentLoginValidation: RequestHandler = (req, res, next) =>
  Validator(AgentSchemaValidation.Login, req.body, next);
