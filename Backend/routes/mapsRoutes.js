const express = require('express');
const router = express.Router();
const { handleGeocodeCity, handleReverseGeocode } = require('../controllers/mapsController');

// POST /api/maps/geocode  → { city } → { lat, lng, formattedAddress, ... }
router.post('/geocode', handleGeocodeCity);

// GET  /api/maps/reverse?lat=XX&lng=YY
router.get('/reverse', handleReverseGeocode);

module.exports = router;
