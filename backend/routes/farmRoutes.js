import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import {
  createFarm,
  listFarms,
  addMember,
  getMembers,
  removeMember,
  removeFarm,
} from "../controllers/farmController.js";
import fieldRoutes from "./fieldRoutes.js";
import inputRoutes from "./inputRoutes.js";
import stockRoutes from "./stockRoutes.js";
import livestockRoutes from "./livestockRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createFarm);
router.get("/", listFarms);

router.get("/:farmId/members", requireFarmMembership(), getMembers);
router.post(
  "/:farmId/members",
  requireFarmMembership(),
  requireRole(["owner"]),
  addMember,
);
router.delete(
  "/:farmId/members/:userId",
  requireFarmMembership(),
  requireRole(["owner"]),
  removeMember,
);
router.delete(
  "/:farmId",
  requireFarmMembership(),
  requireRole(["owner"]),
  removeFarm,
);

router.use("/:farmId/fields", fieldRoutes);
router.use("/:farmId/inputs", inputRoutes);
router.use("/:farmId/stock", stockRoutes);
router.use("/:farmId/livestock", livestockRoutes);
router.use("/:farmId/dashboard", dashboardRoutes);

export default router;
