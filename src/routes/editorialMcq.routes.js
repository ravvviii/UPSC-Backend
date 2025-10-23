import express from "express";
import {
  getOrGenerateEditorialMCQs,
  getMCQsForEditorial,
  submitEditorialMCQAnswers,
  checkEditorialAttempt,
  resetEditorialAttempt
} from "../controllers/editorialMcq.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/ping", (req, res) => res.send("Editorial mcq route OK"));

// ✅ Place check before dynamic routes
router.get("/check/:editorialId", requireAuth, checkEditorialAttempt);
router.get("/generate/:editorialId", getOrGenerateEditorialMCQs);
router.get("/:editorialId", getMCQsForEditorial);
router.post("/submit",requireAuth, submitEditorialMCQAnswers);
router.delete("/reset/:userId/:editorialId", resetEditorialAttempt);


export default router;
