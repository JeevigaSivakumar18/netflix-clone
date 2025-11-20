import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Star, Sparkles, Clock, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function MovieTrivia() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const HARD_QUESTIONS = [
      {
        type: "year",
        question: 'When was "The Matrix" released?',
        answers: ["1999", "1998", "2000", "2001"],
        correctAnswer: 0,
      },
      {
        type: "plot",
        question:
          'Which movie has this plot: "A man leads a double life as a billionaire playboy and a high-tech superhero"?',
        answers: ["Iron Man", "Batman Begins", "The Dark Knight", "Spider-Man"],
        correctAnswer: 0,
      },
      {
        type: "year",
        question: 'When was "Pulp Fiction" released?',
        answers: ["1994", "1992", "1995", "1990"],
        correctAnswer: 0,
      },
      {
        type: "plot",
        question:
          'Which movie has this plot: "A spaceship crew travels through a wormhole to save humanity"?',
        answers: ["Interstellar", "Gravity", "The Martian", "Apollo 13"],
        correctAnswer: 0,
      },
      {
        type: "year",
        question: 'When was "The Godfather" released?',
        answers: ["1972", "1970", "1974", "1969"],
        correctAnswer: 0,
      },
      {
        type: "plot",
        question:
          'Which movie has this plot: "A man is wrongly imprisoned and plans an elaborate escape"?',
        answers: [
          "The Shawshank Redemption",
          "Escape Plan",
          "The Green Mile",
          "The Count of Monte Cristo",
        ],
        correctAnswer: 0,
      },
    ];

    setQuestions(HARD_QUESTIONS.sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect =
      answerIndex === questions[currentQuestion].correctAnswer;

    setTimeout(() => {
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }

      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case "year":
        return <Clock className="h-5 w-5" />;
      case "plot":
        return <Film className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getAnswerButtonStyle = (index) => {
    if (!showFeedback) {
      return "answer-btn";
    }

    const isCorrect = index === questions[currentQuestion].correctAnswer;
    const isSelected = selectedAnswer === index;

    if (isCorrect) return "answer-correct";
    if (isSelected && !isCorrect) return "answer-wrong";
    return "answer-disabled";
  };

  return (
    <div className="trivia-page">
      <div className="floating-background"></div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <button
  onClick={() => navigate("/games")}
  className="back-btn"
  style={{ position: "relative", zIndex: 9999 }}
>
  <ArrowLeft className="h-4 w-4" />
  Back to Browse
</button>

          <div className="title-wrapper">
            <Sparkles className="title-icon" />
            <h1 className="title-text">CINEMATIC TRIVIA</h1>
            <Sparkles className="title-icon" />
          </div>

          <p className="subtitle">Test your movie knowledge like a true cinephile!</p>

          <div className="game-container">
            {!showResult && questions.length > 0 ? (
              <>
                <div className="stats-bar">
                  <div className="stat-box">
                    <span className="stat-label">QUESTION</span>
                    <span className="stat-value">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                  </div>

                  <div className="stat-box">
                    <span className="stat-label">SCORE</span>
                    <span className="stat-value score">{score}</span>
                  </div>

                  {streak > 0 && (
                    <div className="stat-box streak-box">
                      <span className="stat-label">STREAK</span>
                      <span className="stat-value streak">{streak}🔥</span>
                    </div>
                  )}

                  <div className="type-badge">
                    {getQuestionIcon(questions[currentQuestion]?.type)}
                    <span>{questions[currentQuestion]?.type} Question</span>
                  </div>
                </div>

                <div className="question-card">
                  {questions[currentQuestion]?.question}
                </div>

                <div className="answers-grid">
                  {questions[currentQuestion]?.answers.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={showFeedback}
                      className={`answer ${getAnswerButtonStyle(idx)}`}
                    >
                      <div className={`answer-bullet ${selectedAnswer === idx ? "active" : ""}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {answer}
                    </button>
                  ))}
                </div>

                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        ((currentQuestion + 1) / questions.length) * 100
                      )}
                      %
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : showResult ? (
              <div className="text-center max-w-2xl mx-auto">
                <Trophy className="result-icon" />

                <h2 className="result-title">Trivia Complete!</h2>

                <div className="result-card">
                  <div className="result-score">
                    {score}
                    <span className="total">/{questions.length}</span>
                  </div>

                  <div className="result-message">
                    {score === questions.length
                      ? "🏆 PERFECT SCORE! You're a cinema legend!"
                      : score >= questions.length * 0.8
                      ? "🎬 Outstanding! True movie buff!"
                      : score >= questions.length * 0.6
                      ? "⭐ Great job! Solid movie knowledge!"
                      : "🎥 Good start! Keep watching and learning!"}
                  </div>

                  {streak > 3 && (
                    <div className="streak-note">
                      🔥 Amazing {streak}-answer streak!
                    </div>
                  )}
                </div>

                <div className="result-buttons">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="exit-btn"
                  >
                    Exit Game
                  </Button>

                  <Button
                    className="play-again-btn"
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setShowResult(false);
                      setStreak(0);
                      setQuestions((prev) =>
                        [...prev].sort(() => Math.random() - 0.5)
                      );
                    }}
                  >
                    🎯 Play Again
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* NETFLIX STYLE CSS */}
      <style>{`
        .trivia-page {
  min-height: 100vh;
  background: #000; /* Netflix black */
  color: white;
  font-family: Netflix Sans, Arial;
  position: relative;
  overflow: hidden;
}

.floating-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, rgba(229,9,20,0.25), transparent),
              radial-gradient(circle at bottom, rgba(229,9,20,0.15), transparent);
  z-index: 0;
}


         .back-btn {
  background: rgba(0,0,0,0.7);
  border: 1px solid #e50914;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.25s;
  color: white;
  position: relative;
  z-index: 50;
}
.back-btn:hover {
  background: #e50914;
  transform: scale(1.05);
}


        .title-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }
        .title-text {
          font-size: 54px;
          font-weight: 900;
          background: linear-gradient(to right, #e50914, orange, yellow);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .title-icon {
          color: #e50914;
          width: 40px;
          height: 40px;
        }
        .subtitle {
          text-align: center;
          color: #ccc;
          margin-bottom: 30px;
        }

        .game-container {
          background: rgba(20,20,20,0.8);
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(229,9,20,0.3);
          box-shadow: 0 0 25px rgba(229,9,20,0.2);
        }

        .stats-bar {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }
        .stat-box {
          background: rgba(0,0,0,0.6);
          padding: 12px 20px;
          border-radius: 14px;
          border: 1px solid rgba(229,9,20,0.3);
        }
        .stat-label {
          font-size: 12px;
          color: #aaa;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }
        .score {
          color: gold;
        }
        .streak-box {
          border-color: orange;
        }
        .streak {
          color: orange;
        }

        .type-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.6);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid #555;
        }

        .question-card {
          background: rgba(0,0,0,0.5);
          border: 1px solid #555;
          padding: 24px;
          border-radius: 16px;
          font-size: 24px;
          text-align: center;
          margin-bottom: 30px;
        }

        .answers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 14px;
        }

        /* Answer Buttons - Default */
        .answer {
          padding: 18px;
          border-radius: 16px;
          border: 2px solid #444;
          background: rgba(40,40,40,0.7);
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: 0.25s;
        }
        .answer:hover {
          background: rgba(60,60,60,0.9);
          border-color: #e50914;
          transform: scale(1.03);
        }

        .answer-bullet {
          background: #555;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        }

        /* Answer States */
        .answer-correct {
          background: rgba(0,200,50,0.3) !important;
          border-color: #00ff87 !important;
          transform: scale(1.05);
        }
        .answer-wrong {
          background: rgba(255,0,0,0.3) !important;
          border-color: #ff4444 !important;
        }
        .answer-disabled {
          opacity: 0.4;
        }

        .progress-section {
          margin-top: 25px;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          color: #aaa;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #444;
          border-radius: 6px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(to right, #e50914, orange);
          transition: width 0.4s;
        }

        .result-icon {
          width: 90px;
          height: 90px;
          color: gold;
          margin: 20px auto;
          animation: bounce 1.2s infinite;
        }

        .result-title {
          font-size: 40px;
          font-weight: 900;
          background: linear-gradient(to right, gold, orange);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }

        .result-card {
          background: rgba(0,0,0,0.4);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid gold;
          margin-bottom: 30px;
        }

        .result-score {
          font-size: 60px;
          font-weight: 900;
          color: gold;
        }
        .total {
          font-size: 32px;
          color: white;
        }

        .exit-btn {
          border-color: #666 !important;
          color: #ccc !important;
        }
        .play-again-btn {
          background: linear-gradient(to right, #e50914, orange);
          color: white;
          font-weight: bold;
          transition: 0.25s;
        }
        .play-again-btn:hover {
          transform: scale(1.05);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
