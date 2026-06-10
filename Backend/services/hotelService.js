const { generateTrip } = require('./geminiService');

/**
 * Generate hotel suggestions using Gemini AI.
 * Accepts optional filters: budget, stars, type (budget/luxury/boutique)
 */
const getHotelSuggestions = async (city, { budget, travelers = 1, stars, type } = {}) => {
  const budgetNote = budget
    ? `Total trip budget is ₹${budget} for ${travelers} traveler(s).`
    : '';
  const filterNote = [
    stars ? `Prefer ${stars}-star hotels.` : '',
    type ? `Focus on ${type} category hotels.` : '',
  ].filter(Boolean).join(' ');

  const prompt = `
You are a hotel expert for Indian travel destinations.
Suggest 8 real, well-known hotels in ${city}.
${budgetNote} ${filterNote}

Return ONLY valid JSON (no markdown, no backticks):
{
  "hotels": [
    {
      "name": "Hotel Name",
      "stars": 3,
      "category": "Budget | Standard | Premium | Luxury",
      "area": "Locality/Neighbourhood",
      "address": "Full address",
      "price_per_night": "₹XXXX",
      "review_score": 8.5,
      "review_score_word": "Very Good",
      "amenities": ["WiFi", "AC", "Parking", "Restaurant"],
      "is_free_cancellable": true,
      "highlights": "One sentence about what makes this hotel special",
      "booking_search_url": "https://www.booking.com/search.html?ss=${encodeURIComponent(city)}"
    }
  ]
}

Mix budget, mid-range and premium options. Include real hotel names that actually exist in ${city}.
`;

  const result = await generateTrip(prompt);
  const clean = result.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(clean);
  return data.hotels || [];
};

module.exports = { getHotelSuggestions };
