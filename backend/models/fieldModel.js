import pool from "../config/db.js";

export const createField = async (
  farmId,
  name,
  size,
  sizeUnit,
  currentCrop,
) => {
  const result = await pool.query(
    `INSERT INTO fields (farm_id, name, size, size_unit, current_crop)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [farmId, name, size, sizeUnit || "acres", currentCrop || null],
  );
  return result.rows[0];
};

export const getFieldsForFarm = async (farmId) => {
  const result = await pool.query(
    `SELECT * FROM fields WHERE farm_id = $1 ORDER BY created_at DESC`,
    [farmId],
  );
  return result.rows;
};

export const getFieldById = async (farmId, fieldId) => {
  const result = await pool.query(
    `SELECT * FROM fields WHERE id = $1 AND farm_id = $2`,
    [fieldId, farmId],
  );
  return result.rows[0];
};

export const updateField = async (farmId, fieldId, updates) => {
  const { name, size, sizeUnit, currentCrop } = updates;
  const result = await pool.query(
    `UPDATE fields
     SET name = COALESCE($1, name),
         size = COALESCE($2, size),
         size_unit = COALESCE($3, size_unit),
         current_crop = COALESCE($4, current_crop)
     WHERE id = $5 AND farm_id = $6
     RETURNING *`,
    [name, size, sizeUnit, currentCrop, fieldId, farmId],
  );
  return result.rows[0];
};

export const deleteField = async (farmId, fieldId) => {
  const result = await pool.query(
    `DELETE FROM fields WHERE id = $1 AND farm_id = $2 RETURNING id`,
    [fieldId, farmId],
  );
  return result.rows[0];
};
