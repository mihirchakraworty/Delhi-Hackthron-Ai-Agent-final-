/**
 * googleMapsService.js
 *
 * Now uses ONLY the Geocoding API.
 * Places search, Directions, and Distance Matrix have been removed.
 * Use geocodingService.js for lat/lng lookups.
 * The frontend uses OpenStreetMap + Overpass API directly for place discovery (no API key needed).
 */

// Re-export geocoding for any controllers that imported from here
const { geocodeCity, reverseGeocode } = require('./geocodingService');

module.exports = { geocodeCity, reverseGeocode };
