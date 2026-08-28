import { createFarmWithOwner, getFarmsForUser } from "../models/farmModel.js";

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
