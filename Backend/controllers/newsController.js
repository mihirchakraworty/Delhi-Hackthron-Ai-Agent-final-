const { getTravelNews } = require("../services/newsService");

const fetchNews = async (req, res) => {
  try {
    const { destination } = req.params;
    const result = await getTravelNews(destination || "travel India");
    res.json(result);
  } catch (error) {
    console.error("News Controller Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch news" });
  }
};

const fetchGeneralTravelNews = async (req, res) => {
  try {
    const result = await getTravelNews("travel India tourism");
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch news" });
  }
};

module.exports = { fetchNews, fetchGeneralTravelNews };
