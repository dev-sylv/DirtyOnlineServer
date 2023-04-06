import { RequestHandler } from "express";
import { UserSchemaValidation } from "./UserSchemaValidation";
import { Validator } from "../Validator";

export const UserRegisterValidation: RequestHandler = (req, res, next) =>
  Validator(UserSchemaValidation.Register, req.body, next);

export const UserLoginValidation: RequestHandler = (req, res, next) =>
  Validator(UserSchemaValidation.Login, req.body, next);
