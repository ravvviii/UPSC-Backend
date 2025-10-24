import express from "express";
import { getQuizAnalytics, getTopPerformers,getUserQuizAttempts } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Quiz analytics endpoints
router.get("/user/ping", (req, res) => res.json({ ok: true }));
router.get("/quiz-attempts", requireAuth, getQuizAnalytics);
router.get("/top-performers", requireAuth, getTopPerformers);
router.get('/user/:userId/quiz-attempts', getUserQuizAttempts);

export default router;