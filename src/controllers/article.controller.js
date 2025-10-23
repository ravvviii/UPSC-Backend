import Article from "../models/Article.js";

export const createArticle = async (req, res, next) => {
  try {
    const { title, source, bulletPoints, aiAnswer } = req.body;
    if (!title) return next({ status: 400, message: "Title is required" });

    const article = await Article.create({
      title,
      source,
      bulletPoints,
      aiAnswer
    });

    res.status(201).json({ message: "Article created", article });
  } catch (err) {
    next(err);
  }
};

export const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments();

    const articles = await Article.aggregate([
      {
        $addFields: {
          hasImage: {
            $cond: [{ $ifNull: ["$image", false] }, 1, 0] // 1 = has image, 0 = no image
          }
        }
      },
      {
        $sort: { hasImage: -1, createdAt: -1 ,_id: -1} // ✅ first with image, then newest
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          hasImage: 0 // hide helper field
        }
      }
    ]);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      articles,
    });
  } catch (err) {
    next(err);
  }
};


// ✅ Get single article by ID
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return next({ status: 404, message: "Article not found" });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// ✅ Update article by ID
export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Article.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return next({ status: 404, message: "Article not found" });
    res.json({ message: "Article updated", article: updated });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete article by ID
export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return next({ status: 404, message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    next(err);
  }
};

// ✅ Search articles by title or keyword
export const searchArticles = async (req, res, next) => {
  try {
    const query = req.query.q || "";
    const articles = await Article.find({
      title: { $regex: query, $options: "i" }
    });
    res.json({ total: articles.length, articles });
  } catch (err) {
    next(err);
  }
};
