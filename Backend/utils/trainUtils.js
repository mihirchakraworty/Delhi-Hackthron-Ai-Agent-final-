const STATION_CODES = {
  'delhi': 'NDLS', 'mumbai': 'CSTM', 'bangalore': 'SBC', 'kolkata': 'KOLKATA',
  'chennai': 'MSMCE', 'hyderabad': 'SC', 'pune': 'PUNE', 'bhubaneswar': 'BBS',
  'jaipur': 'JP', 'ahmedabad': 'ADI', 'lucknow': 'LC', 'indore': 'INDB',
  'surat': 'ST', 'chandigarh': 'CDG', 'guwahati': 'GHY',
};

const TRAIN_CLASSES = {
  'SL': { name: 'Sleeper', comfort: 1, price: 'low' },
  '3A': { name: '3rd AC', comfort: 2, price: 'low-mid' },
  '2A': { name: '2nd AC', comfort: 3, price: 'mid' },
  '1A': { name: '1st AC', comfort: 4, price: 'high' },
  'FC': { name: 'First Class', comfort: 5, price: 'very-high' },
};

const validateStationCode = (code) => {
  const lowerCode = code.toLowerCase();
  for (const [city, stationCode] of Object.entries(STATION_CODES)) {
    if (code.toUpperCase() === stationCode || lowerCode === city) return true;
  }
  // Accept any 2-5 char uppercase code as potentially valid
  return /^[A-Z]{2,5}$/.test(code.toUpperCase());
};

const getStationCodeFromCity = (cityName) => STATION_CODES[cityName.toLowerCase()] || null;

const enrichTrainData = (train) => ({
  ...train,
  classInfo: TRAIN_CLASSES[train.class] || {},
  durationInHours: calculateDuration(train.departureTime, train.arrivalTime),
  comfortRating: calculateComfortRating(train),
  recommendation: getTrainRecommendation(train),
  bookingUrl: 'https://www.irctc.co.in/nget/train-search',
});

const calculateDuration = (departure, arrival) => {
  if (!departure || !arrival) return null;
  const start = new Date(departure);
  const end = new Date(arrival);
  return parseFloat(((end - start) / (1000 * 60 * 60)).toFixed(1));
};

const calculateComfortRating = (train) => {
  if (train.class === '1A' || train.class === 'FC') return 5;
  if (train.class === '2A') return 4;
  if (train.class === '3A') return 3;
  if (train.class === 'SL') return 2;
  return 3;
};

const getTrainRecommendation = (train) => {
  const duration = calculateDuration(train.departureTime, train.arrivalTime);
  if (!duration) return '🚂 Check train details for journey info';
  if (duration < 6) return '⭐ Excellent for short journeys';
  if (duration < 12) return '👍 Good option with comfortable rest';
  if (duration < 24) return '💤 Overnight journey - good for sleep';
  return '🚂 Long journey - prepare snacks and entertainment';
};

module.exports = {
  STATION_CODES, TRAIN_CLASSES, validateStationCode, getStationCodeFromCity,
  enrichTrainData, calculateDuration, calculateComfortRating, getTrainRecommendation,
};
