import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import NotAvailable from "../components/NotAvailable";
import SelectGenre from "../components/SelectGenre";
import { fetchAllGenres} from "../store/genreSlice";
import {fetchHomepageSections} from "../store/netflixSlice";

export default function Movies() {
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);

  const { movies, loading } = useSelector((state) => state.netflix);
  const genres = useSelector((state) => state.genre.genres || []);

  useEffect(() => {
    dispatch(fetchAllGenres());
    dispatch(fetchHomepageSections());

  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const normalizeGenres = (movie) => {
    if (!movie) return [];
    if (Array.isArray(movie.genre) && movie.genre.length) return movie.genre;
    if (Array.isArray(movie.genres) && movie.genres.length) return movie.genres;
    return [];
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return movies.filter((movie) =>
      movie.title?.toLowerCase().includes(query)
    );
  }, [movies, searchQuery]);

  const displayedGenres = useMemo(() => {
    if (!selectedGenre || selectedGenre === "Top Picks") {
      return genres;
    }
    return genres.includes(selectedGenre) ? [selectedGenre] : genres;
  }, [genres, selectedGenre]);

  const hasSearch = searchQuery.trim().length > 0;
  const topPicks = movies.slice(0, 10);

  return (
    <Container>
      <Navbar isscrolled={isScrolled.toString()} />

      <Header>
        <div className="header-left">
          <h1>
            {hasSearch
              ? `Search Results for "${searchQuery}"`
              : selectedGenre && selectedGenre !== "Top Picks"
              ? `${selectedGenre} Picks`
              : "Browse Movies"}
          </h1>

          {!hasSearch && (
            <SelectGenre
              genres={["Top Picks", ...genres]}
              onChange={(genre) => setSelectedGenre(genre)}
              value={selectedGenre}
            />
          )}
        </div>

        <SearchContainer>
          <div className={`search ${showSearch ? "show" : ""}`}>
            <div className="search-wrapper">
              <button
                className="search-btn"
                onFocus={() => setShowSearch(true)}
                onBlur={() => {
                  if (!inputHover) setShowSearch(false);
                }}
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                onBlur={() => {
                  setShowSearch(false);
                  setInputHover(false);
                }}
              />
            </div>
          </div>
        </SearchContainer>
      </Header>

      <Content>
        {loading && movies.length === 0 ? (
          <StatusBanner>Loading movies…</StatusBanner>
        ) : hasSearch ? (
          searchResults.length > 0 ? (
            <CardSlider title="Search Results" movies={searchResults} />
          ) : (
            <NotAvailable message={`No movies found for "${searchQuery}"`} />
          )
        ) : (
          <>
            <CardSlider title="Top Picks" movies={topPicks} />

            {displayedGenres.map((genre) => {
              const genreMovies = movies.filter((movie) =>
                normalizeGenres(movie).includes(genre)
              );

              if (genreMovies.length === 0) {
                return null;
              }

              return (
                <CardSlider key={genre} title={genre} movies={genreMovies} />
              );
            })}
          </>
        )}
      </Content>
    </Container>
  );
}

/* ========================= */
/*      STYLED COMPONENTS    */
/* ========================= */

const Container = styled.div`
  background-color: #141414;
  min-height: 100vh;
  color: white;
  padding-top: 68px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5rem 2rem 2rem 2rem;
  flex-wrap: wrap;
  gap: 20px;

  h1 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
    color: white;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;

  .search {
    position: relative;

    .search-wrapper {
      display: flex;
      align-items: center;
      background: transparent;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      border-radius: 4px;
    }

    &.show .search-wrapper {
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .search-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: color 0.3s ease;
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      color: white;
      padding: 8px 12px 8px 0;
      width: 0;
      opacity: 0;
      transition: all 0.3s ease;
    }

    &.show input {
      width: 280px;
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  margin: 2rem 2rem 4rem 2rem;
`;

const StatusBanner = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.25rem;
  color: #b3b3b3;
`;
