const axios = require('axios');
const NodeCache = require('node-cache');

const weatherCache = new NodeCache({ stdTTL: 1800 }); // 30 minutes

const getWeatherData = async (city) => {
  try {
    const cached = weatherCache.get(`weather_${city}`);
    if (cached) return { ...cached, fromCache: true };

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl, { timeout: 5000 }),
      axios.get(forecastUrl, { timeout: 5000 }),
    ]);

    const currentWeather = formatCurrentWeather(weatherRes.data);
    const forecast = formatForecast(forecastRes.data);
    const alerts = generateAlerts(weatherRes.data);

    const response = {
      success: true,
      current: currentWeather,
      forecast: forecast,
      alerts: alerts,
      lastUpdated: new Date(),
      city: city,
    };

    weatherCache.set(`weather_${city}`, response);
    return response;

  } catch (error) {
    console.error('🔴 Weather API Error:', error.message);

    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'City not found',
        suggestion: 'Please check the spelling or try another city',
      };
    }

    return {
      success: false,
      error: 'Unable to fetch weather data',
      fallback: getDefaultWeather(city),
    };
  }
};

const formatCurrentWeather = (data) => ({
  temperature: data.main.temp,
  feelsLike: data.main.feels_like,
  minTemp: data.main.temp_min,
  maxTemp: data.main.temp_max,
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  windSpeed: data.wind.speed,
  windDirection: data.wind.deg,
  cloudiness: data.clouds.all,
  description: data.weather[0].main,
  details: data.weather[0].description,
  icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  visibility: data.visibility,
  sunrise: new Date(data.sys.sunrise * 1000),
  sunset: new Date(data.sys.sunset * 1000),
});

const formatForecast = (data) => {
  const dailyForecasts = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temps: [],
        description: item.weather[0].main,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
  });

  return Object.values(dailyForecasts).map(day => ({
    ...day,
    avgTemp: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length),
    minTemp: Math.min(...day.temps),
    maxTemp: Math.max(...day.temps),
  }));
};

const generateAlerts = (data) => {
  const alerts = [];

  if (data.main.temp < 0)
    alerts.push({ type: 'cold', message: '❄️ Freezing temperatures. Pack warm clothes.', severity: 'high' });
  if (data.main.temp > 40)
    alerts.push({ type: 'heat', message: '☀️ Extreme heat. Stay hydrated!', severity: 'high' });
  if (data.wind.speed > 10)
    alerts.push({ type: 'wind', message: '💨 Strong winds expected. Exercise caution.', severity: 'medium' });
  if (data.clouds.all > 80)
    alerts.push({ type: 'rain', message: '🌧️ Heavy cloud cover. Bring an umbrella.', severity: 'low' });

  return alerts;
};

const getDefaultWeather = (city) => ({
  temperature: 25,
  description: 'Unable to fetch real data',
  message: 'Please try again later',
});

module.exports = { getWeatherData, weatherCache };
