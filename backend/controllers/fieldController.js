import {
  createField,
  getFieldsForFarm,
  getFieldById,
  updateField,
  deleteField,
} from "../models/fieldModel.js";

export const addField = async (req, res) => {
  try {
    const { name, size, sizeUnit, currentCrop } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    const field = await createField(
      req.params.farmId,
      name,
      size,
      sizeUnit,
      currentCrop,
    );
    res.status(201).json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create field" });
  }
};

export const listFields = async (req, res) => {
  try {
    const fields = await getFieldsForFarm(req.params.farmId);
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fields" });
  }
};

export const getField = async (req, res) => {
  try {
    const field = await getFieldById(req.params.farmId, req.params.fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });
    res.json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch field" });
  }
};

export const editField = async (req, res) => {
  try {
    const field = await updateField(
      req.params.farmId,
      req.params.fieldId,
      req.body,
    );
    if (!field) return res.status(404).json({ error: "Field not found" });
    res.json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update field" });
  }
};

export const removeField = async (req, res) => {
  try {
    const deleted = await deleteField(req.params.farmId, req.params.fieldId);
    if (!deleted) return res.status(404).json({ error: "Field not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete field" });
  }
};
