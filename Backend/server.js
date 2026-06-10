const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter, weatherLimiter, trainLimiter } = require('./middleware/rateLimitMiddleware');

// Routes
const plannerRoutes = require('./routes/plannerRoutes');
const placeRoutes = require('./routes/placeRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const trainRoutes = require('./routes/trainRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const mapsRoutes = require('./routes/mapsRoutes');
const newsRoutes = require('./routes/newsRoutes');

console.log('--- Environment Variables Check ---');
console.log('PORT =', process.env.PORT || 5000);
console.log('MONGO_URL =', process.env.MONGO_URL ? '✅ Loaded' : '❌ Missing');
console.log('GEMINI_API_KEY =', process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ Loaded' : '⚠️  Not configured');
console.log('WEATHER_API_KEY =', process.env.WEATHER_API_KEY && process.env.WEATHER_API_KEY !== 'your_weatherstack_api_key_here' ? '✅ Loaded' : '⚠️  Not configured');
console.log('GOOGLE_MAPS_API_KEY (Geocoding) =', process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? '✅ Loaded' : '⚠️  Not configured (will use free Nominatim fallback)');
console.log('MEDIASTACK_API_KEY =', process.env.MEDIASTACK_API_KEY && process.env.MEDIASTACK_API_KEY !== 'your_mediastack_api_key_here' ? '✅ Loaded' : '⚠️  Not configured');
console.log('-----------------------------------');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.get('/', (req, res) => res.send('AI Travel Planner Backend Running 🚀'));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() }));

app.use('/api/planner', plannerRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/weather', weatherLimiter, weatherRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/trains', trainLimiter, trainRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/news', newsRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: 'Not Found', message: `Route ${req.path} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server Running on Port ${PORT}`));
