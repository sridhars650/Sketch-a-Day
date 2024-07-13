const mongoose = require('mongoose');

const DailyPromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

DailyPromptSchema.post('save', function(doc, next) {
  console.log(`A new daily prompt was saved: ${doc.prompt}`);
  next();
});

const DailyPrompt = mongoose.model('DailyPrompt', DailyPromptSchema);

module.exports = DailyPrompt;
