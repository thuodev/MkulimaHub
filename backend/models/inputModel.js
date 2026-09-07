import pool from "../config/db.js";

export const createInput = async (farmId, categoryId, name, unitOfMeasure) => {
  const result = await pool.query(
    `INSERT INTO inputs (farm_id, category_id, name, unit_of_measure)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [farmId, categoryId || null, name, unitOfMeasure],
  );
  return result.rows[0];
};

export const getInputsForFarm = async (
  farmId,
  { limit, offset, categoryId },
) => {
  const conditions = ["farm_id = $1"];
  const params = [farmId];

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`category_id = $${params.length}`);
  }

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM inputs WHERE ${whereClause}`,
    params,
  );
  params.push(limit, offset);
  const rowResult = await pool.query(
    `SELECT * FROM inputs WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return {
    rows: rowResult.rows,
    totalCount: Number(countResult.rows[0].count),
  };
};

export const getInputById = async (farmId, inputId) => {
  const result = await pool.query(
    `SELECT * FROM inputs WHERE id = $1 AND farm_id = $2`,
    [inputId, farmId],
  );
  return result.rows[0];
};

export const getCategories = async () => {
  const result = await pool.query(
    `SELECT * FROM input_categories ORDER BY name`,
  );
  return result.rows;
};
