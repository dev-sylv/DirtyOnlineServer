import Joi from "joi";

export const UserSchemaValidation = {
  Register: Joi.object({
    Username: Joi.string().required(),
    LGA: Joi.string().required(),
    Phoneno: Joi.number().required(),
    address: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
  Login: Joi.object({
    Username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};
