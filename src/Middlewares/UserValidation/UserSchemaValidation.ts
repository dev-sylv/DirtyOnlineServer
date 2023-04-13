import Joi from "joi";

export const UserSchemaValidation = {
  Register: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    address: Joi.string().required(),
    password: Joi.string().min(8).required(),
    stationName: Joi.string().required(),
  }),
  Login: Joi.object({
    phoneNumber: Joi.number().required(),
    password: Joi.string().min(8).required(),
  }),
};
