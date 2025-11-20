import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { triviaQuestions } from './gamesData';

export default function MovieTrivia({ addScore }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setQIndex(Math.floor(Math.random() * triviaQuestions.length));
    setSelected(null);
    setShowNext(false);
    setResult(null);
  }, []);

  const q = triviaQuestions[qIndex];

  const choose = (opt) => {
    if (showNext) return;
    setSelected(opt);
    const ok = opt === q.answer;
    setResult(ok ? 'correct' : 'wrong');
    if (ok) addScore(5);
    setShowNext(true);
  };

  const next = () => {
    let nextIndex = Math.floor(Math.random() * triviaQuestions.length);
    if (triviaQuestions.length > 1) {
      while (nextIndex === qIndex) nextIndex = Math.floor(Math.random() * triviaQuestions.length);
    }
    setQIndex(nextIndex);
    setSelected(null);
    setShowNext(false);
    setResult(null);
  };

  return (
    <Card>
      <Body>
        <h3>Movie Trivia</h3>
        <p className="question">{q.question}</p>

        <Options>
          {q.options.map(opt => (
            <Option key={opt} onClick={() => choose(opt)} className={selected === opt ? (result === 'correct' ? 'correct' : 'wrong') : ''}>
              {opt}
            </Option>
          ))}
        </Options>

        <div className="actions">
          {showNext && <button className="primary" onClick={next}>Next Question</button>}
        </div>
      </Body>
    </Card>
  );
}

const Card = styled.div`
  background: #1f1f1f;
  border-radius: 10px;
  padding: 16px;
  width: 420px;
  box-shadow: 0 6px 18px rgba(0,0,0,.6);
  transition: transform .14s;
  &:hover{transform: translateY(-6px)}
`;

const Body = styled.div`
  h3{margin:0 0 10px 0}
  .question{font-weight:600;margin-bottom:12px}
  .actions{margin-top:12px}
  button{padding:10px 12px;border-radius:6px;border:none;cursor:pointer}
  .primary{background:#e50914;color:#fff;font-weight:700}
`;

const Options = styled.div`
  display:flex;flex-direction:column;gap:8px
`;

const Option = styled.button`
  text-align:left;padding:10px;border-radius:6px;border:1px solid #333;background:#111;color:#fff;cursor:pointer
  &.correct{background:rgba(0,150,0,0.12);border-color:rgba(0,200,0,0.2)}
  &.wrong{background:rgba(200,0,0,0.06);border-color:rgba(200,0,0,0.18)}
`;
