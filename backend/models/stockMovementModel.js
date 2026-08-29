import pool from "../config/db.js";

export const createMovement = async (
  farmId,
  stockItemId,
  type,
  quantity,
  reason,
  date,
) => {
  const result = await pool.query(
    `INSERT INTO stock_movements (stock_item_id, farm_id, type, quantity, reason, movement_date)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
     RETURNING *`,
    [stockItemId, farmId, type, quantity, reason || null, date || null],
  );
  return result.rows[0];
};

export const getMovementsForStockItem = async (farmId, stockItemId) => {
  const result = await pool.query(
    `SELECT * FROM stock_movements
     WHERE farm_id = $1 AND stock_item_id = $2
     ORDER BY movement_date DESC`,
    [farmId, stockItemId],
  );
  return result.rows;
};

export const getStockBalance = async (farmId, stockItemId) => {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END), 0) AS balance
     FROM stock_movements
     WHERE farm_id = $1 AND stock_item_id = $2`,
    [farmId, stockItemId],
  );
  return Number(result.rows[0].balance);
};
