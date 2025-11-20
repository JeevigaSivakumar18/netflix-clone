const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one genre is required'
    }
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [10, 'Rating cannot exceed 10'],
    default: 0
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Movie duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  poster: {
    type: String,
    required: [true, 'Poster image is required']
  },
  backdrop: {
    type: String,
    required: [true, 'Backdrop image is required']
  },
  videoPath: {
    type: String,
    default: null // Path to uploaded video file
  },
  trailerUrl: {
    type: String,
    default: null
  },
  cast: [{
    name: String,
    character: String
  }],
  director: {
    type: String,
    trim: true
  },
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Game-related fields
  hint: {
    type: String,
    default: null
  },
  quote: {
    type: String,
    default: null
  },
  trivia: [{
    question: String,
    answer: String,
    options: [String]
  }]
}, {
  timestamps: true
});

// Index for search functionality
movieSchema.index({ title: 'text', description: 'text', genre: 'text' });
movieSchema.index({ genre: 1, year: -1 });
movieSchema.index({ featured: -1, rating: -1 });

module.exports = mongoose.model('Movie', movieSchema);
