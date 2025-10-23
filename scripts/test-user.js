import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User.js";
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    passwordHash: "123456"
  });
  console.log("User created:", user.username);
  await mongoose.disconnect();
};

run();
