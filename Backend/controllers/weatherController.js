const { getWeatherData, weatherCache } = require('../services/weatherService');

const fetchWeather = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || city.trim() === '') {
      return res.status(400).json({ success: false, message: 'City parameter is required' });
    }

    const weatherData = await getWeatherData(city);

    if (!weatherData.success && weatherData.error) {
      return res.status(400).json(weatherData);
    }

    res.json({
      success: true,
      data: weatherData,
      cached: weatherData.fromCache || false,
    });

  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching weather data' });
  }
};

const clearWeatherCache = (req, res) => {
  weatherCache.flushAll();
  res.json({ success: true, message: 'Weather cache cleared' });
};

module.exports = { fetchWeather, clearWeatherCache };
