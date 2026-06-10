const generateTrip = require("../services/geminiService");


const createTrip = async (req, res) => {
  try {

    const {
      budget,
      days,
      travelers,
      destination
    } = req.body;

    const prompt = `
    Create a travel plan.

    Budget: ₹${budget}
    Days: ${days}
    Travelers: ${travelers}
    Destination: ${destination}

    Include:
    - itinerary
    - hotels
    - transport
    - estimated budget
    `;

    const aiResponse = await generateTrip(prompt);

    res.json({
      success: true,
      trip: aiResponse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



module.exports = {
  createTrip
};