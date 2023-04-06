import Joi from "joi";

export const AgentSchemaValidation = {
  Register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    LGA: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
  Login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
