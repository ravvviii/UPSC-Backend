import express from "express";
import { evaluateAnswer, getUserEvaluations } from "../controllers/evaluator.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.get("/test", (req, res) => {
  res.json({ message: "Evaluator route is working!" });
});
router.post("/", requireAuth, evaluateAnswer);
router.get("/", requireAuth, getUserEvaluations);

export default router;
