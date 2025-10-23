import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    source: { type: String, default: "The Hindu" },

    // New fields for RSS support
    link: { type: String, unique: true, sparse: true }, // RSS article URL
    description: String, // article summary
    category: String, // e.g. India, World, Economy
    image: String, // RSS-provided image
    pubDate: Date, // publication date from feed

    // AI / Gemini data
    bulletPoints: [String], // optional key takeaways
    aiAnswer: String, // AI-generated summary or analysis

    // (optional) If you ever embed Gemini quiz here
    // quiz: [{ question: String, options: [String], correctAnswer: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema);
