# 🎬 Netflix Clone - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Features Implemented](#features-implemented)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Setup Instructions](#setup-instructions)
10. [Project Structure](#project-structure)

---

## 🎯 Project Overview

This is a **full-stack Netflix clone** application built with **React** (frontend) and **Express.js + MongoDB** (backend). The project has been completely migrated from Firebase to a custom backend solution with MongoDB Atlas for database management.

### Key Highlights:
- ✅ **JWT-based Authentication** with secure password hashing
- ✅ **MongoDB Atlas** for cloud database storage
- ✅ **RESTful API** architecture
- ✅ **Netflix-style UI** with dark theme and smooth animations
- ✅ **Interactive Games** (4 different movie-themed games)
- ✅ **My List** functionality for saving favorite movies
- ✅ **Video Upload & Streaming** capability
- ✅ **Responsive Design** for all devices

---

## 🏗️ Architecture

### System Architecture:
```
┌─────────────────┐
│   React Frontend │  (Port 3000)
│   - Redux Store  │
│   - Auth Context │
└────────┬────────┘
         │ HTTP/REST API
         │ (Axios)
         ▼
┌─────────────────┐
│  Express Backend │  (Port 5000)
│   - JWT Auth     │
│   - REST Routes  │
└────────┬────────┘
         │ Mongoose ODM
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│   - Users        │
│   - Movies       │
│   - MyLists      │
└─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend:
- **React 19.1.1** - UI library
- **React Router DOM 7.8.2** - Routing
- **Redux Toolkit 2.8.2** - State management
- **Axios 1.12.2** - HTTP client
- **Styled Components 6.1.19** - CSS-in-JS styling
- **React Icons 5.5.0** - Icon library
- **Lucide React 0.544.0** - Modern icons

### Backend:
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **Mongoose 8.0.3** - MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Joi 17.11.0** - Input validation
- **Helmet 7.1.0** - Security headers
- **CORS 2.8.5** - Cross-origin resource sharing
- **Morgan 1.10.0** - HTTP request logger

### Database:
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - Object Data Modeling

---

## 🔧 Backend Implementation

### Server Configuration (`backend/server.js`)
- Express server setup with middleware
- CORS configuration for frontend communication
- Security middleware (Helmet)
- Rate limiting (100 requests per 15 minutes)
- Error handling middleware
- Static file serving for uploads
- MongoDB connection with Mongoose

### Database Models

#### 1. User Model (`backend/models/User.js`)
```javascript
{
  email: String (unique, required),
  password: String (hashed with bcrypt),
  name: String,
  avatar: String,
  isActive: Boolean (default: true),
  lastLogin: Date,
  timestamps: true
}
```
**Features:**
- Password hashing with bcrypt (12 salt rounds)
- Email validation
- Password comparison method
- JSON output excludes password

#### 2. Movie Model (`backend/models/Movie.js`)
```javascript
{
  title: String (required),
  description: String (required),
  genre: [String] (required),
  year: Number (required),
  rating: Number (0-10),
  duration: Number (minutes),
  poster: String (URL),
  backdrop: String (URL),
  videoPath: String (local file path),
  trailerUrl: String,
  cast: [{name, character}],
  director: String,
  hint: String (for games),
  quote: String (for games),
  trivia: [{question, answer, options}],
  featured: Boolean,
  isActive: Boolean,
  timestamps: true
}
```
**Features:**
- Text search indexing (title, description, genre)
- Genre and year indexing for filtering
- Featured movies indexing

#### 3. MyList Model (`backend/models/MyList.js`)
```javascript
{
  user: ObjectId (ref: User),
  movie: ObjectId (ref: Movie),
  addedAt: Date,
  watched: Boolean,
  watchProgress: Number (0-100%),
  lastWatchedAt: Date,
  timestamps: true
}
```
**Features:**
- Unique constraint on user+movie combination
- Watch progress tracking
- Populated queries for movie details

### API Routes

#### Authentication Routes (`backend/routes/auth.js`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout (client-side token removal)
- `GET /api/auth/verify` - Verify JWT token

#### Movie Routes (`backend/routes/movies.js`)
- `GET /api/movies` - Get all movies (with pagination, filtering, search)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie (admin)
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Soft delete movie
- `GET /api/movies/featured/list` - Get featured movies
- `GET /api/movies/genre/:genre` - Get movies by genre
- `GET /api/movies/search/:query` - Search movies
- `GET /api/movies/random/one` - Get random movie
- `GET /api/movies/genres/list` - Get all genres

#### MyList Routes (`backend/routes/myList.js`)
- `GET /api/mylist` - Get user's my list
- `POST /api/mylist/add/:movieId` - Add movie to list
- `DELETE /api/mylist/remove/:movieId` - Remove from list
- `GET /api/mylist/check/:movieId` - Check if in list
- `PUT /api/mylist/progress/:movieId` - Update watch progress
- `GET /api/mylist/recent` - Get recently watched
- `GET /api/mylist/stats` - Get watch statistics

#### Upload Routes (`backend/routes/upload.js`)
- `POST /api/upload/video/:movieId` - Upload video file
- `POST /api/upload/poster` - Upload poster image
- `POST /api/upload/backdrop` - Upload backdrop image
- `DELETE /api/upload/video/:movieId` - Delete video
- `GET /api/upload/video/:movieId` - Stream video (with range support)

### Middleware

#### Authentication Middleware (`backend/middleware/auth.js`)
- `authenticateToken` - Verify JWT token (required)
- `optionalAuth` - Optional authentication (doesn't fail if no token)

#### Validation Middleware (`backend/middleware/validation.js`)
- User registration schema validation
- User login schema validation
- Movie schema validation
- Joi-based validation with detailed error messages

### Database Seeding
- Script: `backend/scripts/seedMovies.js`
- Seeds 10 sample movies with complete metadata
- Includes game-related fields (hints, quotes, trivia)
- Run with: `npm run seed`

---

## 💻 Frontend Implementation

### State Management

#### Redux Store (`src/store/`)
- **netflixSlice.js** - Movie state management
  - `fetchMoviesFromAPI` - Fetch all movies
  - `fetchFeaturedMovies` - Get featured movies
  - `searchMovies` - Search functionality
  - `getRandomMovie` - Random movie selection
  
- **myListSlice.jsx** - My List state management
  - `fetchMyList` - Get user's list
  - `addToMyList` - Add movie
  - `removeFromMyList` - Remove movie
  - `checkMyListStatus` - Check if movie in list
  - `updateWatchProgress` - Track watch progress

- **genreSlice.js** - Genre management

### Authentication Context (`src/contexts/AuthContext.jsx`)
- Global authentication state
- Login/Register/Logout functions
- Token management with localStorage
- Auto token verification on app load
- Protected route support

### API Service Layer (`src/services/api.js`)
- Centralized Axios configuration
- Request interceptor for JWT tokens
- Response interceptor for error handling
- Organized API methods:
  - `authAPI` - Authentication endpoints
  - `moviesAPI` - Movie endpoints
  - `myListAPI` - My List endpoints
  - `uploadAPI` - File upload endpoints

### Pages

#### 1. **Netflix.jsx** - Main Landing Page
- Hero banner with featured movie
- Auto-rotating featured movies
- Movie sliders by genre
- Video player modal for trailers
- Netflix-style dark theme

#### 2. **Login.jsx** - Login Page
- Email/password authentication
- Error handling and display
- Loading states
- Redirect to home on success

#### 3. **Signup.jsx** - Registration Page
- Multi-step form (email → password → name)
- Password validation (min 6 characters)
- Error handling
- Auto-redirect on success

#### 4. **Movies.jsx** - Movies Browse Page
- Genre filtering
- Search functionality
- Movie grid display
- Responsive design

#### 5. **MyList.jsx** - User's Saved Movies
- Display saved movies
- Add/remove functionality
- Empty state handling
- Watch progress tracking

#### 6. **Games.jsx** - Games Hub
- Beautiful grid layout
- 4 interactive games:
  - Guess The Movie
  - Quote Quiz
  - Movie Trivia
  - Scene Shuffle
- Game difficulty indicators
- Player count display

#### 7. **Player.jsx** - Video Player
- Movie playback
- Video streaming support
- Movie details display

#### 8. **FeelingLucky.jsx** - Random Movie Selector
- Random movie selection
- One-click navigation to player

### Game Pages

#### 1. **GuessTheMovie.jsx**
- Display movie hints
- User input for movie title
- Score tracking
- Random movie selection

#### 2. **QuoteQuiz.jsx**
- Display movie quotes
- Multiple choice answers
- Score tracking
- Next question functionality

#### 3. **MovieTrivia.jsx**
- Trivia questions about movies
- Multiple choice
- Score tracking
- Play again functionality

#### 4. **SceneShuffle.jsx**
- Shuffled movie scenes
- Arrange in correct order
- Visual feedback
- Score tracking

### Components

#### UI Components
- **Card.jsx** - Movie card with hover effects
- **CardSlider.jsx** - Horizontal movie slider
- **Slider.jsx** - Genre-based movie slider
- **Navbar.jsx** - Navigation bar with Games dropdown
- **Loading.jsx** - Loading spinner
- **ErrorMessage.jsx** - Error display
- **ProtectedRoute.jsx** - Route protection wrapper
- **BackgroundImage.jsx** - Background image component
- **Header.jsx** - Page header component

#### Styled Components
- Netflix-inspired dark theme (#141414 background)
- Red accent color (#E50914)
- Smooth hover animations
- Responsive design
- Modern typography

---

## ✨ Features Implemented

### Authentication & Authorization
- ✅ User registration with email/password
- ✅ User login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Token-based authentication
- ✅ Protected routes
- ✅ Auto token verification
- ✅ Session persistence with localStorage

### Movie Management
- ✅ Browse all movies
- ✅ Featured movies display
- ✅ Genre-based filtering
- ✅ Search functionality
- ✅ Random movie selection
- ✅ Movie details view
- ✅ Trailer playback
- ✅ Movie metadata (cast, director, year, rating)

### My List
- ✅ Add movies to personal list
- ✅ Remove movies from list
- ✅ Check if movie in list
- ✅ Watch progress tracking
- ✅ Recently watched movies
- ✅ Watch statistics

### Games
- ✅ 4 interactive movie-themed games
- ✅ Score tracking
- ✅ Random question/movie selection
- ✅ Beautiful game UI
- ✅ Game difficulty indicators

### UI/UX
- ✅ Netflix-style dark theme
- ✅ Smooth hover animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Modern card-based layout

### File Management
- ✅ Video upload capability
- ✅ Poster/backdrop image upload
- ✅ Video streaming with range support
- ✅ File deletion

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Authentication
```
POST   /auth/register      - Register new user
POST   /auth/login          - Login user
GET    /auth/me             - Get current user
PUT    /auth/profile        - Update profile
POST   /auth/logout         - Logout
GET    /auth/verify         - Verify token
```

#### Movies
```
GET    /movies              - Get all movies
GET    /movies/:id          - Get movie by ID
POST   /movies              - Create movie
PUT    /movies/:id          - Update movie
DELETE /movies/:id          - Delete movie
GET    /movies/featured/list - Featured movies
GET    /movies/genre/:genre - Movies by genre
GET    /movies/search/:query - Search movies
GET    /movies/random/one   - Random movie
GET    /movies/genres/list  - All genres
```

#### My List
```
GET    /mylist              - Get user's list
POST   /mylist/add/:movieId - Add to list
DELETE /mylist/remove/:movieId - Remove from list
GET    /mylist/check/:movieId - Check status
PUT    /mylist/progress/:movieId - Update progress
GET    /mylist/recent       - Recent movies
GET    /mylist/stats        - Statistics
```

#### Upload
```
POST   /upload/video/:movieId - Upload video
POST   /upload/poster        - Upload poster
POST   /upload/backdrop      - Upload backdrop
DELETE /upload/video/:movieId - Delete video
GET    /upload/video/:movieId - Stream video
```

---

## 🗄️ Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### movies
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  genre: [String],
  year: Number,
  rating: Number,
  duration: Number,
  poster: String,
  backdrop: String,
  videoPath: String,
  trailerUrl: String,
  cast: [{name, character}],
  director: String,
  hint: String,
  quote: String,
  trivia: [{question, answer, options}],
  featured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### mylists
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  movie: ObjectId (ref: movies),
  addedAt: Date,
  watched: Boolean,
  watchProgress: Number,
  lastWatchedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📁 Project Structure

```
netflix-ui/
├── backend/                    # Express.js Backend
│   ├── models/                 # MongoDB Models
│   │   ├── User.js
│   │   ├── Movie.js
│   │   └── MyList.js
│   ├── routes/                 # API Routes
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── myList.js
│   │   └── upload.js
│   ├── middleware/             # Middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── scripts/                # Utility Scripts
│   │   └── seedMovies.js
│   ├── uploads/                # Uploaded Files
│   ├── server.js               # Main Server File
│   ├── package.json
│   └── .env                    # Environment Variables
│
├── src/                        # React Frontend
│   ├── components/             # Reusable Components
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   ├── Slider.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ui/
│   ├── pages/                  # Page Components
│   │   ├── Netflix.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Movies.jsx
│   │   ├── MyList.jsx
│   │   ├── Games.jsx
│   │   ├── Player.jsx
│   │   └── games/
│   ├── store/                  # Redux Store
│   │   ├── index.js
│   │   ├── netflixSlice.js
│   │   ├── myListSlice.jsx
│   │   └── genreSlice.js
│   ├── services/               # API Services
│   │   └── api.js
│   ├── contexts/               # React Contexts
│   │   └── AuthContext.jsx
│   ├── App.jsx                 # Main App Component
│   └── index.js                # Entry Point
│
├── public/                     # Static Files
├── package.json                # Frontend Dependencies
└── README.md                   # Project Documentation
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/netflix-clone?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Run Both Services

```bash
npm run dev  # Runs both backend and frontend
```

---

## 🎨 Design Features

### Color Scheme
- **Background:** #141414 (Netflix black)
- **Primary:** #E50914 (Netflix red)
- **Text:** #FFFFFF (White)
- **Secondary Text:** #B3B3B3 (Light gray)
- **Hover:** #F40612 (Bright red)

### Typography
- **Headings:** Bold, large sizes
- **Body:** Regular weight, readable sizes
- **Responsive:** Scales for mobile/tablet/desktop

### Animations
- Smooth hover effects on cards
- Scale transforms on interaction
- Fade transitions
- Loading spinners
- Smooth scrolling

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation with Joi
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ Secure token storage (localStorage)

---

## 📊 Current Status

### ✅ Completed Features
- Full authentication system
- Movie CRUD operations
- My List functionality
- 4 interactive games
- Video upload capability
- Search and filtering
- Responsive UI
- Error handling
- Loading states

### 🚧 Future Enhancements
- User profiles with avatars
- Social features (sharing, reviews)
- Recommendations engine
- Advanced search filters
- Video quality selection
- Subtitle support
- Watch party feature
- Admin dashboard

---

## 🐛 Known Issues & Fixes

### Fixed Issues:
1. ✅ MongoDB connection string format
2. ✅ React prop warnings (showPassword)
3. ✅ Environment variable naming (MONGO_URI vs MONGODB_URI)
4. ✅ CORS configuration
5. ✅ Token expiration handling

### Current Issues:
- Registration may fail if email already exists (400 error)
- Server errors need better error messages (500 errors)

---

## 📝 API Response Examples

### Successful Registration
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68e15dd47b9dd80a9789ce4f",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null
  }
}
```

### Movie List Response
```json
{
  "movies": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development
- RESTful API design
- JWT authentication
- MongoDB database design
- React state management
- Modern UI/UX design
- File upload handling
- Error handling and validation
- Security best practices

---

## 📞 Support & Documentation

For issues or questions:
1. Check console logs for detailed errors
2. Verify MongoDB Atlas connection
3. Ensure both servers are running
4. Check environment variables
5. Review API endpoint responses

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
