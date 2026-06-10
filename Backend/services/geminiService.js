const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate a structured JSON itinerary from Gemini AI.
 * Returns parsed JSON object { days:[], attractions:[], localFoods:[], tips:[] }
 */
const generateStructuredItinerary = async ({ city, days, budget, travelers, description }) => {
  const prompt = `
You are an expert travel planner AI. Generate a detailed travel itinerary.

Destination: ${city}
Duration: ${days} days
Budget: ₹${budget} total for ${travelers} traveler(s)
Preferences: ${description || "No specific preferences"}

Return ONLY valid JSON (no markdown, no backticks) in this exact format:
{
  "summary": "One sentence overview of the trip",
  "totalEstimatedCost": "₹XXXX",
  "days": [
    {
      "day": 1,
      "title": "Arrival & Exploration",
      "morning": { "activity": "...", "place": "...", "tip": "...", "estimatedCost": "₹XXX" },
      "afternoon": { "activity": "...", "place": "...", "tip": "...", "estimatedCost": "₹XXX" },
      "evening": { "activity": "...", "place": "...", "tip": "...", "estimatedCost": "₹XXX" },
      "night": { "activity": "...", "place": "...", "tip": "...", "estimatedCost": "₹XXX" },
      "dailyCost": "₹XXXX",
      "meals": ["Breakfast: ...", "Lunch: ...", "Dinner: ..."]
    }
  ],
  "topAttractions": [
    { "name": "...", "description": "...", "entryFee": "₹XX or Free", "bestTime": "Morning/Evening" }
  ],
  "localFoods": [
    { "name": "...", "description": "...", "wherToTry": "..." }
  ],
  "transportationTips": ["...", "..."],
  "budgetBreakdown": {
    "accommodation": "₹XXXX",
    "food": "₹XXXX",
    "transport": "₹XXXX",
    "activities": "₹XXXX",
    "miscellaneous": "₹XXXX"
  },
  "packingTips": ["...", "..."],
  "bestSeason": "..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini structured itinerary error:", error);
    if (error.status === 429) throw new Error("Gemini quota exceeded. Please try again later.");
    throw error;
  }
};

/**
 * Generic text generation (used by other controllers)
 */
const generateTrip = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error.status === 429) return "Gemini quota exceeded. Please try again later.";
    throw error;
  }
};

module.exports = { generateTrip, generateStructuredItinerary };
