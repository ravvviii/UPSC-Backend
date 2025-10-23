import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProfile, resetUserAccount } from "../controllers/user.controller.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get user profile
router.get("/me", requireAuth, getProfile);

// ✅ Admin: reset user account (delete everything)
router.delete("/reset/:userId", resetUserAccount);

export default router;
