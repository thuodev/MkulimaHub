import pool from "../config/db.js";

export const createTransaction = async (
  farmId,
  inputId,
  fieldId,
  type,
  quantity,
  cost,
  date,
  notes,
) => {
  const result = await pool.query(
    `INSERT INTO input_transactions (input_id, farm_id, field_id, type, quantity, cost, transaction_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, CURRENT_DATE), $8)
     RETURNING *`,
    [
      inputId,
      farmId,
      fieldId || null,
      type,
      quantity,
      cost || null,
      date || null,
      notes || null,
    ],
  );
  return result.rows[0];
};

export const getTransactionsForInput = async (farmId, inputId) => {
  const result = await pool.query(
    `SELECT * FROM input_transactions
     WHERE farm_id = $1 AND input_id = $2
     ORDER BY transaction_date DESC`,
    [farmId, inputId],
  );
  return result.rows;
};

// Running balance for an input: sum(in) - sum(out)
export const getInputBalance = async (farmId, inputId) => {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END), 0) AS balance
     FROM input_transactions
     WHERE farm_id = $1 AND input_id = $2`,
    [farmId, inputId],
  );
  return Number(result.rows[0].balance);
};
