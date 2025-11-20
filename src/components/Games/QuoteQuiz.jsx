import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { quoteQuestions } from './gamesData';

export default function QuoteQuiz({ addScore }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * quoteQuestions.length));
    setSelected(null);
    setResult(null);
    setShowNext(false);
  }, []);

  const q = quoteQuestions[idx];

  const choose = (opt) => {
    if (showNext) return;
    setSelected(opt);
    const ok = opt === q.answer;
    setResult(ok ? 'correct' : 'wrong');
    if (ok) addScore(5);
    setShowNext(true);
  };

  const next = () => {
    let nextIndex = Math.floor(Math.random() * quoteQuestions.length);
    if (quoteQuestions.length > 1) {
      while (nextIndex === idx) nextIndex = Math.floor(Math.random() * quoteQuestions.length);
    }
    setIdx(nextIndex);
    setSelected(null);
    setResult(null);
    setShowNext(false);
  };

  return (
    <Card>
      <Body>
        <h3>Quote Quiz</h3>
        <blockquote className="quote">“{q.quote}”</blockquote>

        <Options>
          {q.options.map(opt => (
            <Opt key={opt} className={selected === opt ? (result === 'correct' ? 'correct' : 'wrong') : ''} onClick={() => choose(opt)}>
              {opt}
            </Opt>
          ))}
        </Options>

        <div className="actions">
          {showNext && <button className="primary" onClick={next}>Next</button>}
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
  .quote{font-size:18px;font-style:italic;margin:10px 0 16px 0;color:#ddd}
  .actions{margin-top:12px}
  button{padding:10px 12px;border-radius:6px;border:none;cursor:pointer}
  .primary{background:#e50914;color:#fff;font-weight:700}
`;

const Options = styled.div`
  display:flex;flex-direction:column;gap:8px
`;

const Opt = styled.button`
  text-align:left;padding:10px;border-radius:6px;border:1px solid #333;background:#111;color:#fff;cursor:pointer
  &.correct{background:rgba(0,150,0,0.12);border-color:rgba(0,200,0,0.2)}
  &.wrong{background:rgba(200,0,0,0.06);border-color:rgba(200,0,0,0.18)}
`;
