import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  updateUserPassword,
} from "../models/userModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import {
  createResetToken,
  getValidToken,
  markTokenUsed,
} from "../models/passwordResetModel.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email, and password are required", 400);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("email is required", 400);

  const user = await findUserByEmail(email);

  // Always respond the same way, whether or not the email exists —
  // this prevents attackers from using this endpoint to discover which emails are registered
  if (user) {
    const resetToken = await createResetToken(user.id);
    await sendPasswordResetEmail(user.email, user.name, resetToken.token);
  }

  res.json({
    message:
      "If an account with that email exists, a reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    throw new AppError("token and newPassword are required", 400);

  const resetRecord = await getValidToken(token);
  if (!resetRecord) throw new AppError("Invalid or expired reset link", 400);

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(resetRecord.user_id, passwordHash);
  await markTokenUsed(resetRecord.id);

  res.json({ message: "Password reset successfully. You can now log in." });
});
