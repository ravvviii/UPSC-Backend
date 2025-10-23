import User from "../models/User.js";
import Article from "../models/Article.js";

export const addBookmark = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) return next({ status: 404, message: "Article not found" });

    const user = await User.findById(userId);
    if (user.bookmarks.includes(articleId)) {
      return res.status(400).json({ error: { message: "Already bookmarked" } });
    }

    user.bookmarks.push(articleId);
    await user.save();

    res.json({ message: "Bookmark added", bookmarks: user.bookmarks });
  } catch (err) {
    next(err);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { articleId } = req.params;

    const user = await User.findById(userId);
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== articleId
    );
    await user.save();

    res.json({ message: "Bookmark removed", bookmarks: user.bookmarks });
  } catch (err) {
    next(err);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId).populate("bookmarks");
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    next(err);
  }
};
