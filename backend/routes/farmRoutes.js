import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createFarm, listFarms } from "../controllers/farmController.js";
import fieldRoutes from "./fieldRoutes.js";
import inputRoutes from "./inputRoutes.js";
const router = express.Router();

router.use(requireAuth);

router.post("/", createFarm);
router.get("/", listFarms);

router.use("/:farmId/fields", fieldRoutes);
router.use("/:farmId/inputs", inputRoutes);

export default router;
