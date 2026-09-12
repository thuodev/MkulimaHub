import { findUserByEmail } from "../models/userModel.js";
import {
  createFarmWithOwner,
  getFarmsForUser,
  addFarmMember,
  listFarmMembers,
  removeFarmMember,
  deleteFarm,
} from "../models/farmModel.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { getCache, setCache, deleteCache } from "../utils/cache.js";
import bcrypt from "bcrypt";
import { createUser } from "../models/userModel.js";
import { generateTempPassword } from "../utils/generatePassword.js";
import { sendEmployeeCredentialsEmail } from "../utils/mailer.js";

export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    throw new AppError("name, email and role are required", 400);
  }
  if (!["manager", "worker"].includes(role)) {
    throw new AppError("role must be manager or worker", 400); // Only allow creating employees with role manager or worker
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError(
      'A user with that email already exists — use "Add existing member" instead',
      409,
    );
  }
  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const user = await createUser(name, email, passwordHash);
  const membership = await addFarmMember(req.params.farmId, user.id, role);

  // fetch farm name for the email
  const farms = await getFarmsForUser(req.userId);
  const farm = farms.find((f) => f.id === req.params.farmId);

  await sendEmployeeCredentialsEmail(
    email,
    name,
    farm?.name || "your farm",
    tempPassword,
  );
  await deleteCache(`farms:${req.userId}`); // Invalidate cache for the newly created employee's farms
  res.status(201).json({ ...membership, name: user.name, email: user.email });
});

export const createFarm = asyncHandler(async (req, res) => {
  const { name, location, totalSize, sizeUnit } = req.body;
  if (!name) {
    throw new AppError("name is required", 400);
  }
  const farm = await createFarmWithOwner(
    req.userId,
    name,
    location,
    totalSize,
    sizeUnit,
  );
  await deleteCache(`farms:${req.userId}`); // Invalidate cache for the user's farms
  res.status(201).json(farm);
});

export const listFarms = asyncHandler(async (req, res) => {
  const cacheKey = `farms:${req.userId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  console.log("CACHE MISS:", cacheKey);
  const farms = await getFarmsForUser(req.userId);
  await setCache(cacheKey, farms, 300); // 5 minutes
  res.json(farms);
});

export const addMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    throw new AppError("email and role are required", 400);
  }
  if (!["owner", "manager", "worker"].includes(role)) {
    throw new AppError("role must be owner, manager, or worker", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(
      "No user found with that email — they need to register first",
      404,
    );
  }

  const membership = await addFarmMember(req.params.farmId, user.id, role);
  await deleteCache(`farms:${req.userId}`); // Invalidate cache for the newly added member's farms
  res.status(201).json({ ...membership, name: user.name, email: user.email });
});

export const getMembers = asyncHandler(async (req, res) => {
  const members = await listFarmMembers(req.params.farmId);
  res.json(members);
});

export const removeMember = asyncHandler(async (req, res) => {
  const removed = await removeFarmMember(req.params.farmId, req.params.userId);
  if (!removed) throw new AppError("Member not found on this farm", 404);
  await deleteCache(`farms:${req.userId}`); // Invalidate cache for the removed member's farms
  res.status(204).send();
});

export const removeFarm = asyncHandler(async (req, res) => {
  const deleted = await deleteFarm(req.params.farmId);
  if (!deleted) throw new AppError("Farm not found", 404);
  res.status(204).send();
});
