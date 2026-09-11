import Joi from "joi";

export const createLivestockSchema = Joi.object({
  fieldId: Joi.string().guid().allow(null),
  type: Joi.string().valid("individual", "batch").required(),
  species: Joi.string().min(1).max(50).required(),
  tagId: Joi.string().max(50).allow("", null),
  birthDate: Joi.date().allow(null),
  sex: Joi.string().valid("male", "female").allow(null),
  quantity: Joi.number().integer().positive().when("type", {
    is: "batch",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

export const createEventSchema = Joi.object({
  eventType: Joi.string()
    .valid(
      "birth",
      "death",
      "sale",
      "purchase",
      "vet_visit",
      "weight_check",
      "quantity_adjustment",
    )
    .required(),
  eventDate: Joi.date().allow(null),
  quantityChange: Joi.number().integer().allow(null),
  weight: Joi.number().positive().allow(null),
  value: Joi.number().min(0).allow(null),
  notes: Joi.string().max(500).allow("", null),
});
