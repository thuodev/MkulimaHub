import pool from "../config/db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getFarmSummary = asyncHandler(async (req, res) => {
  const farmId = req.params.farmId;

  const fieldsResult = await pool.query(
    `SELECT COUNT(*) AS field_count, COALESCE(SUM(size), 0) AS total_field_size
     FROM fields WHERE farm_id = $1`,
    [farmId],
  );

  const inputBalancesResult = await pool.query(
    `SELECT i.id, i.name, i.unit_of_measure,
       COALESCE(SUM(CASE WHEN it.type = 'in' THEN it.quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN it.type = 'out' THEN it.quantity ELSE 0 END), 0) AS balance
     FROM inputs i
     LEFT JOIN input_transactions it ON it.input_id = i.id
     WHERE i.farm_id = $1
     GROUP BY i.id, i.name, i.unit_of_measure
     ORDER BY i.name`,
    [farmId],
  );

  const stockBalancesResult = await pool.query(
    `SELECT s.id, s.name, s.unit_of_measure,
       COALESCE(SUM(CASE WHEN sm.type = 'in' THEN sm.quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN sm.type = 'out' THEN sm.quantity ELSE 0 END), 0) AS balance
     FROM stock_items s
     LEFT JOIN stock_movements sm ON sm.stock_item_id = s.id
     WHERE s.farm_id = $1
     GROUP BY s.id, s.name, s.unit_of_measure
     ORDER BY s.name`,
    [farmId],
  );

  const livestockResult = await pool.query(
    `SELECT lr.id, lr.type, lr.species, lr.tag_id,
       CASE WHEN lr.type = 'batch'
         THEN lr.quantity + COALESCE(SUM(le.quantity_change), 0)
         ELSE 1
       END AS current_quantity
     FROM livestock_records lr
     LEFT JOIN livestock_events le ON le.livestock_record_id = lr.id
     WHERE lr.farm_id = $1
     GROUP BY lr.id, lr.type, lr.species, lr.tag_id, lr.quantity`,
    [farmId],
  );

  const livestockBySpecies = {};
  for (const row of livestockResult.rows) {
    livestockBySpecies[row.species] =
      (livestockBySpecies[row.species] || 0) + Number(row.current_quantity);
  }

  res.json({
    fields: {
      count: Number(fieldsResult.rows[0].field_count),
      totalSize: Number(fieldsResult.rows[0].total_field_size),
    },
    inputs: inputBalancesResult.rows.map((r) => ({
      ...r,
      balance: Number(r.balance),
    })),
    stock: stockBalancesResult.rows.map((r) => ({
      ...r,
      balance: Number(r.balance),
    })),
    livestock: {
      totalRecords: livestockResult.rows.length,
      bySpecies: livestockBySpecies,
    },
  });
});
