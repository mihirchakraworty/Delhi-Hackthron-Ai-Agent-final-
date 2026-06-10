const router = require("express").Router();

const {
fetchHotels
} = require("../controllers/hotelController");

router.get("/:city",fetchHotels);

module.exports = router;