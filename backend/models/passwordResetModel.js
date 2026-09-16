import pool from "../config/db.js";

export const createResetToken = async (userId) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const result = await pool.query(
    `INSERT INTO password_reset_tokens (user_id, expires_at)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, expiresAt],
  );
  return result.rows[0];
};

export const getValidToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM password_reset_tokens
     WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
    [token],
  );
  return result.rows[0];
};

export const markTokenUsed = async (tokenId) => {
  await pool.query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`,
    [tokenId],
  );
};
