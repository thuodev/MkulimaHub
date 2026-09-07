import {
  createInput,
  getInputsForFarm,
  getCategories,
} from "../models/inputModel.js";
import {
  createTransaction,
  getTransactionsForInput,
  getInputBalance,
} from "../models/inputTransactionModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { getPagination, buildPaginatedResponse } from "../utils/pagination.js";

export const addInput = asyncHandler(async (req, res) => {
  const { categoryId, name, unitOfMeasure } = req.body;
  if (!name || !unitOfMeasure) {
    throw new AppError("name and unitOfMeasure are required", 400);
  }
  const input = await createInput(
    req.params.farmId,
    categoryId,
    name,
    unitOfMeasure,
  );
  res.status(201).json(input);
});

export const listInputs = asyncHandler(async (req, res) => {
  const { limit, offset, page } = getPagination(req.query);
  const { categoryId } = req.query;

  const { rows, totalCount } = await getInputsForFarm(req.params.farmId, {
    limit,
    offset,
    categoryId,
  });
  res.json(buildPaginatedResponse(rows, totalCount, page, limit));
});

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  res.json(categories);
});

export const addTransaction = asyncHandler(async (req, res) => {
  const { fieldId, type, quantity, cost, date, notes } = req.body;
  if (!type || !quantity) {
    throw new AppError("type and quantity are required", 400);
  }
  if (!["in", "out"].includes(type)) {
    throw new AppError("type must be 'in' or 'out'", 400);
  }

  const transaction = await createTransaction(
    req.params.farmId,
    req.params.inputId,
    fieldId,
    type,
    quantity,
    cost,
    date,
    notes,
  );
  res.status(201).json(transaction);
});

export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await getTransactionsForInput(
    req.params.farmId,
    req.params.inputId,
  );
  const balance = await getInputBalance(req.params.farmId, req.params.inputId);
  res.json({ balance, transactions });
});
