import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToMyList, removeFromMyList, checkMyListStatus } from "../store/myListSlice";
import { Play, Plus, X, Info } from "lucide-react";

export default function Card({ movieData, onAddToList, onRemoveFromList }) {
  const dispatch = useDispatch();
  const [inMyList, setInMyList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if movie is in My List
  useEffect(() => {
    if (movieData?._id || movieData?.id) {
      dispatch(checkMyListStatus(movieData._id || movieData.id)).then((result) => {
        if (result.payload) {
          setInMyList(result.payload.inList);
        }
      });
    }
  }, [dispatch, movieData]);

  // Toggle add/remove from list
  const handleToggleList = async (e) => {
    e.stopPropagation();
    
    if (inMyList) {
      dispatch(removeFromMyList(movieData._id || movieData.id));
      setInMyList(false);
    } else {
      dispatch(addToMyList(movieData._id || movieData.id));
      setInMyList(true);
    }
  };

  if (!movieData) return null;

  const poster = movieData.poster || movieData.backdrop || "/placeholder_poster.png";
  const title = movieData.title || movieData.name || "Untitled";
  const genres = movieData.genre || [];
  const description = movieData.description || "";
  const year = movieData.year || "";

  return (
    <CardContainer 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      $isHovered={isHovered}
    >
      <PosterContainer>
        <Poster src={poster} alt={title} />
        <Overlay $isHovered={isHovered}>
          <ActionButtons>
            <PlayButton>
              <Play size={20} />
            </PlayButton>
            <AddButton onClick={handleToggleList} $inList={inMyList}>
              {inMyList ? <X size={20} /> : <Plus size={20} />}
            </AddButton>
            <InfoButton>
              <Info size={20} />
            </InfoButton>
          </ActionButtons>
        </Overlay>
      </PosterContainer>
      <MovieInfo>
        <Title>{title}</Title>
        <Meta>
          <Year>{year}</Year>
          {genres.length > 0 && <Genres>{genres.slice(0, 2).join(" • ")}</Genres>}
        </Meta>
        {isHovered && (
          <Description>{description}</Description>
        )}
      </MovieInfo>
    </CardContainer>
  );
}

/* ---------------- Styled Components ---------------- */
const CardContainer = styled.div`
  width: 220px;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  color: white;
  flex: 0 0 auto;
  cursor: pointer;
  transition: transform 0.3s ease, z-index 0.3s ease;
  position: relative;
  z-index: ${props => props.$isHovered ? 10 : 1};

  &:hover {
    transform: scale(1.05);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const Poster = styled.img`
  width: 100%;
  height: 330px;
  object-fit: cover;
  background: #222;
  transition: filter 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  opacity: ${props => props.$isHovered ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PlayButton = styled.button`
  background: white;
  border: none;
  color: black;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e50914;
    color: white;
    transform: scale(1.1);
  }
`;

const AddButton = styled.button`
  background: ${props => props.$inList ? '#e50914' : 'rgba(42, 42, 42, 0.6)'};
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e50914;
    border-color: white;
    transform: scale(1.1);
  }
`;

const InfoButton = styled.button`
  background: rgba(42, 42, 42, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: black;
    transform: scale(1.1);
  }
`;

const MovieInfo = styled.div`
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
  line-height: 1.2;
  color: white;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const Year = styled.span`
  color: #b3b3b3;
  font-weight: 400;
`;

const Genres = styled.span`
  color: #b3b3b3;
  font-weight: 400;
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: #b3b3b3;
  line-height: 1.4;
  margin: 0.5rem 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
