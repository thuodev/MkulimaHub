import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import {
  addStockItem,
  listStockItems,
  addMovement,
  listMovements,
} from "../controllers/stockController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership());

router.get("/", listStockItems);
router.post("/", requireRole(["owner", "manager"]), addStockItem);
router.post("/:stockItemId/movements", addMovement);
router.get("/:stockItemId/movements", listMovements);
export default router;
