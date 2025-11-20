const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const myListRoutes = require('./routes/myList');
const uploadRoutes = require('./routes/upload');

const app = express();

/* ------------------------------------------------
   ✅ 1. HELMET FIRST (CORS-FRIENDLY CONFIG)
-------------------------------------------------- */
// Use Helmet in production only. In development it can interfere with
// CORS and local debugging (e.g. embedding, iframes, or local assets).
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
  );
} else {
  console.log('Development mode: skipping Helmet to avoid strict security headers');
}

/* ------------------------------------------------
   ✅ 2. CORS AFTER HELMET (IMPORTANT)
-------------------------------------------------- */
// Relax CORS in development to avoid cross-origin issues when running
// frontend from `npm start`. In production we recommend restricting origins.
if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: true, // reflect request origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
}

// Allow all OPTION preflight calls
app.options("*", cors());

/* ------------------------------------------------
   Logging / Rate Limit
-------------------------------------------------- */
app.use(morgan("combined"));

// Apply rate limiting only in production. During development the limiter
// may interfere with iterative testing and cause spurious 429 errors.
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  });
  app.use(limiter);
} else {
  console.log('Development mode: rate limiter disabled');
}

/* ------------------------------------------------
   Body Parsers
-------------------------------------------------- */
app.use(express.json());

// Add this anywhere in your server file after your imports and before your routes


app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/uploads', express.static('uploads'));

/* ------------------------------------------------
   Routes
-------------------------------------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/mylist', myListRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

/* ------------------------------------------------
   Error Handler
-------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    message: "Something went wrong!",
  });
});

/* ------------------------------------------------
   404 Handler
-------------------------------------------------- */
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ------------------------------------------------
   DB / Server
-------------------------------------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));

// Start server with simple retry when the requested port is already in use.
// This helps during development if a previous process didn't shut down.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;
const MAX_PORT_ATTEMPTS = 5;

const tryListen = (port, attemptsLeft) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
      if (attemptsLeft > 0) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort} (${attemptsLeft - 1} attempts left)...`);
        // small delay before retrying
        setTimeout(() => tryListen(nextPort, attemptsLeft - 1), 200);
      } else {
        console.error(`Unable to bind server after ${MAX_PORT_ATTEMPTS} attempts. Please free the port or set a different PORT in your environment.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

tryListen(DEFAULT_PORT, MAX_PORT_ATTEMPTS);
