import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles
} from "../controllers/article.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create article (will make admin only later)
router.post("/", requireAuth, createArticle);

// ✅ Get all articles (with pagination)
router.get("/", getAllArticles);

// ✅ Search articles by title or keyword
router.get("/search", searchArticles);

// ✅ Get single article
router.get("/:id", getArticleById);

// ✅ Update article
router.put("/:id", requireAuth, updateArticle);

// ✅ Delete article
router.delete("/:id", requireAuth, deleteArticle);

export default router;
