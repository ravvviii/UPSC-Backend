import User from "../models/User.js";
// import Bookmark from "../models/";
import MCQAttempt from "../models/MCQAttempt.js";
import Article from "../models/Article.js";
import Editorial from "../models/Editorial.js";
import MCQ from "../models/MCQ.js";

// ✅ Fetch user profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select(
        "username email subscriptionStatus trialStartDate referralCode referredBy streak points lastActiveAt roles "
      )
      .lean();

    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    // const bookmarksCount = user.bookmarks?.length ?? 0;

    res.json({
      message: "Welcome to your profile",
      user: {
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
        // bookmarksCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Admin: Reset a user account (delete user + related data)
export const resetUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 🔒 Only admins can perform this
    // if (!req.user.roles?.includes("admin")) {
    //   return res.status(403).json({ error: "Only admins can reset user accounts" });
    // }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🧹 Delete everything linked to this user
    const [deletedAttempts, deletedArticles, deletedEditorials] =
      await Promise.all([
        MCQAttempt.deleteMany({ userId }),
        // Bookmark.deleteMany({ userId }),
        Article.deleteMany({ authorId: userId }),
        Editorial.deleteMany({ authorId: userId }),
      ]);

    await MCQ.deleteMany({ createdBy: userId }); // optional

    // 🗑 Delete the user record itself
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User account and related data deleted successfully",
      deletedCounts: {
        mcqAttempts: deletedAttempts.deletedCount,
        // bookmarks: deletedBookmarks.deletedCount,
        articles: deletedArticles.deletedCount,
        editorials: deletedEditorials.deletedCount,
      },
    });
  } catch (err) {
    console.error("❌ resetUserAccount error:", err);
    next(err);
  }
};
