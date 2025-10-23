import mongoose from "mongoose";

export const connectDB = async (uri) => {
  if (!uri) throw new Error("MONGO_URI missing");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: uri.split("/").pop() });
  console.log("✅ Mongo connected");
};
