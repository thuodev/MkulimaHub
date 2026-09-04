import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createStockItemSchema,
  createMovementSchema,
} from "../validators/stockValidator.js";
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
router.post(
  "/",
  requireRole(["owner", "manager"]),
  validate(createStockItemSchema),
  addStockItem,
);
router.post(
  "/:stockItemId/movements",
  validate(createMovementSchema),
  addMovement,
);
router.get("/:stockItemId/movements", listMovements);

export default router;
