const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    destination: String,
    budget: Number,
    days: Number,
    travelers: Number,
    prompt: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);