const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache (1 hour TTL)
const trainCache = new NodeCache({ stdTTL: 3600 });

const getTrains = async (from, to, date = null, preferences = {}) => {
  try {
    const cacheKey = `trains_${from}_${to}_${date}`;
    const cachedData = trainCache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached train data');
      return { ...cachedData, fromCache: true };
    }

    const options = {
      method: 'GET',
      url: 'https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/trainBetweenStations',
      params: {
        fromStationCode: from,
        toStationCode: to,
        dateOfJourney: date || new Date().toISOString().split('T')[0],
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'indian-railway-irctc.p.rapidapi.com',
      },
      timeout: 10000,
    };

    const response = await axios.request(options);
    let trains = response.data?.data || [];

    if (preferences.maxDuration) {
      trains = filterByDuration(trains, preferences.maxDuration);
    }
    if (preferences.classPreference) {
      trains = filterByClass(trains, preferences.classPreference);
    }
    if (preferences.maxFare) {
      trains = filterByFare(trains, preferences.maxFare);
    }

    const sortedTrains = sortTrains(trains, preferences.sortBy || 'departure');

    trainCache.set(cacheKey, {
      trains: sortedTrains,
      timestamp: new Date(),
      count: sortedTrains.length,
    });

    return {
      success: true,
      trains: sortedTrains,
      count: sortedTrains.length,
      from,
      to,
      date,
    };

  } catch (error) {
    console.error('🔴 Train API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: {
        message: 'Unable to fetch train information',
        code: error.response?.status || 500,
        details: error.response?.data?.error || error.message,
      },
      fallbackMessage: 'Please try with different station codes or dates.',
    };
  }
};

const filterByDuration = (trains, maxMinutes) => {
  return trains.filter(train => {
    const duration = calculateDuration(train.departureTime, train.arrivalTime);
    return duration <= maxMinutes;
  });
};

const filterByClass = (trains, classPreference) => {
  return trains.filter(train => {
    const availableClasses = train.classes || [];
    return availableClasses.includes(classPreference);
  });
};

const filterByFare = (trains, maxFare) => {
  return trains.filter(train => {
    const minFare = train.fare?.min || train.totalFare || 0;
    return minFare <= maxFare;
  });
};

const sortTrains = (trains, sortBy) => {
  const sortMap = {
    departure: (a, b) => new Date(a.departureTime) - new Date(b.departureTime),
    arrival: (a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime),
    fare: (a, b) => (a.totalFare || 0) - (b.totalFare || 0),
    duration: (a, b) =>
      calculateDuration(a.departureTime, a.arrivalTime) -
      calculateDuration(b.departureTime, b.arrivalTime),
  };
  return trains.sort(sortMap[sortBy] || sortMap.departure);
};

const calculateDuration = (departure, arrival) => {
  const start = new Date(departure);
  const end = new Date(arrival);
  return (end - start) / (1000 * 60);
};

module.exports = { getTrains, trainCache };
