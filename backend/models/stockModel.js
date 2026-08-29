import pool from "../config/db.js";

export const createStockItem = async (
  farmId,
  name,
  category,
  unitOfMeasure,
) => {
  const result = await pool.query(
    `INSERT INTO stock_items (farm_id, name, category, unit_of_measure)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [farmId, name, category || null, unitOfMeasure],
  );
  return result.rows[0];
};

export const getStockItemsForFarm = async (farmId) => {
  const result = await pool.query(
    `SELECT * FROM stock_items WHERE farm_id = $1 ORDER BY created_at DESC`,
    [farmId],
  );
  return result.rows;
};
