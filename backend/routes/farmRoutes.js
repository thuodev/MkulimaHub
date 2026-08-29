import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createFarm, listFarms } from "../controllers/farmController.js";
import fieldRoutes from "./fieldRoutes.js";
import inputRoutes from "./inputRoutes.js";
import stockRoutes from "./stockRoutes.js";
import livestockRoutes from "./livestockRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createFarm);
router.get("/", listFarms);

router.use("/:farmId/fields", fieldRoutes);
router.use("/:farmId/inputs", inputRoutes);
router.use("/:farmId/stock", stockRoutes);
router.use("/:farmId/livestock", livestockRoutes);
router.use("/:farmId/dashboard", dashboardRoutes);
export default router;
