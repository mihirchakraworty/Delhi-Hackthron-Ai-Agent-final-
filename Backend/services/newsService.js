const axios = require("axios");
const NodeCache = require("node-cache");

const newsCache = new NodeCache({ stdTTL: 1800 }); // 30 min cache

/**
 * Fetch travel news for a destination using Mediastack API
 */
const getTravelNews = async (destination = "travel") => {
  try {
    const cacheKey = `news_${destination.toLowerCase()}`;
    const cached = newsCache.get(cacheKey);

    if (cached) {
      return { ...cached, fromCache: true };
    }

    if (
      !process.env.MEDIASTACK_API_KEY ||
      process.env.MEDIASTACK_API_KEY === "your_mediastack_api_key_here"
    ) {
      return {
        success: false,
        error: "Mediastack API key not configured",
        articles: [],
      };
    }

    const response = await axios.get(
      "https://api.mediastack.com/v1/news",
      {
        params: {
          access_key: process.env.MEDIASTACK_API_KEY,
          keywords: destination,
          languages: "en",
          limit: 6,
        },
      }
    );

    const articles = (response.data.data || [])
      .map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source,
        publishedAt: article.published_at,
        image: article.image,
        category: article.category,
      }))
      .filter((article) => article.title && article.url);

    const result = {
      success: true,
      destination,
      articles,
      total: articles.length,
    };

    newsCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error(
      "Mediastack Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error: "Unable to fetch travel news",
      articles: [],
    };
  }
};

module.exports = {
  getTravelNews,
};