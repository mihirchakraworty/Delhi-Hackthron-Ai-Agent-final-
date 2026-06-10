const { geocodeCity, reverseGeocode } = require('../services/geocodingService');

/**
 * POST /api/maps/geocode
 * Body: { city }
 */
const handleGeocodeCity = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ success: false, message: 'City is required' });
    const result = await geocodeCity(city);
    if (!result) return res.status(404).json({ success: false, message: 'City not found' });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/maps/reverse?lat=XX&lng=YY
 */
const handleReverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng are required' });
    const address = await reverseGeocode(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, address, lat: parseFloat(lat), lng: parseFloat(lng) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { handleGeocodeCity, handleReverseGeocode };
