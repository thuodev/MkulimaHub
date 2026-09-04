import Joi from "joi";

export const createStockItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string().max(50).allow("", null),
  unitOfMeasure: Joi.string().min(1).max(20).required(),
});

export const createMovementSchema = Joi.object({
  type: Joi.string().valid("in", "out").required(),
  quantity: Joi.number().positive().required(),
  reason: Joi.string().max(500).allow("", null),
  date: Joi.date().allow(null),
});
