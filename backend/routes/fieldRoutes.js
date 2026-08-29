import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import {
  addField,
  listFields,
  getField,
  editField,
  removeField,
} from "../controllers/fieldController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership());

router.get("/", listFields);
router.get("/:fieldId", getField);
router.post("/", requireRole(["owner", "manager"]), addField);
router.put("/:fieldId", requireRole(["owner", "manager"]), editField);
router.delete("/:fieldId", requireRole(["owner", "manager"]), removeField);

export default router;
