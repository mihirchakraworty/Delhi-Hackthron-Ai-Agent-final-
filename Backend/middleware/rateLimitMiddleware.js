const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const weatherLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.params.city || req.ip,
  message: 'Too many weather requests for this city',
});

const trainLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many train searches. Please wait a moment.',
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
});

module.exports = { apiLimiter, weatherLimiter, trainLimiter, strictLimiter };
