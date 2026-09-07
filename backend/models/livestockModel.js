import pool from "../config/db.js";

export const createLivestockRecord = async (farmId, data) => {
  const { fieldId, type, species, tagId, birthDate, sex, quantity } = data;
  const result = await pool.query(
    `INSERT INTO livestock_records (farm_id, field_id, type, species, tag_id, birth_date, sex, quantity)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      farmId,
      fieldId || null,
      type,
      species,
      type === "individual" ? tagId || null : null,
      birthDate || null,
      type === "individual" ? sex || null : null,
      type === "batch" ? quantity : null,
    ],
  );
  return result.rows[0];
};

export const getLivestockForFarm = async (
  farmId,
  { limit, offset, species, type },
) => {
  const conditions = ["farm_id = $1"];
  const params = [farmId];

  if (species || type) {
    if (species) {
      params.push(species);
      conditions.push(`species = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }
  }

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM livestock_records WHERE ${whereClause}`,
    params,
  );
  params.push(limit, offset);
  const rowResult = await pool.query(
    `SELECT * FROM livestock_records WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return {
    rows: rowResult.rows,
    totalCount: Number(countResult.rows[0].count),
  };
};

export const getLivestockById = async (farmId, recordId) => {
  const result = await pool.query(
    `SELECT * FROM livestock_records WHERE id = $1 AND farm_id = $2`,
    [recordId, farmId],
  );
  return result.rows[0];
};

// For a batch: starting quantity + sum of quantity_change events
export const getCurrentBatchQuantity = async (farmId, recordId) => {
  const result = await pool.query(
    `SELECT
       lr.quantity + COALESCE(SUM(le.quantity_change), 0) AS current_quantity
     FROM livestock_records lr
     LEFT JOIN livestock_events le ON le.livestock_record_id = lr.id
     WHERE lr.id = $1 AND lr.farm_id = $2
     GROUP BY lr.quantity`,
    [recordId, farmId],
  );
  return result.rows[0] ? Number(result.rows[0].current_quantity) : null;
};
