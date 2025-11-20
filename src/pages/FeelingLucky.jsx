import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageSections } from "../store/netflixSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const LuckyContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
  color: white;
  padding: 2rem;
  font-family: 'Netflix Sans', sans-serif;
`;

// ✅ ADDED: Back to Home button
const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-5px);
  }
`;

const LuckyHeader = styled.div`
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #e50914, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const LuckyButton = styled.button`
  background: linear-gradient(45deg, #e50914, #ff4757);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  animation: ${pulse} 2s infinite;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
    animation: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.secondary {
    background: linear-gradient(45deg, #2d3436, #636e72);
    margin-top: 1.5rem;
    animation: none;
  }
`;

const MovieSuggestion = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
`;

const SuggestionTitle = styled.h2`
  color: #e50914;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
`;

const MovieCard = styled.div`
  display: flex;
  gap: 2rem;
  text-align: left;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const MoviePoster = styled.div`
  flex-shrink: 0;
`;

const PosterImage = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 225px;
  }
`;

const MovieDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MovieDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 1.5rem;
`;

const MovieInfo = styled.p`
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 1rem;

  strong {
    color: #e50914;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #ccc;
  margin: 2rem 0;
  padding: 2rem;
  text-align: center;
`;

const WelcomeMessage = styled.div`
  font-size: 1.2rem;
  color: #ccc;
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  small {
    color: #888;
    font-size: 0.9rem;
  }
`;

const FeelingLucky = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ ADDED: For navigation
  const [randomMovie, setRandomMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const { homepageSections, loading, error, myList } = useSelector(
    (state) => state.netflix
  );

  // Fallback: If MyList is stored in localStorage instead of Redux
  const storedList = JSON.parse(localStorage.getItem("myList")) || [];
  const finalMyList = (myList && myList.length > 0 ? myList : storedList) || [];

  useEffect(() => {
    dispatch(fetchHomepageSections());
  }, [dispatch]);

  // ✅ ADDED: Go back to home function
  const goToHome = () => {
    navigate("/"); // Navigates to homepage
  };

  // ✅ GET ALL MOVIES FROM HOMEPAGE SECTIONS
  const allMovies = React.useMemo(() => {
    if (!homepageSections) return [];
    return Object.values(homepageSections).flat();
  }, [homepageSections]);

  const getRandomMovie = () => {
    setHasUserInteracted(true);
    
    if (allMovies.length === 0) return null;
    
    setIsLoading(true);

    // STEP 1 — Preferred genres from MyList
    let preferredGenres = [];
    if (finalMyList.length > 0) {
      const genreCount = {};
      finalMyList.forEach((movie) => {
        const genres = movie.genre || movie.genres || [];
        if (Array.isArray(genres)) {
          genres.forEach((g) => {
            if (g) genreCount[g] = (genreCount[g] || 0) + 1;
          });
        }
      });
      preferredGenres = Object.keys(genreCount).sort(
        (a, b) => genreCount[b] - genreCount[a]
      );
    }

    // STEP 2 — Filter movies based on preferred genres
    let filteredMovies = [];
    if (preferredGenres.length > 0) {
      filteredMovies = allMovies.filter((movie) => {
        const movieGenres = movie.genre || movie.genres || [];
        return Array.isArray(movieGenres) && movieGenres.some(g => preferredGenres.includes(g));
      });
    }

    // STEP 3 — Fallback to all movies if no genre matches
    const moviePool = filteredMovies.length > 0 ? filteredMovies : allMovies;

    // STEP 4 — Random pick with slight delay for better UX
    setTimeout(() => {
      if (moviePool.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const selectedMovie = moviePool[Math.floor(Math.random() * moviePool.length)];
      setRandomMovie(selectedMovie);
      setIsLoading(false);
    }, 800);
  };

  if (loading && allMovies.length === 0) {
    return (
      <LuckyContainer>
        <BackButton onClick={goToHome}>
          <ArrowLeft size={20} />
          Back to Home
        </BackButton>
        <LoadingMessage>Loading movies...</LoadingMessage>
      </LuckyContainer>
    );
  }

  return (
    <LuckyContainer>
      {/* ✅ ADDED: Back to Home button */}
      <BackButton onClick={goToHome}>
        <ArrowLeft size={20} />
        Back to Home
      </BackButton>

      <LuckyHeader>
        <Title>🎬 Can't Decide What to Watch?</Title>
        <Subtitle>Let us surprise you with a movie tailored to your taste!</Subtitle>
        
        <LuckyButton 
          onClick={getRandomMovie}
          disabled={isLoading || allMovies.length === 0}
        >
          {isLoading ? "Finding Your Movie..." : "🎲 Feeling Lucky!"}
        </LuckyButton>
      </LuckyHeader>

      {allMovies.length === 0 && !loading && (
        <LoadingMessage>
          No movies available at the moment.
        </LoadingMessage>
      )}

      {randomMovie && (
        <MovieSuggestion>
          <SuggestionTitle>We Think You'll Love This! 🎉</SuggestionTitle>
          <MovieCard>
            <MoviePoster>
              <PosterImage 
                src={randomMovie.poster || randomMovie.image} 
                alt={randomMovie.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x300/333333/FFFFFF?text=No+Image';
                }}
              />
            </MoviePoster>
            <MovieDetails>
              <MovieTitle>{randomMovie.title}</MovieTitle>
              <MovieDescription>{randomMovie.description}</MovieDescription>
              {(randomMovie.genre || randomMovie.genres) && (
                <MovieInfo>
                  <strong>Genres:</strong> {(randomMovie.genre || randomMovie.genres).join(", ")}
                </MovieInfo>
              )}
              {randomMovie.rating && (
                <MovieInfo>
                  <strong>Rating:</strong> ⭐ {randomMovie.rating}/10
                </MovieInfo>
              )}
              {randomMovie.year && (
                <MovieInfo>
                  <strong>Year:</strong> {randomMovie.year}
                </MovieInfo>
              )}
              {randomMovie.duration && (
                <MovieInfo>
                  <strong>Duration:</strong> {randomMovie.duration} min
                </MovieInfo>
              )}
            </MovieDetails>
          </MovieCard>
          
          <LuckyButton 
            className="secondary"
            onClick={getRandomMovie}
            disabled={isLoading}
          >
            {isLoading ? "Finding Another..." : "Try Another Movie"}
          </LuckyButton>
        </MovieSuggestion>
      )}

      {!randomMovie && allMovies.length > 0 && !hasUserInteracted && (
        <WelcomeMessage>
          <p>Click the button above to discover your next favorite movie! 🍿</p>
          <p><small>We'll consider your My List preferences when suggesting movies.</small></p>
        </WelcomeMessage>
      )}
    </LuckyContainer>
  );
};

export default FeelingLucky;