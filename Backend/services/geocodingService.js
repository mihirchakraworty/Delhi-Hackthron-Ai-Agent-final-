const axios = require('axios');
const NodeCache = require('node-cache');

const geoCache = new NodeCache({ stdTTL: 86400 }); // 24hr cache — coordinates don't change

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Geocode a city name → { lat, lng, formattedAddress, country, state }
 * Uses Google Geocoding API if key is configured, falls back to Nominatim (free, no key)
 */
const geocodeCity = async (city) => {
  const cacheKey = `geo_${city.toLowerCase().trim()}`;
  const cached = geoCache.get(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  // Try Google Geocoding API first (if key configured)
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: city, key: GOOGLE_MAPS_API_KEY },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;

        const components = result.address_components;
        const country = components.find(c => c.types.includes('country'))?.long_name || '';
        const state = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
        const locality = components.find(c => c.types.includes('locality'))?.long_name || city;

        const data = {
          lat, lng,
          formattedAddress: result.formatted_address,
          locality, state, country,
          source: 'google_geocoding',
        };
        geoCache.set(cacheKey, data);
        return data;
      }
    } catch (err) {
      console.warn('Google Geocoding failed, falling back to Nominatim:', err.message);
    }
  }

  // Fallback: OpenStreetMap Nominatim (completely free, no key needed)
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: city, format: 'json', limit: 1, addressdetails: 1 },
      headers: { 'User-Agent': 'AI-Travel-Planner/1.0' },
    });

    if (response.data.length === 0) throw new Error('City not found');

    const result = response.data[0];
    const data = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      formattedAddress: result.display_name,
      locality: result.address?.city || result.address?.town || result.address?.village || city,
      state: result.address?.state || '',
      country: result.address?.country || '',
      source: 'nominatim',
    };
    geoCache.set(cacheKey, data);
    return data;

  } catch (err) {
    console.error('Nominatim geocoding failed:', err.message);
    return null;
  }
};

/**
 * Reverse geocode lat/lng → address string
 */
const reverseGeocode = async (lat, lng) => {
  const cacheKey = `revgeo_${lat}_${lng}`;
  const cached = geoCache.get(cacheKey);
  if (cached) return cached;

  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { latlng: `${lat},${lng}`, key: GOOGLE_MAPS_API_KEY },
      });
      if (response.data.status === 'OK') {
        const address = response.data.results[0]?.formatted_address || `${lat},${lng}`;
        geoCache.set(cacheKey, address);
        return address;
      }
    } catch {}
  }

  // Nominatim fallback
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'AI-Travel-Planner/1.0' },
    });
    const address = response.data.display_name || `${lat},${lng}`;
    geoCache.set(cacheKey, address);
    return address;
  } catch {
    return `${lat},${lng}`;
  }
};

module.exports = { geocodeCity, reverseGeocode };
