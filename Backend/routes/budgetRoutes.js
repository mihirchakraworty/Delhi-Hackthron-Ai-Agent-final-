
const router = require("express").Router();

const {
calculateBudget
} = require("../controllers/budgetController");

router.post("/",calculateBudget);

module.exports = router;