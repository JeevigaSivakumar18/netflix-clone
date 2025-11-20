// src/pages/Tv.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageSections } from "../store/netflixSlice";

import Navbar from "../components/Navbar";
import styled from "styled-components";
import { FaPlay, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Tv() {
  const dispatch = useDispatch();
  const { movies, loading } = useSelector((state) => state.netflix);
  const [hoveredShow, setHoveredShow] = useState(null);

  useEffect(() => {
    if (movies.length === 0 && !loading) {
      dispatch(fetchHomepageSections());
    }
  }, [dispatch, movies.length, loading]);

  // Filter movies to show only TV shows (you might want to add a type field to distinguish)
  const tvShows = movies.filter(movie => movie.genre?.includes('Drama') || movie.genre?.includes('Comedy'));

  const groupByGenre = () => {
    const grouped = {};
    tvShows.forEach(show => {
      show.genres?.forEach(genre => {
        if (!grouped[genre]) grouped[genre] = [];
        grouped[genre].push(show);
      });
    });
    return grouped;
  };

  const scroll = (genre, direction) => {
    const container = document.getElementById(`row-${genre.replace(/\s/g, '-')}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const groupedShows = groupByGenre();
  const featuredShow = tvShows[Math.floor(Math.random() * Math.min(5, tvShows.length))];

  if (loading) {
    return (
      <LoadingContainer>
        <Navbar />
        <LoadingText>Loading TV Shows...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Navbar />
      
      {/* Hero Banner */}
      {featuredShow && (
        <HeroSection>
          <HeroBackground 
            src={featuredShow.poster} 
            alt={featuredShow.title}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/1920x1080/141414/ffffff?text=${featuredShow.title}`;
            }}
          />
          <HeroGradient />
          <HeroContent>
            <HeroTitle>{featuredShow.title}</HeroTitle>
            <HeroMeta>
              <MatchScore>{Math.floor(featuredShow.rating * 10)}% Match</MatchScore>
              <Year>{featuredShow.year}</Year>
              <Rating>TV-MA</Rating>
            </HeroMeta>
            <HeroDescription>{featuredShow.description}</HeroDescription>
            <HeroButtons>
              <PlayButton>
                <FaPlay /> Play
              </PlayButton>
              <InfoButton>
                <FaPlus /> More Info
              </InfoButton>
            </HeroButtons>
          </HeroContent>
        </HeroSection>
      )}

      {/* Genre Rows */}
      <GenreContainer>
        {Object.entries(groupedShows).map(([genre, shows]) => (
          <GenreRow key={genre}>
            <GenreTitle>{genre}</GenreTitle>
            <RowWrapper>
              <ScrollButton 
                className="left"
                onClick={() => scroll(genre, 'left')}
              >
                <FaChevronLeft />
              </ScrollButton>
              
              <ShowsRow id={`row-${genre.replace(/\s/g, '-')}`}>
                {shows.map((show) => (
                  <ShowCard
                    key={show.tmdbId}
                    onMouseEnter={() => setHoveredShow(show.tmdbId)}
                    onMouseLeave={() => setHoveredShow(null)}
                    isHovered={hoveredShow === show.tmdbId}
                  >
                    <Poster 
                      src={show.poster} 
                      alt={show.title}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${show.title}`;
                      }}
                    />
                    
                    {hoveredShow === show.tmdbId && (
                      <HoverCard>
                        <HoverActions>
                          <ActionButton className="play">
                            <FaPlay />
                          </ActionButton>
                          <ActionButton className="add">
                            <FaPlus />
                          </ActionButton>
                        </HoverActions>
                        <HoverTitle>{show.title}</HoverTitle>
                        <HoverMeta>
                          <MatchScore>{Math.floor(show.rating * 10)}% Match</MatchScore>
                          <span>{show.year}</span>
                        </HoverMeta>
                        <HoverGenres>
                          {show.genres?.map((g, i) => (
                            <span key={i}>
                              {g}{i < show.genres.length - 1 && ' • '}
                            </span>
                          ))}
                        </HoverGenres>
                        <HoverDescription>{show.description}</HoverDescription>
                      </HoverCard>
                    )}
                  </ShowCard>
                ))}
              </ShowsRow>
              
              <ScrollButton 
                className="right"
                onClick={() => scroll(genre, 'right')}
              >
                <FaChevronRight />
              </ScrollButton>
            </RowWrapper>
          </GenreRow>
        ))}
      </GenreContainer>
    </Container>
  );
}

export default Tv;

// Styled Components
const Container = styled.div`
  background: #141414;
  min-height: 100vh;
  color: white;
`;

const LoadingContainer = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const LoadingText = styled.div`
  color: white;
  text-align: center;
  padding: 100px 20px;
  font-size: 1.5rem;
`;

const HeroSection = styled.div`
  position: relative;
  height: 80vh;
  margin-bottom: -150px;
  overflow: hidden;
`;

const HeroBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0.7) 50%, transparent 100%),
              linear-gradient(to top, rgba(20, 20, 20, 1) 0%, transparent 50%);
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 35%;
  left: 4%;
  max-width: 500px;
  z-index: 10;

  @media (max-width: 768px) {
    bottom: 20%;
    max-width: 90%;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const MatchScore = styled.span`
  color: #46d369;
  font-weight: 700;
`;

const Year = styled.span`
  color: #d2d2d2;
`;

const Rating = styled.span`
  border: 1px solid #808080;
  padding: 0 0.5rem;
  font-size: 0.9rem;
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: black;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

const InfoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(109, 109, 110, 0.7);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(109, 109, 110, 0.4);
  }
`;

const GenreContainer = styled.div`
  position: relative;
  z-index: 20;
  padding: 0 4% 50px;
`;

const GenreRow = styled.div`
  margin-bottom: 3rem;
`;

const GenreTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-left: 4%;
`;

const RowWrapper = styled.div`
  position: relative;
  
  &:hover .left,
  &:hover .right {
    opacity: 1;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 30;
  width: 4%;
  background: rgba(20, 20, 20, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(20, 20, 20, 0.8);
  }

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
`;

const ShowsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 0 4%;
`;

const ShowCard = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 250px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform-origin: center;
  
  ${props => props.isHovered && `
    transform: scale(1.1);
    z-index: 40;
  `}
`;

const Poster = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  background: #2a2a2a;
`;

const HoverCard = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 320px;
  background: #181818;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  padding: 1rem;
  margin-top: 0.5rem;
  z-index: 50;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

const HoverActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #808080;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: white;
    transform: scale(1.1);
  }

  &.play {
    background: white;
    color: black;
    border-color: white;
  }
`;

const HoverTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const HoverMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: #d2d2d2;
`;

const HoverGenres = styled.div`
  font-size: 0.8rem;
  color: #d2d2d2;
  margin-bottom: 0.5rem;
`;

const HoverDescription = styled.p`
  font-size: 0.85rem;
  color: #d2d2d2;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;