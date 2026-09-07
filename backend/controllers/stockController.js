import { createStockItem, getStockItemsForFarm } from "../models/stockModel.js";
import {
  createMovement,
  getMovementsForStockItem,
  getStockBalance,
} from "../models/stockMovementModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { getPagination, buildPaginatedResponse } from "../utils/pagination.js";

export const addStockItem = asyncHandler(async (req, res) => {
  const { name, category, unitOfMeasure } = req.body;
  if (!name || !unitOfMeasure) {
    throw new AppError("name and unitOfMeasure are required", 400);
  }
  const item = await createStockItem(
    req.params.farmId,
    name,
    category,
    unitOfMeasure,
  );
  res.status(201).json(item);
});

export const listStockItems = asyncHandler(async (req, res) => {
  const { limit, offset, page } = getPagination(req.query);
  const { category } = req.query;

  const { rows, totalCount } = await getStockItemsForFarm(req.params.farmId, {
    limit,
    offset,
    category,
  });
  res.json(buildPaginatedResponse(rows, totalCount, page, limit));
});

export const addMovement = asyncHandler(async (req, res) => {
  const { type, quantity, reason, date } = req.body;
  if (!type || !quantity) {
    throw new AppError("type and quantity are required", 400);
  }
  if (!["in", "out"].includes(type)) {
    throw new AppError("type must be 'in' or 'out'", 400);
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
});

export const listMovements = asyncHandler(async (req, res) => {
  const movements = await getMovementsForStockItem(
    req.params.farmId,
    req.params.stockItemId,
  );
  const balance = await getStockBalance(
    req.params.farmId,
    req.params.stockItemId,
  );
  res.json({ balance, movements });
});
