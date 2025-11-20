import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { 
  Gamepad2, 
  Film, 
  Quote, 
  Shuffle, 
  Dice1, 
  ArrowRight,
  Star,
  Trophy
} from "lucide-react";

const games = [
  /*
  {
    id: "guess-the-movie",
    title: "Guess The Movie",
    description: "Test your movie knowledge! Guess the movie from hints and clues.",
    icon: Film,
    color: "#E50914",
    route: "/guess-the-movie",
    difficulty: "Easy",
    players: "1-4"
  },
  */
  {
    id: "quote-quiz",
    title: "Quote Quiz",
    description: "Match famous movie quotes to their films. How many can you get right?",
    icon: Quote,
    color: "#FF6B35",
    route: "/random-scene",
    difficulty: "Medium",
    players: "1-6"
  },
  {
    id: "movie-trivia",
    title: "Movie Trivia",
    description: "Answer trivia questions about your favorite films and actors.",
    icon: Trophy,
    color: "#FFD700",
    route: "/movie-trivia",
    difficulty: "Hard",
    players: "1-8"
  },
  /*
  {
    id: "scene-shuffle",
    title: "Scene Shuffle",
    description: "Identify movies from shuffled scenes and still images.",
    icon: Shuffle,
    color: "#9B59B6",
    route: "/scene-shuffle",
    difficulty: "Medium",
    players: "1-4"
  }
    */
];

const Games = () => {
  const navigate = useNavigate();

  const handleGameClick = (gameRoute) => {
    navigate(gameRoute);
  };

  return (
    <Container>
      <Navbar isScrolled={true} />
      
      <ContentWrapper>
        <Header>
          <div className="header-content">
            <div className="title-section">
              <Gamepad2 className="title-icon" size={48} />
              <div>
                <h1>Movie Games</h1>
                <p>Challenge yourself and your friends with these exciting movie-themed games!</p>
              </div>
            </div>
          </div>
        </Header>

        <GamesGrid>
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <GameCard 
                key={game.id} 
                onClick={() => handleGameClick(game.route)}
                $color={game.color}
              >
                <div className="card-header">
                  <div className="icon-wrapper" style={{ backgroundColor: game.color }}>
                    <IconComponent size={32} />
                  </div>
                  <div className="difficulty-badge" style={{ backgroundColor: game.color }}>
                    {game.difficulty}
                  </div>
                </div>
                
                <div className="card-content">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  
                  <div className="game-info">
                    <div className="info-item">
                      <Star size={16} />
                      <span>{game.difficulty}</span>
                    </div>
                    <div className="info-item">
                      <Gamepad2 size={16} />
                      <span>{game.players}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <span>Play Now</span>
                  <ArrowRight size={20} />
                </div>
              </GameCard>
            );
          })}
        </GamesGrid>

        <FeaturedSection>
          <h2>Why Play Our Games?</h2>
          <div className="features-grid">
            <div className="feature">
              <Trophy size={24} />
              <h3>Challenge Yourself</h3>
              <p>Test your movie knowledge with various difficulty levels</p>
            </div>
            <div className="feature">
              <Gamepad2 size={24} />
              <h3>Multiplayer Fun</h3>
              <p>Play with friends and family for maximum entertainment</p>
            </div>
            <div className="feature">
              <Star size={24} />
              <h3>Learn & Discover</h3>
              <p>Discover new movies and interesting facts about your favorites</p>
            </div>
          </div>
        </FeaturedSection>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
  color: white;
`;

const ContentWrapper = styled.div`
  padding: 100px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    .title-icon {
      color: #E50914;
    }
    
    h1 {
      font-size: 3rem;
      margin: 0;
      background: linear-gradient(45deg, #E50914, #FF6B35);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      color: #b3b3b3;
      font-size: 1.1rem;
      margin: 0.5rem 0 0 0;
      max-width: 600px;
    }
  }

  @media (max-width: 768px) {
    .title-section {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
      
      h1 {
        font-size: 2rem;
      }
    }
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const GameCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color};
  }

  &:hover {
    transform: translateY(-8px);
    border-color: ${props => props.$color};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    .card-footer {
      color: ${props => props.$color};
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .difficulty-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
    }
  }

  .card-content {
    margin-bottom: 1.5rem;
    
    h3 {
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
      font-weight: 700;
    }
    
    p {
      color: #b3b3b3;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }
    
    .game-info {
      display: flex;
      gap: 1rem;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #888;
        font-size: 0.9rem;
      }
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    transition: color 0.3s ease;
  }
`;

const FeaturedSection = styled.div`
  text-align: center;
  padding: 3rem 0;
  
  h2 {
    font-size: 2.5rem;
    margin: 0 0 2rem 0;
    background: linear-gradient(45deg, #E50914, #FF6B35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .feature {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    svg {
      color: #E50914;
      margin-bottom: 1rem;
    }
    
    h3 {
      font-size: 1.2rem;
      margin: 0 0 0.5rem 0;
    }
    
    p {
      color: #b3b3b3;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
`;

export default Games;
