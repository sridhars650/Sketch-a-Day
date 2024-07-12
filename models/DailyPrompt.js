const mongoose = require('mongoose');

const DailyPromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DailyPrompt', DailyPromptSchema);
