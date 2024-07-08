// models/Doodle.js
const mongoose = require('mongoose');

const DoodleSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doodle', DoodleSchema);
