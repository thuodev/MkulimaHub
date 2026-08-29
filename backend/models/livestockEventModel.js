import pool from "../config/db.js";

export const createEvent = async (farmId, recordId, data) => {
  const { eventType, eventDate, quantityChange, weight, value, notes } = data;
  const result = await pool.query(
    `INSERT INTO livestock_events (livestock_record_id, farm_id, event_type, event_date, quantity_change, weight, value, notes)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, $7, $8)
     RETURNING *`,
    [
      recordId,
      farmId,
      eventType,
      eventDate || null,
      quantityChange || null,
      weight || null,
      value || null,
      notes || null,
    ],
  );
  return result.rows[0];
};

export const getEventsForRecord = async (farmId, recordId) => {
  const result = await pool.query(
    `SELECT * FROM livestock_events
     WHERE farm_id = $1 AND livestock_record_id = $2
     ORDER BY event_date DESC`,
    [farmId, recordId],
  );
  return result.rows;
};
