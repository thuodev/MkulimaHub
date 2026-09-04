import {
  createField,
  getFieldsForFarm,
  getFieldById,
  updateField,
  deleteField,
} from "../models/fieldModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const addField = asyncHandler(async (req, res) => {
  const { name, size, sizeUnit, currentCrop } = req.body;
  if (!name) {
    throw new AppError("name is required", 400);
  }
  const field = await createField(
    req.params.farmId,
    name,
    size,
    sizeUnit,
    currentCrop,
  );
  res.status(201).json(field);
});

export const listFields = asyncHandler(async (req, res) => {
  const fields = await getFieldsForFarm(req.params.farmId);
  res.json(fields);
});

export const getField = asyncHandler(async (req, res) => {
  const field = await getFieldById(req.params.farmId, req.params.fieldId);
  if (!field) throw new AppError("Field not found", 404);
  res.json(field);
});

export const editField = asyncHandler(async (req, res) => {
  const field = await updateField(
    req.params.farmId,
    req.params.fieldId,
    req.body,
  );
  if (!field) throw new AppError("Field not found", 404);
  res.json(field);
});

export const removeField = asyncHandler(async (req, res) => {
  const deleted = await deleteField(req.params.farmId, req.params.fieldId);
  if (!deleted) throw new AppError("Field not found", 404);
  res.status(204).send();
});
