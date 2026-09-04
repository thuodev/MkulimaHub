import Joi from "joi";

export const createFarmSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  location: Joi.string().max(150).allow("", null),
  totalSize: Joi.number().positive().allow(null),
  sizeUnit: Joi.string().max(20),
});

export const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("owner", "manager", "worker").required(),
});
