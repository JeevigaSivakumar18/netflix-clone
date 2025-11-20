import React, { useState } from 'react';
import styled from 'styled-components';
import GuessMovie from './GuessMovie';
import MovieTrivia from './MovieTrivia';
import QuoteQuiz from './QuoteQuiz';

const TABS = [
  { id: 'guess', label: 'Guess the Movie' },
  { id: 'trivia', label: 'Movie Trivia' },
  { id: 'quote', label: 'Quote Quiz' }
];

export default function GamesPage() {
  const [active, setActive] = useState('guess');
  const [score, setScore] = useState(0);

  const addScore = (points) => setScore(prev => prev + points);
  const resetScore = () => setScore(0);

  return (
    <Wrapper>
      <Header>
        <Title>Mini Games</Title>
        <Score>
          Score: <span>{score}</span>
          <Reset onClick={resetScore}>Reset</Reset>
        </Score>
      </Header>

      <Menu>
        {TABS.map(tab => (
          <Tab key={tab.id} active={tab.id === active} onClick={() => setActive(tab.id)}>
            {tab.label}
          </Tab>
        ))}
      </Menu>

      <Content>
        {active === 'guess' && <GuessMovie addScore={addScore} />}
        {active === 'trivia' && <MovieTrivia addScore={addScore} />}
        {active === 'quote' && <QuoteQuiz addScore={addScore} />}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #141414;
  color: #fff;
  padding: 40px 24px;
`;

const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #fff;
  margin: 0;
`;

const Score = styled.div`
  font-weight:700;
  color: #e50914;
  display:flex;
  align-items:center;
  gap:12px;
  span{font-size:20px}
`;

const Reset = styled.button`
  background: transparent;
  border: 1px solid #444;
  color: #fff;
  padding:6px 10px;
  border-radius:4px;
  cursor:pointer;
  transition:all .15s;
  &:hover{background:#222}
`;

const Menu = styled.div`
  display:flex;
  gap:12px;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  background: ${p => (p.active ? '#e50914' : '#222')};
  border: none;
  color: #fff;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
`;

const Content = styled.div`
  display:flex;
  gap:20px;
  flex-wrap:wrap;
`;
