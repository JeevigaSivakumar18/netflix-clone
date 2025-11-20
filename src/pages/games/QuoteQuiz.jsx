import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function RaQuoteQuiz() {
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const inputRef = useRef(null);

  const movieQuotes = [
    {
      id: 1,
      title: "The Matrix",
      quote: "There is no spoon.",
      year: 1999,
      difficulty: "medium",
      genre: "Sci-Fi",
      points: 20
    },
    {
      id: 2,
      title: "The Dark Knight",
      quote: "Why so serious?",
      year: 2008,
      difficulty: "easy",
      genre: "Action",
      points: 10
    },
    {
      id: 3,
      title: "The Godfather",
      quote: "I'm gonna make him an offer he can't refuse.",
      year: 1972,
      difficulty: "medium",
      genre: "Crime",
      points: 20
    }
  ];

  useEffect(() => {
    getRandomMovie();
    inputRef.current?.focus();
  }, []);

  const getRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * movieQuotes.length);
    setCurrentMovie(movieQuotes[randomIndex]);
    setIsCorrect(null);
    setUserInput("");
    inputRef.current?.focus();
  };

  const handleGuess = () => {
    if (!currentMovie || !userInput.trim()) return;
    
    setAttempts(prev => prev + 1);
    const correct = userInput.trim().toLowerCase() === currentMovie.title.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + currentMovie.points);
      setStreak(prev => prev + 1);
      setTimeout(() => {
        getRandomMovie();
      }, 1500);
    } else {
      setStreak(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      
      <header style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back to Browse
        </button>
        
        <h1 style={styles.title}>QUOTE QUEST</h1>
        <p style={styles.subtitle}>Can you name the movie from its iconic line?</p>
        
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{score}</div>
            <div style={styles.statLabel}>SCORE</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{streak}x</div>
            <div style={styles.statLabel}>STREAK</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{attempts}</div>
            <div style={styles.statLabel}>ATTEMPTS</div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Quote Card */}
        <div style={styles.quoteCard}>
          <div style={styles.difficultyBadge}>
            {currentMovie ? `${currentMovie.difficulty.toUpperCase()} • ${currentMovie.points} POINTS` : 'LOADING...'}
          </div>
          
          <div style={styles.quoteText}>
            "{currentMovie ? currentMovie.quote : 'Loading quote...'}"
          </div>
          
          <div style={styles.movieMeta}>
            {currentMovie ? `${currentMovie.genre} • ${currentMovie.year}` : ''}
          </div>
          
          {/* Result Feedback */}
          {isCorrect !== null && (
            <div style={{
              ...styles.resultFeedback,
              ...(isCorrect ? styles.correct : styles.incorrect)
            }}>
              {isCorrect ? '🎉 Correct! +' + currentMovie.points : '❌ Try Again!'}
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <input 
              ref={inputRef}
              type="text" 
              style={styles.questInput}
              placeholder="Type the movie title..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isCorrect}
            />
            <button 
              style={styles.guessButton}
              onClick={handleGuess}
              disabled={!userInput.trim() || isCorrect}
            >
              🎯 GUESS
            </button>
          </div>
          
          <button 
            style={styles.skipButton}
            onClick={getRandomMovie}
          >
            ⏭️ Skip Quote
          </button>
        </div>

        {/* Level Cards */}
        <div style={styles.levelsGrid}>
          <div style={{...styles.levelCard, ...styles.easyCard}}>
            <h3 style={styles.levelTitle}>Easy Level</h3>
            <div style={styles.points}>10 PTS</div>
            <p style={styles.levelDesc}>Classic quotes everyone knows</p>
          </div>
          
          <div style={{...styles.levelCard, ...styles.mediumCard}}>
            <h3 style={styles.levelTitle}>Medium Level</h3>
            <div style={styles.points}>20 PTS</div>
            <p style={styles.levelDesc}>For the movie enthusiasts</p>
          </div>
          
          <div style={{...styles.levelCard, ...styles.hardCard}}>
            <h3 style={styles.levelTitle}>Hard Level</h3>
            <div style={styles.points}>30 PTS</div>
            <p style={styles.levelDesc}>True cinephile challenges</p>
          </div>
        </div>
      </main>

      {/* Netflix-style Controls Footer */}
      <div style={styles.controlsFooter}>
        <div style={styles.controlItem}>
          <div style={styles.controlIcon}>▶️</div>
          <span style={styles.controlLabel}>Play</span>
        </div>
        <div style={styles.controlItem}>
          <div style={styles.controlIcon}>🔊</div>
          <span style={styles.controlLabel}>Audio</span>
        </div>
        <div style={styles.controlItem}>
          <div style={styles.controlIcon}>⚙️</div>
          <span style={styles.controlLabel}>Settings</span>
        </div>
        <div style={styles.controlItem}>
          <div style={styles.controlIcon}>🔲</div>
          <span style={styles.controlLabel}>Fullscreen</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#000000',
    color: '#ffffff',
    fontFamily: "'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(ellipse at 20% 20%, #e50914 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, #b81d24 0%, transparent 50%),
      radial-gradient(ellipse at 40% 40%, #221f1f 0%, transparent 50%)
    `,
    backgroundBlendMode: 'screen',
    opacity: 0.1,
    animation: 'backgroundPulse 8s ease-in-out infinite',
  },
  header: {
    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.9) 0%, rgba(184, 29, 36, 0.7) 50%, transparent 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(229, 9, 20, 0.3)',
    position: 'relative',
    padding: '2rem',
    textAlign: 'center',
  },
  backButton: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: '1px solid #e50914',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #e50914 0%, #f5f5f1 50%, #e50914 100%)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'titleShine 3s ease-in-out infinite',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    margin: '0 0 1rem 0',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 2rem 0',
  },
  statsContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #e50914 0%, #f5f5f1 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '0.5rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative',
    zIndex: 10,
  },
  quoteCard: {
    background: 'rgba(22, 22, 22, 0.95)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(229, 9, 20, 0.2)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: `
      0 20px 40px rgba(229, 9, 20, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    textAlign: 'center',
    marginBottom: '3rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  difficultyBadge: {
    background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.9) 0%, rgba(241, 130, 21, 0.9) 100%)',
    color: '#000',
    fontWeight: 800,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(241, 130, 21, 0.3)',
    display: 'inline-block',
    marginBottom: '2rem',
  },
  quoteText: {
    fontSize: '2.5rem',
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.4,
    color: '#f5f5f1',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    margin: '2rem 0',
    position: 'relative',
  },
  movieMeta: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  resultFeedback: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    margin: '1rem 0',
    padding: '1rem',
    borderRadius: '12px',
  },
  correct: {
    color: '#22c55e',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  incorrect: {
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    margin: '2rem 0',
    justifyContent: 'center',
  },
  questInput: {
    background: 'rgba(36, 36, 36, 0.9)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: '#ffffff',
    fontSize: '1.25rem',
    padding: '1rem 1.5rem',
    minWidth: '300px',
    outline: 'none',
  },
  guessButton: {
    background: 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.125rem',
    padding: '1rem 2.5rem',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(229, 9, 20, 0.3)',
  },
  skipButton: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  levelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '3rem',
  },
  levelCard: {
    background: 'linear-gradient(135deg, rgba(36, 36, 36, 0.9) 0%, rgba(45, 45, 45, 0.9) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  easyCard: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  mediumCard: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  hardCard: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  levelTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 1rem 0',
  },
  points: {
    fontSize: '2rem',
    fontWeight: 900,
    margin: '1rem 0',
  },
  levelDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    margin: 0,
  },
  controlsFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    padding: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '3rem',
  },
  controlItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  controlIcon: {
    fontSize: '1.5rem',
  },
  controlLabel: {
    fontSize: '0.75rem',
  },
};

// Add global styles for animations
const globalStyles = `
  @keyframes backgroundPulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.15; }
  }
  
  @keyframes titleShine {
    0%, 100% { background-position: -200% center; }
    50% { background-position: 200% center; }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
//ok then I will increase the number of movies in this itself and use this intead of that other 
