import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireFarmMembership } from "../middleware/farmAuthMiddleware.js";
import {
  addField,
  listFields,
  getField,
  editField,
  removeField,
} from "../controllers/fieldController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership()); // any farm member can view/manage fields for now

router.post("/", addField);
router.get("/", listFields);
router.get("/:fieldId", getField);
router.put("/:fieldId", editField);
router.delete("/:fieldId", removeField);

export default router;
