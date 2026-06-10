const axios = require('axios');

const createApiClient = (baseURL, timeout = 10000) => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'User-Agent': 'AI-Travel-Planner/1.0',
      'Content-Type': 'application/json',
    },
  });
};

const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.response?.status >= 400 && error.response?.status !== 429) throw error;
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError;
};

const batchRequests = async (requests, concurrency = 5) => {
  const results = [];
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  return results;
};

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }
}

module.exports = { createApiClient, retryRequest, batchRequests, RateLimiter };
