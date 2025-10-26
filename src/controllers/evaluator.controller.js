import Evaluation from "../models/Evaluation.js";
import { evaluateAnswerWithGemini } from "../utils/gemini.js";

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answerText } = req.body;

    if (!question || !answerText) {
      return res.status(400).json({ error: { message: "question and answerText are required" } });
    }

    // Extract userId from authenticated user
    const userId = req.user.id;

    // Call Gemini to evaluate
    const evaluation = await evaluateAnswerWithGemini(question, answerText);

    // Store evaluation in DB
    const saved = await Evaluation.create({
      userId,
      question,
      answerText,
      marks: evaluation.marks,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions || [],
    });

    return res.status(201).json({
      message: "Evaluation completed successfully",
      data: saved,
    });
  } catch (error) {
    console.error("❌ Evaluation error:", error);
    res.status(500).json({ error: { message: "Internal server error during evaluation" } });
  }
};

export const getUserEvaluations = async (req, res) => {
  try {
    const userId = req.user.id;
    const evaluations = await Evaluation.find({ userId }).sort({ createdAt: -1 });
    res.json({ evaluations });
  } catch (error) {
    console.error("❌ Fetch evaluations error:", error);
    res.status(500).json({ error: { message: "Failed to fetch evaluations" } });
  }
};
