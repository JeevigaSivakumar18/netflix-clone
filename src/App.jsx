import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import TV from "./pages/Tv";
import Movies from "./pages/Movies";
import MyList from "./pages/MyList";
import FeelingLucky from './pages/FeelingLucky';
import Games from "./pages/Games";
import SceneShuffle from "./pages/games/SceneShuffle";
import GuessTheMovie from "./pages/games/GuessTheMovie";
import MovieTrivia from "./pages/games/MovieTrivia";
import QuoteQuiz from "./pages/games/QuoteQuiz";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
//import QuoteQuiz from "./components/Games/QuoteQuiz"; 

function App() {
  return (
    
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Netflix/>
              </ProtectedRoute>
            } />
            <Route path="/feeling-lucky" element={
              <ProtectedRoute>
                <FeelingLucky />
              </ProtectedRoute>
            } />
            <Route path="/player" element={
              <ProtectedRoute>
                <Player/>
              </ProtectedRoute>
            } />
            <Route path="/player/movie/:id" element={
              <ProtectedRoute>
                <Player />
              </ProtectedRoute>
            } />
            <Route path="/tv" element={
              <ProtectedRoute>
                <TV />
              </ProtectedRoute>
            } />       
            <Route path="/movies" element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            } />
            <Route path="/mylist" element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            } />
            <Route path="/games" element={
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            } />
            
            {/* Game Routes */}
            <Route path="/scene-shuffle" element={
              <ProtectedRoute>
                <SceneShuffle />
              </ProtectedRoute>
            } />
            <Route path="/guess-the-movie" element={
              <ProtectedRoute>
                <GuessTheMovie />
              </ProtectedRoute>
            } />
            <Route path="/movie-trivia" element={
              <ProtectedRoute>
                <MovieTrivia />
              </ProtectedRoute>
            } />
            <Route path="/random-scene" element={
              <ProtectedRoute>
                <QuoteQuiz />
              </ProtectedRoute>
            } />
            <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  
  );
}

export default App;
