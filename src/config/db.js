import mongoose from "mongoose";

export const connectDB = async (uri) => {
  if (!uri) throw new Error("❌ MONGO_URI missing in .env file");
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongo connected");
  } catch (err) {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  }
};
