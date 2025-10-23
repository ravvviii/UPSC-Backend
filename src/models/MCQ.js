import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema(
  {
    editorialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editorial",
      required: true
    },
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "MCQ must have exactly 4 options"
      }
    },
    correctAnswer: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("MCQ", mcqSchema);
