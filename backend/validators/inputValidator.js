import Joi from "joi";

export const createInputSchema = Joi.object({
  categoryId: Joi.number().integer().allow(null),
  name: Joi.string().min(1).max(100).required(),
  unitOfMeasure: Joi.string().min(1).max(20).required(),
});

export const createTransactionSchema = Joi.object({
  fieldId: Joi.number().integer().allow(null),
  type: Joi.string().valid("in", "out").required(),
  quantity: Joi.number().positive().required(),
  cost: Joi.number().min(0).allow(null),
  date: Joi.date().allow(null),
  notes: Joi.string().max(500).allow("", null),
});
