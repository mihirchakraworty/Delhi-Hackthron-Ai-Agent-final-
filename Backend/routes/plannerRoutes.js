const express = require("express");

const {
  createTrip
} = require("../controllers/plannerController");

const router = express.Router();

router.post("/generate", createTrip);

module.exports = router;