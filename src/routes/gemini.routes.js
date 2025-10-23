import express from "express";
import { generateMCQsFromGemini } from "../utils/gemini.js";

const router = express.Router();


router.get("/test", async (req, res) => {
  try {
    const mcqs = await generateMCQsFromGemini(
      "VIKSIT BHARAT 2047",
      "This is some sample content for generating MCQs."
    );
    res.json(mcqs);
  } catch (err) {
    console.error("❌ Gemini test error:", err);
    res.status(500).json({ error: "Gemini test failed" });
  }
});

// ✅ Gemini MCQ generation endpoint
router.post("/generate", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const mcqs = await generateMCQsFromGemini(title, content);
    res.json({ title, mcqs });
  } catch (err) {
    console.error("❌ Gemini generation error:", err);
    res.status(500).json({ error: "Gemini MCQ generation failed" });
  }
});

export default router;
