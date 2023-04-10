"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentLoginValidation = exports.AgentRegisterValidation = void 0;
const AgentSchemaValidation_1 = require("./AgentSchemaValidation");
const Validator_1 = require("../Validator");
const AgentRegisterValidation = (req, res, next) => (0, Validator_1.Validator)(AgentSchemaValidation_1.AgentSchemaValidation.Register, req.body, next);
exports.AgentRegisterValidation = AgentRegisterValidation;
const AgentLoginValidation = (req, res, next) => (0, Validator_1.Validator)(AgentSchemaValidation_1.AgentSchemaValidation.Login, req.body, next);
exports.AgentLoginValidation = AgentLoginValidation;
