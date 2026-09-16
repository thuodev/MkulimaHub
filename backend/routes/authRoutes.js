import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
export default router;
