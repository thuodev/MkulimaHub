import pool from "../config/db.js";

export const createFarmWithOwner = async (
  userId,
  name,
  location,
  totalSize,
  sizeUnit,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const farmResult = await client.query(
      `INSERT INTO farms (name, location, total_size, size_unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, location, totalSize, sizeUnit || "acres"],
    );
    const farm = farmResult.rows[0];

    await client.query(
      `INSERT INTO farm_members (user_id, farm_id, role)
       VALUES ($1, $2, 'owner')`,
      [userId, farm.id],
    );

    await client.query("COMMIT");
    return farm;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getFarmsForUser = async (userId) => {
  const result = await pool.query(
    `SELECT f.*, fm.role
     FROM farms f
     JOIN farm_members fm ON fm.farm_id = f.id
     WHERE fm.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId],
  );
  return result.rows;
};

export const getFarmMembership = async (userId, farmId) => {
  const result = await pool.query(
    `SELECT * FROM farm_members WHERE user_id = $1 AND farm_id = $2`,
    [userId, farmId],
  );
  return result.rows[0];
};

export const addFarmMember = async (farmId, userId, role) => {
  const result = await pool.query(
    `INSERT INTO farm_members (user_id, farm_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, farm_id) DO UPDATE SET role = EXCLUDED.role
     RETURNING *`,
    [userId, farmId, role],
  );
  return result.rows[0];
};

export const listFarmMembers = async (farmId) => {
  const result = await pool.query(
    `SELECT fm.id, fm.role, fm.created_at, u.id AS user_id, u.name, u.email
     FROM farm_members fm
     JOIN users u ON u.id = fm.user_id
     WHERE fm.farm_id = $1
     ORDER BY fm.created_at`,
    [farmId],
  );
  return result.rows;
};

export const removeFarmMember = async (farmId, userId) => {
  const result = await pool.query(
    `DELETE FROM farm_members WHERE farm_id = $1 AND user_id = $2 RETURNING id`,
    [farmId, userId],
  );
  return result.rows[0];
};

export const deleteFarm = async (farmId) => {
  const result = await pool.query(
    `DELETE FROM farms WHERE id = $1 RETURNING id`,
    [farmId],
  );
  return result.rows[0];
};
