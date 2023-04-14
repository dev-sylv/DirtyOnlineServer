import Joi from "joi";

export const UserSchemaValidation = {
  Register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    password: Joi.string().min(8).required(),
    stationName: Joi.string().required(),
  }),
  Login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
