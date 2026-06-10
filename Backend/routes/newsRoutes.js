const express = require("express");
const router = express.Router();
const { fetchNews, fetchGeneralTravelNews } = require("../controllers/newsController");

router.get("/", fetchGeneralTravelNews);
router.get("/:destination", fetchNews);

module.exports = router;
