import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: { type: String, required: true },
    answerText: { type: String, required: true },
    marks: { type: Number, required: true },
    feedback: { type: String, required: true },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
export default Evaluation;
