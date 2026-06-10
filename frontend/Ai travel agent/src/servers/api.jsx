import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Hotels — Gemini AI suggestions
export const getHotels = async (city, { budget, travelers = 1, stars, type } = {}) => {
  const params = { adults: travelers };
  if (budget) params.budget = budget;
  if (stars)  params.stars  = stars;
  if (type)   params.type   = type;
  const response = await axios.get(`${BASE_URL}/api/hotels/${city}`, { params });
  return response.data;
};

export const getWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/api/weather/${city}`);
  return response.data;
};

export const getItinerary = async ({ city, days, budget, travelers, description }) => {
  const response = await axios.post(`${BASE_URL}/api/itinerary`, { city, days, budget, travelers, description });
  return response.data;
};

export const getBudget = async (data) => {
  const response = await axios.post(`${BASE_URL}/api/budget`, data);
  return response.data;
};

// Geocoding API (Google Geocoding or Nominatim fallback)
export const geocodeCity = async (city) => {
  const response = await axios.post(`${BASE_URL}/api/maps/geocode`, { city });
  return response.data;
};

export const reverseGeocode = async (lat, lng) => {
  const response = await axios.get(`${BASE_URL}/api/maps/reverse`, { params: { lat, lng } });
  return response.data;
};

// News
export const getTravelNews = async (destination = "India travel") => {
  const response = await axios.get(`${BASE_URL}/api/news/${encodeURIComponent(destination)}`);
  return response.data;
};
