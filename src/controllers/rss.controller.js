import Parser from "rss-parser";
import { convert } from "html-to-text";
import Article from "../models/Article.js";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media", { keepArray: true }],
      ["category", "category"]
    ]
  }
});

// Function to fetch and save RSS articles
export const fetchHinduArticles = async (req, res) => {
  try {
    console.log("📡 Fetching RSS feed from The Hindu...");
    const feed = await parser.parseURL("https://www.thehindu.com/feeder/default.rss");

    // Transform feed items into structured objects
    const articles = feed.items.map(item => ({
      title: item.title?.trim(),
      link: item.link,
      description: convert(item.description || "", { wordwrap: false }),
      category: item.category || "General",
      image: item.media?.[0]?.$.url || null,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      source: "The Hindu"
    }));

    // Get existing links from DB
    const existing = await Article.find({}, { link: 1 });
    const existingLinks = new Set(existing.map(a => a.link));

    // Filter only new ones
    const newArticles = articles.filter(a => !existingLinks.has(a.link));

    // Insert new articles into DB
    if (newArticles.length > 0) {
      await Article.insertMany(newArticles);
      console.log(`✅ ${newArticles.length} new articles added to DB.`);
    } else {
      console.log("✨ No new articles to add.");
    }

    return res.json({
      message: "RSS fetch complete",
      added: newArticles.length,
      total: articles.length
    });
  } catch (error) {
    console.error("❌ RSS Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};
