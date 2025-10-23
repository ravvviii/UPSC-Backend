import express from "express";
import { fetchHinduArticles } from "../controllers/rss.controller.js";

const router = express.Router();

// Manual trigger route
router.get("/fetch-hindu", fetchHinduArticles);

export default router;
