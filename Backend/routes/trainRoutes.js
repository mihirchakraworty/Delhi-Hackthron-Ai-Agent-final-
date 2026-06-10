const express = require('express');
const router = express.Router();
const { searchTrains, getTrainSuggestions } = require('../controllers/trainController');

router.post('/search', searchTrains);
router.post('/suggestions', getTrainSuggestions);

module.exports = router;
