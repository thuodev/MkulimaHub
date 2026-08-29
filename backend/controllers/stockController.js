import { createStockItem, getStockItemsForFarm } from "../models/stockModel.js";
import {
  createMovement,
  getMovementsForStockItem,
  getStockBalance,
} from "../models/stockMovementModel.js";

export const addStockItem = async (req, res) => {
  try {
    const { name, category, unitOfMeasure } = req.body;
    if (!name || !unitOfMeasure) {
      return res
        .status(400)
        .json({ error: "name and unitOfMeasure are required" });
    }
    const item = await createStockItem(
      req.params.farmId,
      name,
      category,
      unitOfMeasure,
    );
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create stock item" });
  }
};

export const listStockItems = async (req, res) => {
  try {
    const items = await getStockItemsForFarm(req.params.farmId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock items" });
  }
};

export const addMovement = async (req, res) => {
  try {
    const { type, quantity, reason, date } = req.body;
    if (!type || !quantity) {
      return res.status(400).json({ error: "type and quantity are required" });
    }
    if (!["in", "out"].includes(type)) {
      return res.status(400).json({ error: "type must be 'in' or 'out'" });
    }
    const movement = await createMovement(
      req.params.farmId,
      req.params.stockItemId,
      type,
      quantity,
      reason,
      date,
    );
    res.status(201).json(movement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record movement" });
  }
};

export const listMovements = async (req, res) => {
  try {
    const movements = await getMovementsForStockItem(
      req.params.farmId,
      req.params.stockItemId,
    );
    const balance = await getStockBalance(
      req.params.farmId,
      req.params.stockItemId,
    );
    res.json({ balance, movements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movements" });
  }
};
