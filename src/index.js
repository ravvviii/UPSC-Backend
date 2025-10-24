import express from "express";
// import cors from "cors";
import cron from "node-cron";
import { fetchHinduArticles } from "../src/controllers/rss.controller.js";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import userRoutes from "./routes/user.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import articleRoutes from "./routes/article.routes.js";
import mcqRoutes from "./routes/mcq.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import rssRoutes from "./routes/rss.routes.js";
import editorialRoutes from "./routes/editorial.routes.js";
import editorialMcqRoutes from "./routes/editorialMcq.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
dotenv.config();



const app = express();

// middleware
app.use(helmet());
// app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));



// connect DB
await connectDB(process.env.MONGO_URI);


app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/mcqs", mcqRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/rss", rssRoutes);
app.use("/api/editorials", editorialRoutes);
app.use("/api/editorial-mcqs", editorialMcqRoutes);
app.use("/api/analytics", analyticsRoutes);





cron.schedule("0 */3 * * *", async () => {
  console.log("🕒 Auto-fetching The Hindu articles...");
  await fetchHinduArticles({ query: {} }, { json: () => {} });
});


app.use(notFound);
app.use(errorHandler);


// 404 fallback (only for non-matched routes)
app.use((_req, res) => res.status(404).json({ error: { message: "Not found.." } }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API listening on :${PORT}`));
