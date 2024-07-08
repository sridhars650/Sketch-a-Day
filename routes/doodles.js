// routes/doodles.js
const express = require('express');
const router = express.Router();
const Doodle = require('../models/Doodle');

// Get all doodles
router.get('/', async (req, res) => {
  try {
    const doodles = await Doodle.find();
    res.json(doodles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a doodle
router.post('/', async (req, res) => {
  const doodle = new Doodle({
    user: req.body.user,
    image: req.body.image,
    description: req.body.description,
  });

  try {
    const newDoodle = await doodle.save();
    res.status(201).json(newDoodle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
