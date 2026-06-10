const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { location } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    Give top 6 tourist attractions in ${location}.

    Return ONLY JSON format:

    [
      {
        "name":"Place Name",
        "description":"Short Description"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;