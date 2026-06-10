const { generateStructuredItinerary } = require("../services/geminiService");

const generateItinerary = async (req, res) => {
  try {
    const { city, days, budget, travelers, description } = req.body;

    if (!city) return res.status(400).json({ success: false, message: "City is required" });
    if (!days || days < 1) return res.status(400).json({ success: false, message: "Days must be at least 1" });

    const itinerary = await generateStructuredItinerary({
      city,
      days: Number(days),
      budget: budget || "flexible",
      travelers: travelers || 1,
      description: description || "",
    });

    res.json({
      success: true,
      city,
      days: Number(days),
      itinerary,
    });

  } catch (error) {
    console.error("Itinerary Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate itinerary",
    });
  }
};

module.exports = { generateItinerary };
