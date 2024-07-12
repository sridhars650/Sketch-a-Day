// routes/prompts.js
const express = require('express');
const router = express.Router();
const DailyPrompt = require('../models/DailyPrompt');

// Get the daily prompt
router.get('/', async (req, res) => {
  try {
    const prompt = await DailyPrompt.findOne().sort({ date: -1 });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
