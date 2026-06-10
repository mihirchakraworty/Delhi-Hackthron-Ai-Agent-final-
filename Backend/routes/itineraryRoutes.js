const router = require("express").Router();

const {
generateItinerary
} =
require("../controllers/itineraryController");

router.post("/",generateItinerary);

module.exports = router;