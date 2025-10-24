import express from "express";
import { getQuizAnalytics, getTopPerformers } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Quiz analytics endpoints
router.get("/quiz-attempts", requireAuth, getQuizAnalytics);
router.get("/top-performers", requireAuth, getTopPerformers);

export default router;