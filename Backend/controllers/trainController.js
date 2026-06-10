const { getTrains } = require('../services/trainService');
const { validateStationCode, enrichTrainData } = require('../utils/trainUtils');
const generateTrip = require('../services/geminiService');

const searchTrains = async (req, res) => {
  try {
    const { from, to, date, preferences = {} } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and To station codes are required',
      });
    }

    const validFrom = validateStationCode(from);
    const validTo = validateStationCode(to);

    if (!validFrom || !validTo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid station codes. Please provide valid Indian Railway station codes.',
        examples: ['BBS (Bhubaneswar)', 'NDLS (New Delhi)', 'CSTM (Mumbai Central)'],
      });
    }

    const trainData = await getTrains(from, to, date, preferences);

    if (!trainData.success && trainData.error) {
      return res.status(trainData.error.code || 500).json(trainData);
    }

    const enrichedTrains = (trainData.trains || []).map(train => enrichTrainData(train));

    res.json({
      success: true,
      data: {
        trains: enrichedTrains,
        summary: {
          total: enrichedTrains.length,
          cheapest: enrichedTrains.length > 0 ? findCheapest(enrichedTrains) : null,
          fastest: enrichedTrains.length > 0 ? findFastest(enrichedTrains) : null,
        },
        filters: preferences,
      },
    });

  } catch (error) {
    console.error('🔴 Train Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching trains',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getTrainSuggestions = async (req, res) => {
  try {
    const { from, to, budget, travelers } = req.body;

    const prompt = `
You are an Indian Railway travel expert.

Suggest the best train options.

From: ${from}
To: ${to}
Budget: ₹${budget}
Travelers: ${travelers}

Provide:
- Train Name
- Train Number
- Departure Time
- Arrival Time
- Duration
- Class (SL, 3A, 2A, 1A)
- Approx Fare per person
- Total Fare
- Recommendation

Return ONLY valid JSON.

{
  "trains": [
    {
      "name": "",
      "number": "",
      "departure": "",
      "arrival": "",
      "duration": "",
      "class": "",
      "fare_per_person": "",
      "total_fare": "",
      "recommendation": ""
    }
  ]
}
`;

    const response = await generateTrip(prompt);
    const cleanText = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const trainData = JSON.parse(cleanText);

    res.json({ success: true, trains: trainData.trains });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Train suggestion failed' });
  }
};

const findCheapest = (trains) =>
  trains.reduce((min, current) =>
    (current.totalFare || Infinity) < (min.totalFare || Infinity) ? current : min
  );

const findFastest = (trains) =>
  trains.reduce((fastest, current) => {
    const currDur = current.durationInHours || Infinity;
    const fastDur = fastest.durationInHours || Infinity;
    return currDur < fastDur ? current : fastest;
  });

module.exports = { searchTrains, getTrainSuggestions };
