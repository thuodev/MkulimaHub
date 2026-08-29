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

export const addInput = async (req, res) => {
  try {
    const { categoryId, name, unitOfMeasure } = req.body;
    if (!name || !unitOfMeasure) {
      return res
        .status(400)
        .json({ error: "name and unitOfMeasure are required" });
    }
    const input = await createInput(
      req.params.farmId,
      categoryId,
      name,
      unitOfMeasure,
    );
    res.status(201).json(input);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create input" });
  }
};

export const listInputs = async (req, res) => {
  try {
    const inputs = await getInputsForFarm(req.params.farmId);
    res.json(inputs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inputs" });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { fieldId, type, quantity, cost, date, notes } = req.body;
    if (!type || !quantity) {
      return res.status(400).json({ error: "type and quantity are required" });
    }
    if (!["in", "out"].includes(type)) {
      return res.status(400).json({ error: "type must be 'in' or 'out'" });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record transaction" });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsForInput(
      req.params.farmId,
      req.params.inputId,
    );
    const balance = await getInputBalance(
      req.params.farmId,
      req.params.inputId,
    );
    res.json({ balance, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
