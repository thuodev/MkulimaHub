import Joi from "joi";

export const createFieldSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  size: Joi.number().positive().allow(null),
  sizeUnit: Joi.string().max(20),
  currentCrop: Joi.string().max(100).allow("", null),
});

export const updateFieldSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  size: Joi.number().positive().allow(null),
  sizeUnit: Joi.string().max(20),
  currentCrop: Joi.string().max(100).allow("", null),
});
