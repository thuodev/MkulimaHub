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
  res.status(201).json(farm);
});

export const listFarms = asyncHandler(async (req, res) => {
  const farms = await getFarmsForUser(req.userId);
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
  res.status(201).json({ ...membership, name: user.name, email: user.email });
});

export const getMembers = asyncHandler(async (req, res) => {
  const members = await listFarmMembers(req.params.farmId);
  res.json(members);
});

export const removeMember = asyncHandler(async (req, res) => {
  const removed = await removeFarmMember(req.params.farmId, req.params.userId);
  if (!removed) throw new AppError("Member not found on this farm", 404);
  res.status(204).send();
});

export const removeFarm = asyncHandler(async (req, res) => {
  const deleted = await deleteFarm(req.params.farmId);
  if (!deleted) throw new AppError("Farm not found", 404);
  res.status(204).send();
});
