const express = require("express");
const { searchPlace } = require("../controllers/placeController");

console.log("searchPlace =", searchPlace);

const router = express.Router();

router.get("/:place", searchPlace);

module.exports = router;