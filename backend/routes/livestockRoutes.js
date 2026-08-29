import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireFarmMembership } from "../middleware/farmAuthMiddleware.js";
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

router.post("/", addLivestock);
router.get("/", listLivestock);
router.get("/:recordId", getLivestock);
router.post("/:recordId/events", addEvent);
router.get("/:recordId/events", listEvents);

export default router;
