import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireFarmMembership } from "../middleware/farmAuthMiddleware.js";
import { getFarmSummary } from "../controllers/dashboardController.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireFarmMembership());

router.get("/", getFarmSummary);

export default router;
