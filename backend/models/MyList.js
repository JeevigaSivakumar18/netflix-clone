const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required']
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  watched: {
    type: Boolean,
    default: false
  },
  watchProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0 // Percentage watched
  },
  lastWatchedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Ensure a user can't add the same movie twice
myListSchema.index({ user: 1, movie: 1 }, { unique: true });

// Index for efficient queries
myListSchema.index({ user: 1, addedAt: -1 });

module.exports = mongoose.model('MyList', myListSchema);
