import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createFieldSchema,
  updateFieldSchema,
} from "../validators/fieldValidator.js";
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
router.post(
  "/",
  requireRole(["owner", "manager"]),
  validate(createFieldSchema),
  addField,
);
router.put(
  "/:fieldId",
  requireRole(["owner", "manager"]),
  validate(updateFieldSchema),
  editField,
);
router.delete("/:fieldId", requireRole(["owner", "manager"]), removeField);

export default router;
