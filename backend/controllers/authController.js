import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

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
