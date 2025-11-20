import React from "react";
import CardSlider from "./CardSlider";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import PropTypes from "prop-types";

function Slider({ movies = [], loading = false, error = null }) {
  if (!Array.isArray(movies)) movies = [];

  const genreMap = {};

  movies.forEach(movie => {
    if (!movie) return; // ✅ Safety check
    
    // ✅ CORRECTED: Use 'genre' and handle both array and string formats
    let movieGenres = [];
    
    if (Array.isArray(movie.genre)) {
      movieGenres = movie.genre;
    } else if (typeof movie.genre === 'string') {
      movieGenres = [movie.genre];
    } else if (movie.genres && Array.isArray(movie.genres)) {
      // Fallback: some movies might use 'genres'
      movieGenres = movie.genres;
    }
    
    // ✅ Add to genre map
    movieGenres.forEach(g => {
      if (g && typeof g === 'string') {
        if (!genreMap[g]) genreMap[g] = [];
        genreMap[g].push(movie);
      }
    });
  });

  // ✅ Get popular genres with most movies
  const popularGenres = Object.entries(genreMap)
    .filter(([_, movies]) => movies.length >= 3) // Only genres with 3+ movies
    .sort(([_, a], [__, b]) => b.length - a.length) // Sort by movie count
    .slice(0, 5); // Top 5 genres

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {popularGenres.map(([genre, movieArray]) => (
        <CardSlider 
          key={genre} 
          title={`${genre} Movies`} 
          movies={movieArray} 
        />
      ))}
    </>
  );
}

Slider.propTypes = {
  movies: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.any,
};

export default Slider;