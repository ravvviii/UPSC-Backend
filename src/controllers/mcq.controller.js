import MCQ from "../models/MCQ.js";
import Article from "../models/Article.js";
import MCQAttempt from "../models/MCQAttempt.js";
import { generateMCQsFromGemini } from "../utils/gemini.js";

// ✅ Get MCQs for article (DB only)
export const getMCQsForArticle = async (req, res, next) => {
  try {
    const { id: articleId } = req.params;
    let mcqs = await MCQ.find({ articleId });
    mcqs = mcqs.sort(() => Math.random() - 0.5);
    res.json({ total: mcqs.length, mcqs });
  } catch (err) {
    next(err);
  }
};

// ✅ Generate MCQs if not present
export const getOrGenerateMCQs = async (req, res) => {
  try {
    const { articleId } = req.params;

    // 1. Check article exists
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ error: "Article not found" });

    // 2. Check if already present
    let existing = await MCQ.find({ articleId });
    if (existing.length > 0) {
      return res.json({ fromCache: true, mcqs: existing });
    }

    // 3. Generate using Gemini
    const generated = await generateMCQsFromGemini(
      article.title,
      article.aiAnswer || article.content || article.source || " "
    );

    // 4. Save to DB
    const saved = await MCQ.insertMany(
      generated.map(q => ({
        articleId: article._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    );

    res.json({ fromCache: false, mcqs: saved });
  } catch (err) {
    console.error("❌ MCQ generation error:", err);
    res.status(500).json({ error: "Failed to generate MCQs" });
  }
};

// ✅ Submit MCQ answers
export const submitMCQAnswers = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { articleId, answers } = req.body;

    // 🔒 Check if user already attempted
    const existingAttempt = await MCQAttempt.findOne({ userId, articleId });
    if (existingAttempt) {
      return res.status(400).json({ error: "You have already attempted this quiz" });
    }

    const mcqs = await MCQ.find({ articleId });

    let score = 0;
    const result = [];

    for (const ans of answers) {
      const mcq = mcqs.find(q => q._id.toString() === ans.mcqId);
      if (mcq) {
        const correct = mcq.correctAnswer === ans.selected;
        if (correct) score++;
        result.push({ mcqId: mcq._id, selected: ans.selected, correct });
      }
    }

    const attempt = await MCQAttempt.create({
      userId,
      articleId,
      score,
      total: mcqs.length,
      answers: result
    });

    res.json({
      message: "Quiz submitted",
      score: attempt.score,
      total: attempt.total,
      result
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Check if user already attempted quiz
export const checkAttempt = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { articleId } = req.params;

    const attempt = await MCQAttempt.findOne({ userId, articleId });

    if (attempt) {
      return res.json({
        attempted: true,
        score: attempt.score,
        total: attempt.total,
        result: attempt.answers
      });
    }

    return res.json({ attempted: false });
  } catch (err) {
    next(err);
  }
};
