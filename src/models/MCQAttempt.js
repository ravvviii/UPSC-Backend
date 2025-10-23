import mongoose from "mongoose";

const mcqAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    editorialId: { type: mongoose.Schema.Types.ObjectId, ref: "Editorial", required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: [
      {
        mcqId: { type: mongoose.Schema.Types.ObjectId, ref: "MCQ" },
        selected: String,
        correct: Boolean
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("MCQAttempt", mcqAttemptSchema);
