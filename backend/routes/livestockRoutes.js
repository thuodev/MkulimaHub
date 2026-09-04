import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireFarmMembership,
  requireRole,
} from "../middleware/farmAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createLivestockSchema,
  createEventSchema,
} from "../validators/livestockValidator.js";
import {
  addLivestock,
  listLivestock,
  getLivestock,
  addEvent,
  listEvents,
} from "../controllers/livestockController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership());

router.get("/", listLivestock);
router.get("/:recordId", getLivestock);
router.post(
  "/",
  requireRole(["owner", "manager"]),
  validate(createLivestockSchema),
  addLivestock,
);
router.post("/:recordId/events", validate(createEventSchema), addEvent);
router.get("/:recordId/events", listEvents);

export default router;
