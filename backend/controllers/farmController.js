import { findUserByEmail } from "../models/userModel.js";
import {
  createFarmWithOwner,
  getFarmsForUser,
  addFarmMember,
  listFarmMembers,
  removeFarmMember,
  deleteFarm,
} from "../models/farmModel.js";
export const createFarm = async (req, res) => {
  try {
    const { name, location, totalSize, sizeUnit } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const farm = await createFarmWithOwner(
      req.userId,
      name,
      location,
      totalSize,
      sizeUnit,
    );
    res.status(201).json(farm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create farm" });
  }
};

export const listFarms = async (req, res) => {
  try {
    const farms = await getFarmsForUser(req.userId);
    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch farms" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: "email and role are required" });
    }
    if (!["owner", "manager", "worker"].includes(role)) {
      return res
        .status(400)
        .json({ error: "role must be owner, manager, or worker" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "No user found with that email — they need to register first",
      });
    }

    const membership = await addFarmMember(req.params.farmId, user.id, role);
    res.status(201).json({ ...membership, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add farm member" });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await listFarmMembers(req.params.farmId);
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch farm members" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const removed = await removeFarmMember(
      req.params.farmId,
      req.params.userId,
    );
    if (!removed)
      return res.status(404).json({ error: "Member not found on this farm" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove farm member" });
  }
};

export const removeFarm = async (req, res) => {
  try {
    const deleted = await deleteFarm(req.params.farmId);
    if (!deleted) return res.status(404).json({ error: "Farm not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete farm" });
  }
};
