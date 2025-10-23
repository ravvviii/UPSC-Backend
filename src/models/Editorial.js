import mongoose from "mongoose";

const editorialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: "https://placehold.co/600x400?text=Editorial" },
  shortDescription: { type: String, required: true },
  fullContent: { type: String, required: true },
  author: { type: String, required: true },
  paperName: { type: String, required: true },
  tag: { type: String, default: "editorial" },
  editorialDate: { type: Date, required: true },
  insertedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Editorial", editorialSchema);
