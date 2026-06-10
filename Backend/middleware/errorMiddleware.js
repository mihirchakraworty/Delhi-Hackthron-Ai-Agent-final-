const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.response?.config?.url?.includes('openweathermap')) {
    return res.status(status).json({
      success: false,
      error: 'Weather Service Error',
      message: 'Unable to fetch weather data',
      original: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  }

  if (err.response?.config?.url?.includes('rapidapi')) {
    return res.status(status).json({
      success: false,
      error: 'External Service Error',
      message: 'Unable to fetch requested information',
      original: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  }

  if (err.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      error: 'Request Timeout',
      message: 'The server took too long to respond',
    });
  }

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
