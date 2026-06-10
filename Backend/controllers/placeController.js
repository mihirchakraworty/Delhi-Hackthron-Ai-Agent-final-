const getPlaceInfo = require("../services/wikipediaService");

const searchPlace = async (req, res) => {
  try {
    const { place } = req.params;

    const data = await getPlaceInfo(place);

    res.json({
      success: true,
      place: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { searchPlace };