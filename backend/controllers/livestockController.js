import {
  createLivestockRecord,
  getLivestockForFarm,
  getLivestockById,
  getCurrentBatchQuantity,
} from "../models/livestockModel.js";
import {
  createEvent,
  getEventsForRecord,
} from "../models/livestockEventModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const addLivestock = asyncHandler(async (req, res) => {
  const { fieldId, type, species, tagId, birthDate, sex, quantity } = req.body;

  if (!type || !species) {
    throw new AppError("type and species are required", 400);
  }
  if (!["individual", "batch"].includes(type)) {
    throw new AppError("type must be 'individual' or 'batch'", 400);
  }
  if (type === "batch" && !quantity) {
    throw new AppError("quantity is required for batch records", 400);
  }

  const record = await createLivestockRecord(req.params.farmId, {
    fieldId,
    type,
    species,
    tagId,
    birthDate,
    sex,
    quantity,
  });
  res.status(201).json(record);
});

export const listLivestock = asyncHandler(async (req, res) => {
  const records = await getLivestockForFarm(req.params.farmId);
  res.json(records);
});

export const getLivestock = asyncHandler(async (req, res) => {
  const record = await getLivestockById(req.params.farmId, req.params.recordId);
  if (!record) throw new AppError("Livestock record not found", 404);

  if (record.type === "batch") {
    record.current_quantity = await getCurrentBatchQuantity(
      req.params.farmId,
      record.id,
    );
  }
  res.json(record);
});

export const addEvent = asyncHandler(async (req, res) => {
  const { eventType, eventDate, quantityChange, weight, value, notes } =
    req.body;
  if (!eventType) {
    throw new AppError("eventType is required", 400);
  }
  const validTypes = [
    "birth",
    "death",
    "sale",
    "purchase",
    "vet_visit",
    "weight_check",
    "quantity_adjustment",
  ];
  if (!validTypes.includes(eventType)) {
    throw new AppError(
      `eventType must be one of: ${validTypes.join(", ")}`,
      400,
    );
  }

  const event = await createEvent(req.params.farmId, req.params.recordId, {
    eventType,
    eventDate,
    quantityChange,
    weight,
    value,
    notes,
  });
  res.status(201).json(event);
});

export const listEvents = asyncHandler(async (req, res) => {
  const events = await getEventsForRecord(
    req.params.farmId,
    req.params.recordId,
  );
  res.json(events);
});
