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

export const getStockItemsForFarm = async (
  farmId,
  { limit, offset, category },
) => {
  const conditions = ["farm_id = $1"];
  const params = [farmId];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  const whereClause = conditions.join(" AND ");
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM stock_items WHERE ${whereClause}`,
    params,
  );

  params.push(limit, offset);
  const rowResult = await pool.query(
    `SELECT * FROM stock_items WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return {
    rows: rowResult.rows,
    totalCount: Number(countResult.rows[0].count),
  };
};
