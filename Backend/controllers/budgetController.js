const calculateBudget = async(req,res)=>{

const {
days,
hotelPerDay,
foodPerDay,
travelCost
} = req.body;

const total =
(days * hotelPerDay)
+
(days * foodPerDay)
+
travelCost;

res.json({
totalBudget: total
});

};

module.exports = {calculateBudget};