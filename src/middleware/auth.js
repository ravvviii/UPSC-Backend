import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: { message: "Missing or invalid token" } });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);  // e.g., { id: "...", username: "...", iat: ..., exp: ... }
    // Fetch user from DB
    const user = await User.findById(decoded.id)
      .select("username email subscriptionStatus trialStartDate referralCode referredBy streak points lastActiveAt roles bookmarks")
      .lean();
    if (!user) {
      return res.status(401).json({ error: { message: "Invalid token – user not found" } });
    }

    // Attach user data
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      trialStartDate: user.trialStartDate,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      streak: user.streak,
      points: user.points,
      lastActiveAt: user.lastActiveAt,
      roles: user.roles,
      bookmarks: user.bookmarks  // or count only if you prefer
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: { message: "Token invalid or expired" } });
  }
};
