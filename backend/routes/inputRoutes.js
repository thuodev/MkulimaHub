import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import {
  addInput,
  listInputs,
  listCategories,
  addTransaction,
  listTransactions,
} from "../controllers/inputController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership());

router.get("/categories", listCategories);
router.get("/", listInputs);
router.post("/", requireRole(["owner", "manager"]), addInput);
router.post("/:inputId/transactions", addTransaction);
router.get("/:inputId/transactions", listTransactions);
export default router;
