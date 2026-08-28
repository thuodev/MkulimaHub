import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createFarm, listFarms } from "../controllers/farmController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createFarm);
router.get("/", listFarms);

export default router;
