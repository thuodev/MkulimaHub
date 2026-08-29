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

export const getInputsForFarm = async (farmId) => {
  const result = await pool.query(
    `SELECT i.*, ic.name AS category_name
     FROM inputs i
     LEFT JOIN input_categories ic ON ic.id = i.category_id
     WHERE i.farm_id = $1
     ORDER BY i.created_at DESC`,
    [farmId],
  );
  return result.rows;
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
