import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    checkAttempt, 
  submitMCQAnswers,
  getOrGenerateMCQs
} from "../controllers/mcq.controller.js";

const router = express.Router();

router.get("/generate/:articleId", getOrGenerateMCQs);

router.post("/submit", requireAuth, submitMCQAnswers);
router.get("/attempt/:articleId", checkAttempt);




export default router;
