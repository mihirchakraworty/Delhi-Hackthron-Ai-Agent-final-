const { getHotelSuggestions } = require('../services/hotelService');

/**
 * GET /api/hotels/:city
 * Query params: budget, travelers, stars, type
 */
const fetchHotels = async (req, res) => {
  const { city } = req.params;
  const { budget, travelers, stars, type } = req.query;

  try {
    const hotels = await getHotelSuggestions(city, {
      budget,
      travelers: Number(travelers) || 1,
      stars: stars ? Number(stars) : undefined,
      type,
    });

    res.json({ success: true, source: 'gemini_ai', city, hotels });
  } catch (error) {
    console.error('Hotel Controller Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hotel suggestions' });
  }
};

module.exports = { fetchHotels };
