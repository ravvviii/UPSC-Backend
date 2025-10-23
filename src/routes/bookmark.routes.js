import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { addBookmark, removeBookmark, getBookmarks } from "../controllers/bookmark.controller.js";

const router = express.Router();

router.get("/", requireAuth, getBookmarks);
router.post("/:articleId", requireAuth, addBookmark);
router.delete("/:articleId", requireAuth, removeBookmark);

export default router;
