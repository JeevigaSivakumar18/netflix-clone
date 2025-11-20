const express = require('express');
const MyList = require('../models/MyList');
const Movie = require('../models/Movie');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's my list
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const myList = await MyList.find({ user: req.user._id })
      .populate('movie', 'title description poster backdrop year rating genre duration')
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MyList.countDocuments({ user: req.user._id });

    res.json({
      myList,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get my list error:', error);
    res.status(500).json({ message: 'Failed to fetch my list' });
  }
});

// Add movie to my list
router.post('/add/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie || !movie.isActive) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if already in list
    const existingItem = await MyList.findOne({
      user: req.user._id,
      movie: movieId
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Movie already in your list' });
    }

    // Add to list
    const myListItem = new MyList({
      user: req.user._id,
      movie: movieId
    });

    await myListItem.save();
    await myListItem.populate('movie', 'title description poster backdrop year rating genre duration');

    res.status(201).json({
      message: 'Movie added to your list',
      item: myListItem
    });
  } catch (error) {
    console.error('Add to my list error:', error);
    res.status(500).json({ message: 'Failed to add movie to your list' });
  }
});

// Remove movie from my list
router.delete('/remove/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    const myListItem = await MyList.findOneAndDelete({
      user: req.user._id,
      movie: movieId
    });

    if (!myListItem) {
      return res.status(404).json({ message: 'Movie not found in your list' });
    }

    res.json({ message: 'Movie removed from your list' });
  } catch (error) {
    console.error('Remove from my list error:', error);
    res.status(500).json({ message: 'Failed to remove movie from your list' });
  }
});

// Check if movie is in user's list
router.get('/check/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    const myListItem = await MyList.findOne({
      user: req.user._id,
      movie: movieId
    });

    res.json({
      inList: !!myListItem,
      item: myListItem
    });
  } catch (error) {
    console.error('Check my list error:', error);
    res.status(500).json({ message: 'Failed to check my list' });
  }
});

// Update watch progress
router.put('/progress/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { watchProgress, watched } = req.body;

    if (watchProgress !== undefined && (watchProgress < 0 || watchProgress > 100)) {
      return res.status(400).json({ message: 'Watch progress must be between 0 and 100' });
    }

    const updateData = {};
    if (watchProgress !== undefined) updateData.watchProgress = watchProgress;
    if (watched !== undefined) {
      updateData.watched = watched;
      if (watched) updateData.lastWatchedAt = new Date();
    }

    const myListItem = await MyList.findOneAndUpdate(
      {
        user: req.user._id,
        movie: movieId
      },
      updateData,
      { new: true }
    ).populate('movie', 'title description poster backdrop year rating genre duration');

    if (!myListItem) {
      return res.status(404).json({ message: 'Movie not found in your list' });
    }

    res.json({
      message: 'Watch progress updated',
      item: myListItem
    });
  } catch (error) {
    console.error('Update watch progress error:', error);
    res.status(500).json({ message: 'Failed to update watch progress' });
  }
});

// Get recently watched movies
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentMovies = await MyList.find({
      user: req.user._id,
      watched: true
    })
      .populate('movie', 'title description poster backdrop year rating genre duration')
      .sort({ lastWatchedAt: -1 })
      .limit(parseInt(limit));

    res.json({ movies: recentMovies });
  } catch (error) {
    console.error('Get recent movies error:', error);
    res.status(500).json({ message: 'Failed to fetch recent movies' });
  }
});

// Get watch statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalInList = await MyList.countDocuments({ user: req.user._id });
    const watchedCount = await MyList.countDocuments({ 
      user: req.user._id, 
      watched: true 
    });
    
    const totalWatchTime = await MyList.aggregate([
      { $match: { user: req.user._id, watched: true } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movieData'
        }
      },
      { $unwind: '$movieData' },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$movieData.duration' }
        }
      }
    ]);

    res.json({
      totalInList,
      watchedCount,
      totalWatchTime: totalWatchTime[0]?.totalMinutes || 0
    });
  } catch (error) {
    console.error('Get watch stats error:', error);
    res.status(500).json({ message: 'Failed to fetch watch statistics' });
  }
});

module.exports = router;
