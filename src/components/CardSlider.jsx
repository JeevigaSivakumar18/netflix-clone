import React from "react";
import styled from "styled-components";
import Card from "./Card";

export default function CardSlider({ title = "", movies = [], onAddToList }) {
  // ✅ ADD DEBUGGING
  console.log(`🎬 CardSlider "${title}":`, movies?.length || 0, "movies");
  
  if (!movies || movies.length === 0) {
    console.log(`❌ CardSlider "${title}": No movies to display`);
    return null;
  }

  return (
    <Section>
      {title && <h2 className="slider-title">{title}</h2>}
      <SliderContainer>
        {movies.map((movie) => (
          <Card
            key={movie._id || movie.id} 
            movieData={movie}
            onAddToList={onAddToList}
          />
        ))}
      </SliderContainer>
    </Section>
  );
}

// ... styled components remain the same
const Section = styled.div`
  margin: 1.5rem 0;
  .slider-title {
    color: white;
    margin-left: 1rem;
    font-size: 1.25rem;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  gap: 1rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
