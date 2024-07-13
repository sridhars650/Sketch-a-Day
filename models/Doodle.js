const mongoose = require('mongoose');

const DoodleSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic URL validation example
        return /^https?:\/\/\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  description: {
    type: String,
    required: true,
  },
  favorites: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Index createdAt field for better query performance
  },
});

// Example of pre-save hook to update createdAt timestamp
DoodleSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// Example of post-save hook for additional actions after saving
DoodleSchema.post('save', function(doc, next) {
  // Additional actions can be performed here
  next();
});

const Doodle = mongoose.model('Doodle', DoodleSchema);

module.exports = Doodle;
