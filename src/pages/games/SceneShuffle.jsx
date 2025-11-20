import { useState, useEffect } from "react";
import { Dice1, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedMovies } from "../../store/netflixSlice";
import styled from "styled-components";

export default function SceneShuffle() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies: apiMovies, loading } = useSelector((state) => state.netflix);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [shuffledScenes, setShuffledScenes] = useState([]);
  const [selectedScenes, setSelectedScenes] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiMovies.length === 0 && !loading) {
      dispatch(fetchFeaturedMovies());

    }
  }, [dispatch, apiMovies.length, loading]);

  useEffect(() => {
    if (apiMovies.length > 0) {
      const moviesWithScenes = apiMovies.map(movie => ({
        ...movie,
        scenes: [
          { id: 1, image: movie.backdrop || movie.poster, description: "Opening Scene", order: 1 },
          { id: 2, image: movie.backdrop || movie.poster, description: "Plot Development", order: 2 },
          { id: 3, image: movie.backdrop || movie.poster, description: "Climax", order: 3 },
          { id: 4, image: movie.backdrop || movie.poster, description: "Resolution", order: 4 },
        ]
      }));
      
      if (moviesWithScenes.length > 0) {
        selectRandomMovie(moviesWithScenes);
      } else {
        setError("No movies found in database");
      }
    }
  }, [apiMovies]);

  const selectRandomMovie = (movieList) => {
    if (movieList.length === 0) return;
    
    const movie = movieList[Math.floor(Math.random() * movieList.length)];
    setCurrentMovie(movie);

    // Use the actual scenes from the movie data
    const movieScenes = movie.scenes || [];
    
    // Sort scenes by order to get correct sequence
    const correctOrderScenes = [...movieScenes].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    setScenes(correctOrderScenes);
    setShuffledScenes([...correctOrderScenes].sort(() => Math.random() - 0.5));
    setSelectedScenes([]);
    setShowResult(false);
  };

  const handleSceneSelect = (scene) => {
    if (selectedScenes.includes(scene)) return;

    const newSelected = [...selectedScenes, scene];
    setSelectedScenes(newSelected);

    if (newSelected.length === scenes.length) {
      const isCorrect = newSelected.every((selectedScene, index) => 
        selectedScene.id === scenes[index].id
      );
      if (isCorrect) setScore(score + 1);
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-content">
          <Dice1 className="spinner" />
          <p>Loading game...</p>
        </div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft />
            Back
          </BackButton>
        </Header>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!currentMovie) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft />
            Back
          </BackButton>
        </Header>
        <ErrorContainer>
          <ErrorMessage>No movie data available</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft />
          Back
        </BackButton>
      </Header>

      <GameContainer>
        <GameHeader>
          <Title>Scene Shuffle</Title>
          <Subtitle>Arrange the scenes in chronological order!</Subtitle>
          <Score>Score: {score}</Score>
        </GameHeader>

        <GameCard>
          <MovieTitle>{currentMovie.title}</MovieTitle>

          {/* Selected Scenes Timeline */}
          <TimelineSection>
            <TimelineLabel>Arrange scenes in correct order:</TimelineLabel>
            <TimelineGrid>
              {scenes.map((_, index) => (
                <TimelineSlot
                  key={index}
                  $isFilled={!!selectedScenes[index]}
                  $isCorrect={showResult && selectedScenes[index]?.id === scenes[index]?.id}
                >
                  {selectedScenes[index] ? (
                    <SceneCard>
                      <SceneImage 
                        src={selectedScenes[index].image} 
                        alt={`Scene ${index + 1}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x169/333/fff?text=Scene+Image';
                        }}
                      />
                      <SceneDescription>
                        {selectedScenes[index].description}
                      </SceneDescription>
                      <SceneNumber>{index + 1}</SceneNumber>
                    </SceneCard>
                  ) : (
                    <EmptySlot>
                      <span>Scene {index + 1}</span>
                    </EmptySlot>
                  )}
                </TimelineSlot>
              ))}
            </TimelineGrid>
          </TimelineSection>

          {/* Shuffled Scenes */}
          {!showResult ? (
            <ShuffledSection>
              <ShuffledLabel>Click scenes in correct order:</ShuffledLabel>
              <ShuffledGrid>
                {shuffledScenes.map((scene, index) => (
                  <ShuffledScene
                    key={`${scene.id}-${index}`}
                    $selected={selectedScenes.includes(scene)}
                    onClick={() => handleSceneSelect(scene)}
                    disabled={selectedScenes.includes(scene)}
                  >
                    <SceneCard>
                      <SceneImage 
                        src={scene.image} 
                        alt={scene.description}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x169/333/fff?text=Scene+Image';
                        }}
                      />
                      <SceneDescription>
                        {scene.description}
                      </SceneDescription>
                    </SceneCard>
                  </ShuffledScene>
                ))}
              </ShuffledGrid>
            </ShuffledSection>
          ) : (
            <ResultSection>
              <ResultMessage $isCorrect={selectedScenes.every((s, i) => s.id === scenes[i].id)}>
                {selectedScenes.every((s, i) => s.id === scenes[i].id)
                  ? "🎉 Perfect! You got the order right!"
                  : "😅 Not quite right. Try again!"}
              </ResultMessage>
              <ButtonGroup>
                <ExitButton onClick={() => navigate(-1)}>
                  Exit Game
                </ExitButton>
                <NextButton onClick={() => selectRandomMovie(apiMovies.map(movie => ({
                  ...movie,
                  scenes: [
                    { id: 1, image: movie.backdrop || movie.poster, description: "Opening Scene", order: 1 },
                    { id: 2, image: movie.backdrop || movie.poster, description: "Plot Development", order: 2 },
                    { id: 3, image: movie.backdrop || movie.poster, description: "Climax", order: 3 },
                    { id: 4, image: movie.backdrop || movie.poster, description: "Resolution", order: 4 },
                  ]
                })))}>
                  Next Movie
                </NextButton>
              </ButtonGroup>
            </ResultSection>
          )}
        </GameCard>
      </GameContainer>
    </Container>
  );
}

// Styled Components (same as before, with error handling additions)
const Container = styled.div`
  min-height: 100vh;
  background: #141414;
  color: white;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: #141414;
  display: flex;
  align-items: center;
  justify-content: center;

  .loading-content {
    text-align: center;
  }

  .spinner {
    height: 64px;
    width: 64px;
    color: #e50914;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  p {
    color: white;
    font-size: 18px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: #e50914;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #e50914;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: #f40612;
  }
`;

// ... (rest of the styled components remain the same from previous code)
const Header = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #e50914, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #d2d2d2;
  margin-bottom: 20px;
`;

const Score = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e50914;
`;

const GameCard = styled.div`
  background: rgba(22, 22, 22, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
`;

const MovieTitle = styled.h2`
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 40px;
  color: white;
  font-weight: 600;
`;

const TimelineSection = styled.div`
  margin-bottom: 50px;
`;

const TimelineLabel = styled.h3`
  font-size: 1.3rem;
  color: #d2d2d2;
  margin-bottom: 20px;
  text-align: center;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TimelineSlot = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  border: 2px dashed ${props => 
    props.$isCorrect ? '#2ecc71' : 
    props.$isFilled ? '#e50914' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${props => props.$isFilled ? 'transparent' : 'rgba(255, 255, 255, 0.05)'};
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const ShuffledSection = styled.div`
  margin-bottom: 30px;
`;

const ShuffledLabel = styled.h3`
  font-size: 1.3rem;
  color: #d2d2d2;
  margin-bottom: 20px;
  text-align: center;
`;

const ShuffledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ShuffledScene = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  opacity: ${props => props.$selected ? 0.3 : 1};
  transform: ${props => props.$selected ? 'scale(0.95)' : 'scale(1)'};

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SceneCard = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const SceneImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SceneDescription = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
`;

const SceneNumber = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: #e50914;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const ResultSection = styled.div`
  text-align: center;
`;

const ResultMessage = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: ${props => props.$isCorrect ? '#2ecc71' : '#e74c3c'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ExitButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NextButton = styled.button`
  background: #e50914;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: #f40612;
  }
`;