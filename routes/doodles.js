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

// Favorite a doodle
router.post('/:id/favorite', async (req, res) => {
  try {
    const doodle = await Doodle.findById(req.params.id);
    if (!doodle) {
      return res.status(404).json({ message: 'Doodle not found' });
    }

    const previousFavoriteId = req.body.previousFavoriteId;

    if (previousFavoriteId && previousFavoriteId !== doodle._id.toString()) {
      const prevDoodle = await Doodle.findById(previousFavoriteId);
      if (prevDoodle) {
        prevDoodle.favorites -= 1; // Decrease previous favorite count
        await prevDoodle.save();
      }
    }

    doodle.favorites += 1; // Increase favorite count
    await doodle.save();
    
    res.json({ currentFavoriteId: doodle._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Unfavorite a doodle
router.delete('/:id/favorite', async (req, res) => {
  try {
    const doodle = await Doodle.findById(req.params.id);
    if (!doodle) {
      return res.status(404).json({ message: 'Doodle not found' });
    }
    if (doodle.favorites > 0) {
      doodle.favorites -= 1; // Decrease favorite count
    }
    await doodle.save();
    res.json(doodle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
