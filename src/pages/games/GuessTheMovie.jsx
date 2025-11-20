import React, { useState, useEffect } from "react";
import { ArrowLeft, Dice1, Film, Star, TrendingUp, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function GuessTheMovie() {
  const navigate = useNavigate();

  const [currentMovie, setCurrentMovie] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Hardcoded movie dataset for offline/dev-friendly gameplay
  const MOVIES = [
    { id: 'g1', title: 'Inception', year: 2010, difficulty: 'medium', genre: ['Sci-Fi'], backdrop_path: null, image: 'https://picsum.photos/id/1011/1200/700' },
    { id: 'g2', title: 'The Matrix', year: 1999, difficulty: 'easy', genre: ['Sci-Fi'], backdrop_path: null, image: 'https://picsum.photos/id/1003/1200/700' },
    { id: 'g3', title: 'Interstellar', year: 2014, difficulty: 'medium', genre: ['Sci-Fi'], backdrop_path: null, image: 'https://picsum.photos/id/1025/1200/700' },
    { id: 'g4', title: 'Gladiator', year: 2000, difficulty: 'medium', genre: ['Action'], backdrop_path: null, image: 'https://picsum.photos/id/1018/1200/700' },
    { id: 'g5', title: 'Titanic', year: 1997, difficulty: 'easy', genre: ['Romance'], backdrop_path: null, image: 'https://picsum.photos/id/1016/1200/700' },
    { id: 'g6', title: 'The Dark Knight', year: 2008, difficulty: 'easy', genre: ['Action'], backdrop_path: null, image: 'https://picsum.photos/id/1020/1200/700' },
    { id: 'g7', title: 'Pulp Fiction', year: 1994, difficulty: 'medium', genre: ['Crime'], backdrop_path: null, image: 'https://picsum.photos/id/1033/1200/700' },
    { id: 'g8', title: 'Forrest Gump', year: 1994, difficulty: 'easy', genre: ['Drama'], backdrop_path: null, image: 'https://picsum.photos/id/1005/1200/700' },
    { id: 'g9', title: 'The Shawshank Redemption', year: 1994, difficulty: 'medium', genre: ['Drama'], backdrop_path: null, image: 'https://picsum.photos/id/1041/1200/700' },
    { id: 'g10', title: 'The Godfather', year: 1972, difficulty: 'hard', genre: ['Crime'], backdrop_path: null, image: 'https://picsum.photos/id/1050/1200/700' }
  ];

  useEffect(() => {
    // pick initial random movie from the local dataset
    setLoading(true);
    const idx = Math.floor(Math.random() * MOVIES.length);
    setCurrentMovie(MOVIES[idx]);
    setLoading(false);
  }, []);

  const calculatePoints = (difficulty) => {
    const pointsMap = {
      easy: 10,
      medium: 20,
      hard: 30
    };
    return pointsMap[difficulty] || 10;
  };

  const handleGuess = () => {
    if (!currentMovie) return;

    const isCorrect = userInput.trim().toLowerCase() === currentMovie.title.toLowerCase();
    setTotalGuesses(prev => prev + 1);
    
    if (isCorrect) {
      const pointsEarned = calculatePoints(currentMovie.difficulty);
      const streakBonus = streak > 0 ? Math.floor(streak / 3) * 5 : 0; // +5 points every 3 streaks
      const totalPoints = pointsEarned + streakBonus;
      
      setScore((prev) => prev + totalPoints);
      setStreak((prev) => prev + 1);
      
      let message = `Correct! 🎉 +${pointsEarned} points`;
      if (streakBonus > 0) {
        message += ` (+${streakBonus} streak bonus!)`;
      }
      if (streak + 1 >= 3) {
        message += ` 🔥 Streak: ${streak + 1}`;
      }
      
      setFeedback({ 
        type: 'success', 
        message: message
      });
    } else {
      setStreak(0);
      setFeedback({ 
        type: 'error', 
        message: `Wrong! The correct answer was "${currentMovie.title}"` 
      });
    }

    setUserInput("");
    
    setTimeout(() => {
      setFeedback(null);
      // pick a new random movie (different from current when possible)
      if (MOVIES.length > 1) {
        let nextIndex = Math.floor(Math.random() * MOVIES.length);
        while (MOVIES[nextIndex].id === currentMovie?.id) {
          nextIndex = Math.floor(Math.random() * MOVIES.length);
        }
        setCurrentMovie(MOVIES[nextIndex]);
      } else {
        setCurrentMovie(MOVIES[0]);
      }
      setImageError(false);
    }, 3000);
  };

  const getDifficultyText = (difficulty) => {
    const difficultyMap = {
      easy: "Easy",
      medium: "Medium", 
      hard: "Hard"
    };
    return difficultyMap[difficulty] || "Medium";
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: "#00c853",
      medium: "#ff9800",
      hard: "#f44336"
    };
    return colorMap[difficulty] || "#ff9800";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const getMovieImageUrl = (movie) => {
    // Prefer `image` (local placeholder) then TMDB backdrop if available
    if (!movie) return null;
    if (movie.image) return movie.image;
    if (movie.backdrop_path) return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
    return null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const sceneImage = currentMovie ? getMovieImageUrl(currentMovie) : null;
  const hasValidImage = sceneImage && !imageError;

  const accuracy = totalGuesses > 0 ? Math.round((score / (totalGuesses * 20)) * 100) : 0;

  return (
    <Container>
      {/* Blurred Background */}
      {hasValidImage && (
        <BackgroundImage style={{ backgroundImage: `url(${sceneImage})` }} />
      )}

      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </BackButton>
          
          <Title>🎬 Guess The Movie</Title>
          
          <ScoreBoard>
            <ScoreItem>
              <Trophy size={16} />
              <span>Score: <strong>{score}</strong></span>
            </ScoreItem>
            <ScoreItem>
              <TrendingUp size={16} />
              <span>Streak: <strong>{streak}</strong></span>
            </ScoreItem>
            <ScoreItem>
              <Star size={16} />
              <span>Accuracy: <strong>{accuracy}%</strong></span>
            </ScoreItem>
          </ScoreBoard>
        </Header>

        <GameArea>
          {loading ? (
            <LoadingMessage>Loading movie...</LoadingMessage>
          ) : currentMovie ? (
            <MovieScene>
              {hasValidImage ? (
                <>
                  <SceneImage 
                    src={sceneImage} 
                    alt="Movie Scene" 
                    onError={handleImageError}
                  />
                  <SceneOverlay>
                    <HintText>Can you guess this movie?</HintText>
                    <DifficultyBadge difficulty={currentMovie.difficulty}>
                      {getDifficultyText(currentMovie.difficulty)} - {calculatePoints(currentMovie.difficulty)} points
                    </DifficultyBadge>
                    <YearHint>Released in {currentMovie.year}</YearHint>
                    {currentMovie.genre && (
                      <GenreHint>Genre: {currentMovie.genre.join(', ')}</GenreHint>
                    )}
                  </SceneOverlay>
                </>
              ) : (
                <NoImagePlaceholder>
                  <Film size={64} />
                  <p>No image available</p>
                  <MovieHint>Try guessing: "{currentMovie.title}"</MovieHint>
                </NoImagePlaceholder>
              )}
            </MovieScene>
          ) : (
            <ErrorMessage>
              Failed to load movie. Please refresh the page.
            </ErrorMessage>
          )}

          <InputSection>
            <GuessInput
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type the movie title..."
              disabled={!currentMovie || feedback}
            />
            
            <GuessButton 
              onClick={handleGuess}
              disabled={!currentMovie || !userInput.trim() || feedback}
            >
              <Dice1 size={18} /> Guess
            </GuessButton>
          </InputSection>

          {feedback && (
            <FeedbackMessage type={feedback.type}>
              {feedback.message}
            </FeedbackMessage>
          )}

          <GameStats>
            <StatItem>Total guesses: <strong>{totalGuesses}</strong></StatItem>
            <StatItem>Current streak: <strong>{streak}</strong></StatItem>
            <StatItem>Points per level: <PointsInfo>Easy: 10 | Medium: 20 | Hard: 30</PointsInfo></StatItem>
          </GameStats>

          <GameHint>
            💡 Tip: Look for visual clues, remember the release year ({currentMovie?.year}), and watch for famous actors or scenes!
            {streak >= 3 && ` 🔥 You're on fire! ${Math.floor(streak / 3) * 5} bonus points for your streak!`}
          </GameHint>
        </GameArea>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  color: white;
  background: #000;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(25px) brightness(0.3);
  opacity: 0.6;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(229, 9, 20, 0.9);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: #f6121d;
    transform: translateX(-3px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #e50914);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ScoreBoard = styled.div`
  background: rgba(20, 20, 20, 0.9);
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid rgba(229, 9, 20, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 12px 15px;
  }
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #ccc;

  strong {
    color: #e50914;
    font-size: 1rem;
  }
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const MovieScene = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(229, 9, 20, 0.2);
  position: relative;
  margin: 1rem 0;
  background: rgba(30, 30, 30, 0.8);
  min-height: 400px;
`;

const SceneImage = styled.img`
  width: 100%;
  display: block;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const NoImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #666;
  text-align: center;
  padding: 2rem;

  p {
    margin: 1rem 0 0.5rem 0;
    font-size: 1.2rem;
    color: #ccc;
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const SceneOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 2rem;
  text-align: center;
`;

const HintText = styled.p`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
`;

const DifficultyBadge = styled.div`
  display: inline-block;
  background: ${props => {
    const colorMap = { easy: "#00c853", medium: "#ff9800", hard: "#f44336" };
    return colorMap[props.difficulty] || "#ff9800";
  }};
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.5rem 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const YearHint = styled.small`
  color: #b3b3b3;
  font-size: 0.9rem;
  opacity: 0.8;
  display: block;
  margin: 0.3rem 0;
`;

const GenreHint = styled.small`
  color: #e50914;
  font-size: 0.8rem;
  opacity: 0.8;
  display: block;
  margin: 0.3rem 0;
`;

const MovieHint = styled.small`
  color: #e50914;
  font-weight: 500;
  opacity: 0.8;
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const GuessInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    border-color: #e50914;
    outline: none;
    box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #666;
  }
`;

const GuessButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #e50914, #b8070f);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f6121d, #e50914);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FeedbackMessage = styled.div`
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease-out;

  ${props => props.type === 'success' && `
    background: linear-gradient(135deg, #0f5132, #157347);
    color: #d1e7dd;
    border: 1px solid #198754;
  `}

  ${props => props.type === 'error' && `
    background: linear-gradient(135deg, #842029, #c02b3b);
    color: #f8d7da;
    border: 1px solid #dc3545;
  `}

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingMessage = styled.div`
  padding: 3rem;
  font-size: 1.2rem;
  color: #ccc;
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: 3rem;
  font-size: 1.2rem;
  color: #e50914;
  text-align: center;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(229, 9, 20, 0.3);
`;

const GameStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
`;

const StatItem = styled.div`
  color: #b3b3b3;
  font-size: 0.9rem;
  text-align: center;

  strong {
    color: #e50914;
  }
`;

const PointsInfo = styled.span`
  color: #00c853;
  font-weight: 600;
  font-size: 0.8rem;
`;

const GameHint = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.4;
`;