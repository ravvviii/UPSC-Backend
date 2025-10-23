import MCQ from "../models/MCQ.js";
import Editorial from "../models/Editorial.js";
import MCQAttempt from "../models/MCQAttempt.js";
import { generateMCQsFromGemini } from "../utils/gemini.js";

// ✅ Get MCQs for editorial (from DB only)
export const getMCQsForEditorial = async (req, res, next) => {
  try {
    const { editorialId } = req.params; // <-- fix here
    let mcqs = await MCQ.find({ editorialId });
    mcqs = mcqs.sort(() => Math.random() - 0.5);

    // optional: limit to 5
    mcqs = mcqs.slice(0, 5);

    const uniqueMcqs = Array.from(
  new Map(mcqs.map((m) => [m._id.toString(), m])).values()
);
res.json({ total: uniqueMcqs.length, mcqs: uniqueMcqs.slice(0, 5) });

  } catch (err) {
    next(err);
  }
};


// ✅ Generate MCQs if not present
export const getOrGenerateEditorialMCQs = async (req, res) => {
  try {
    const { editorialId } = req.params;

    // 1. Check editorial exists
    const editorial = await Editorial.findById(editorialId);
    if (!editorial) return res.status(404).json({ error: "Editorial not found" });

    // 2. Check if already present
    let existing = await MCQ.find({ editorialId });
    if (existing.length > 0) {
      return res.json({ fromCache: true, mcqs: existing });
    }

    // 3. Generate using Gemini
    const generated = await generateMCQsFromGemini(
      editorial.title,
      editorial.fullContent
    );

    // 4. Save to DB
    const saved = await MCQ.insertMany(
      generated.map(q => ({
        editorialId: editorial._id,
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
export const submitEditorialMCQAnswers = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { editorialId, answers } = req.body;

    // 🔒 Check if user already attempted
    const existingAttempt = await MCQAttempt.findOne({ userId, articleId: editorialId });
    if (existingAttempt) {
      return res.status(400).json({ error: "You have already attempted this quiz" });
    }

    const mcqs = await MCQ.find({ editorialId });

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
      editorialId,
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

export const checkEditorialAttempt = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { editorialId } = req.params;

    const attempt = await MCQAttempt.findOne({ userId, editorialId })
      .populate("answers.mcqId") // <-- Add this so frontend gets full MCQ data

    if (attempt) {
      return res.json({
        attempted: true,
        score: attempt.score,
        total: attempt.total,
        result: attempt.answers, // now includes full MCQ details
      });
    }

    return res.json({ attempted: false });
  } catch (err) {
    next(err);
  }
};



export const resetEditorialAttempt = async (req, res, next) => {
  try {
    const { userId, editorialId } = req.params;

   
    const attempt = await MCQAttempt.findOneAndDelete({ userId, editorialId });

    if (!attempt) {
      return res.status(404).json({ message: "No attempt found to reset" });
    }

    res.json({
      message: "Quiz attempt reset successfully",
      deletedAttemptId: attempt._id,
    });
  } catch (err) {
    console.error("❌ resetEditorialAttempt error:", err);
    next(err);
  }
};
