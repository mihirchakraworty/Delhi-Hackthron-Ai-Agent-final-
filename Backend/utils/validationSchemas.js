// Validation helpers (Joi-style, compatible with Joi if installed)
// These can be used with Joi or as standalone validators

const validateTrainSearch = (body) => {
  const errors = [];
  if (!body.from) errors.push('From station code is required');
  if (!body.to) errors.push('To station code is required');
  if (body.from && !/^[A-Z]{2,5}$/i.test(body.from)) errors.push('Invalid from station code format');
  if (body.to && !/^[A-Z]{2,5}$/i.test(body.to)) errors.push('Invalid to station code format');
  return errors;
};

const validateWeatherQuery = (params) => {
  const errors = [];
  if (!params.city || params.city.trim().length < 2) errors.push('City name must be at least 2 characters');
  return errors;
};

const validatePlacesSearch = (body) => {
  const errors = [];
  if (!body.query || body.query.trim().length < 2) errors.push('Search query must be at least 2 characters');
  if (body.radius && body.radius > 50000) errors.push('Radius cannot exceed 50000 meters');
  return errors;
};

const validateDirections = (body) => {
  const errors = [];
  if (!body.origin) errors.push('Origin is required');
  if (!body.destination) errors.push('Destination is required');
  const validModes = ['driving', 'walking', 'bicycling', 'transit'];
  if (body.mode && !validModes.includes(body.mode)) errors.push(`Mode must be one of: ${validModes.join(', ')}`);
  return errors;
};

module.exports = { validateTrainSearch, validateWeatherQuery, validatePlacesSearch, validateDirections };
