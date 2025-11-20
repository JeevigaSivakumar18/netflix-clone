import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { guessMovies } from './gamesData';

export default function GuessMovie({ addScore }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * guessMovies.length));
    setAnswer('');
    setShowResult(false);
  }, []);

  const movie = guessMovies[index];

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = (answer || '').trim().toLowerCase();
    const expected = (movie.title || '').trim().toLowerCase();
    const isCorrect = normalized === expected;
    setCorrect(isCorrect);
    setShowResult(true);
    if (isCorrect) addScore(10);
  };

  const next = () => {
    let nextIndex = Math.floor(Math.random() * guessMovies.length);
    // ensure next is different
    if (guessMovies.length > 1) {
      while (nextIndex === index) nextIndex = Math.floor(Math.random() * guessMovies.length);
    }
    setIndex(nextIndex);
    setAnswer('');
    setShowResult(false);
    setCorrect(false);
  };

  return (
    <Card>
      <PosterWrapper>
        <Poster src={movie.image} alt="poster" blurred={!showResult} />
      </PosterWrapper>

      <Body>
        <h3>Guess the Movie</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Type movie name" value={answer} onChange={e => setAnswer(e.target.value)} />
          <div className="row">
            <button type="submit" className="primary">Submit</button>
            {showResult && <button type="button" className="ghost" onClick={next}>Next</button>}
          </div>
        </form>

        {showResult && (
          <Result className={correct ? 'correct' : 'wrong'}>
            {correct ? 'Correct! +10' : `Wrong — Answer: ${movie.title}`}
          </Result>
        )}
      </Body>
    </Card>
  );
}

const Card = styled.div`
  background: #1f1f1f;
  border-radius: 10px;
  padding: 16px;
  width: 360px;
  box-shadow: 0 6px 18px rgba(0,0,0,.6);
  transition: transform .14s;
  &:hover{transform: translateY(-6px)}
`;

const PosterWrapper = styled.div`
  width:100%;
  height: 420px;
  overflow:hidden;
  border-radius:8px;
  margin-bottom:12px;
`;

const Poster = styled.img`
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  filter: ${p => (p.blurred ? 'blur(10px) grayscale(.2)' : 'none')};
  transition: filter .35s ease;
`;

const Body = styled.div`
  h3{margin:0 0 10px 0}
  form{display:flex;flex-direction:column;gap:8px}
  input{padding:10px;border-radius:6px;border:1px solid #333;background:#111;color:#fff}
  .row{display:flex;gap:8px;margin-top:8px}
  button{padding:10px 12px;border-radius:6px;border:none;cursor:pointer}
  .primary{background:#e50914;color:#fff;font-weight:700}
  .ghost{background:transparent;border:1px solid #444;color:#fff}
`;

const Result = styled.div`
  margin-top:12px;
  padding:10px;
  border-radius:6px;
  &.correct{background:rgba(229,9,20,0.12);color:#e4ffe6;border:1px solid rgba(0,200,0,0.14)}
  &.wrong{background:rgba(200,0,0,0.06);color:#ffd6d6;border:1px solid rgba(200,0,0,0.18)}
`;
