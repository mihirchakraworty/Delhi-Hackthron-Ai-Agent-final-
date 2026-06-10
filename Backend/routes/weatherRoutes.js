const express = require('express');
const router = express.Router();
const { fetchWeather, clearWeatherCache } = require('../controllers/weatherController');

router.get('/:city', fetchWeather);
router.delete('/cache', clearWeatherCache);

module.exports = router;
