import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    subscriptionStatus: {
      type: String,
      enum: ["none", "trial", "active", "expired"],
      default: "none"
    },
    trialStartDate: { type: Date },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },

    streak: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    lastActiveAt: { type: Date },

    roles: { type: [String], default: ["user"] }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
