const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Movie = require('../models/Movie');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${extension}`);
  }
});

// File filter for video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, avi, mov, wmv, webm)'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Upload video for a movie
router.post('/video/:movieId', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      // Clean up uploaded file if movie doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Remove old video file if exists
    if (movie.videoPath && fs.existsSync(path.join(__dirname, '..', movie.videoPath))) {
      fs.unlinkSync(path.join(__dirname, '..', movie.videoPath));
    }

    // Update movie with new video path
    movie.videoPath = `/uploads/${req.file.filename}`;
    await movie.save();

    res.json({
      message: 'Video uploaded successfully',
      videoPath: movie.videoPath,
      movie: {
        id: movie._id,
        title: movie.title,
        videoPath: movie.videoPath
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to upload video' });
  }
});

// Upload poster image
router.post('/poster', authenticateToken, upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No poster image uploaded' });
    }

    res.json({
      message: 'Poster uploaded successfully',
      posterPath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Poster upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to upload poster' });
  }
});

// Upload backdrop image
router.post('/backdrop', authenticateToken, upload.single('backdrop'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No backdrop image uploaded' });
    }

    res.json({
      message: 'Backdrop uploaded successfully',
      backdropPath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Backdrop upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to upload backdrop' });
  }
});

// Delete video file
router.delete('/video/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.videoPath) {
      const videoPath = path.join(__dirname, '..', movie.videoPath);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      
      movie.videoPath = null;
      await movie.save();
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Failed to delete video' });
  }
});

// Get video streaming endpoint
router.get('/video/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie || !movie.videoPath) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const videoPath = path.join(__dirname, '..', movie.videoPath);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    // Set appropriate headers for video streaming
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Partial content request
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Full content request
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Video streaming error:', error);
    res.status(500).json({ message: 'Failed to stream video' });
  }
});

module.exports = router;
