const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: String,
    },
  ],
  competition: {
    type: String,
    required: true,
  },
  isIndividual: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: Number,
  },
});

module.exports = mongoose.model("Team", teamSchema);
