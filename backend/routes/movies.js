const express = require("express");
const Movie = require("../models/Movie");
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const { validate, movieSchema } = require("../middleware/validation");

const router = express.Router();

/* --------------------------------------------------
   🎯 FIXED ROUTE ORDER - SPECIFIC ROUTES FIRST
-------------------------------------------------- */

// ✅ TEST ROUTE - MUST COME BEFORE /:id
router.get("/test", (req, res) => {
  res.json({ message: "Movies API is working!" });
});

// ✅ HOMEPAGE SECTIONS - MUST COME BEFORE /:id  
router.get("/homepage/sections", optionalAuth, async (req, res) => {
  try {
    console.log("Homepage sections endpoint called");
    
    // Get movies for different sections
    const trending = await Movie.find({ isActive: true })
      .sort({ rating: -1, views: -1 })
      .limit(15)
      .lean();

    const topRated = await Movie.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(15)
      .lean();

    const recent = await Movie.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    res.json({
      trending,
      topRated,
      recent,
      suggestions: trending, // Use trending as fallback
    });
  } catch (error) {
    console.error("Homepage sections error:", error);
    res.status(500).json({ message: "Failed to load homepage sections" });
  }
});

// ✅ FEATURED MOVIES
router.get("/featured/list", optionalAuth, async (req, res) => {
  try {
    const movies = await Movie.find({ featured: true, isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ movies });
  } catch (error) {
    console.error("Get featured movies error:", error);
    res.status(500).json({ message: "Failed to fetch featured movies" });
  }
});

// ✅ OTHER SPECIFIC ROUTES (keep your existing ones)
router.get("/genres/list", async (req, res) => {
  try {
    const genres = await Movie.distinct("genre", { isActive: true });
    res.json({ genres });
  } catch (error) {
    console.error("Get genres error:", error);
    res.status(500).json({ message: "Failed to fetch genres" });
  }
});

// ✅ MORE SPECIFIC ROUTES...
router.get("/genre/:genre", optionalAuth, async (req, res) => {
  // your existing code
});

router.get("/search/:query", optionalAuth, async (req, res) => {
  // your existing code
});

router.get("/random/one", optionalAuth, async (req, res) => {
  // your existing code
});

// ✅ MAIN MOVIES LIST
router.get("/", optionalAuth, async (req, res) => {
  // your existing code
});

/* --------------------------------------------------
   🚨 KEEP /:id AS THE VERY LAST ROUTE
-------------------------------------------------- */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json({ movie });
  } catch (error) {
    console.error("Get movie error:", error);
    res.status(500).json({ message: "Failed to fetch movie" });
  }
});

// ... rest of your admin routes

module.exports = router;