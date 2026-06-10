const express = require('express');
const router = express.Router();
const { handleGeocodeCity, handleReverseGeocode } = require('../controllers/geocodingController');

router.get('/reverse', handleReverseGeocode);
router.get('/:city', handleGeocodeCity);

module.exports = router;
