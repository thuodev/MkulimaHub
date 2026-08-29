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

export const addLivestock = async (req, res) => {
  try {
    const { fieldId, type, species, tagId, birthDate, sex, quantity } =
      req.body;

    if (!type || !species) {
      return res.status(400).json({ error: "type and species are required" });
    }
    if (!["individual", "batch"].includes(type)) {
      return res
        .status(400)
        .json({ error: "type must be 'individual' or 'batch'" });
    }
    if (type === "batch" && !quantity) {
      return res
        .status(400)
        .json({ error: "quantity is required for batch records" });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create livestock record" });
  }
};

export const listLivestock = async (req, res) => {
  try {
    const records = await getLivestockForFarm(req.params.farmId);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch livestock" });
  }
};

export const getLivestock = async (req, res) => {
  try {
    const record = await getLivestockById(
      req.params.farmId,
      req.params.recordId,
    );
    if (!record)
      return res.status(404).json({ error: "Livestock record not found" });

    if (record.type === "batch") {
      record.current_quantity = await getCurrentBatchQuantity(
        req.params.farmId,
        record.id,
      );
    }
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch livestock record" });
  }
};

export const addEvent = async (req, res) => {
  try {
    const { eventType, eventDate, quantityChange, weight, value, notes } =
      req.body;
    if (!eventType) {
      return res.status(400).json({ error: "eventType is required" });
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
      return res
        .status(400)
        .json({ error: `eventType must be one of: ${validTypes.join(", ")}` });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record event" });
  }
};

export const listEvents = async (req, res) => {
  try {
    const events = await getEventsForRecord(
      req.params.farmId,
      req.params.recordId,
    );
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
