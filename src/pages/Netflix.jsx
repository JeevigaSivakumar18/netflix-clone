import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedMovies, fetchHomepageSections } from "../store/netflixSlice";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";

const HERO_SECTION_HEIGHT = "70vh";

const Netflix = () => {
  const dispatch = useDispatch();

  const { featured, homepageSections, loading, error } = useSelector(
    (state) => state.netflix
  );

  // ✅ FIXED: Only fetch data when it's not already loaded
  useEffect(() => {
    console.log("🔄 Netflix useEffect - Checking if data needs fetching");
    console.log("Featured loaded:", featured && featured.length > 0);
    console.log("Sections loaded:", homepageSections && Object.keys(homepageSections).length > 0);
    
    // Only fetch featured movies if we don't have any
    if (!featured || featured.length === 0) {
      console.log("📡 Fetching featured movies...");
      dispatch(fetchFeaturedMovies());
    } else {
      console.log("✅ Using existing featured movies");
    }
    
    // Only fetch homepage sections if we don't have any
    if (!homepageSections || Object.keys(homepageSections).length === 0) {
      console.log("📡 Fetching homepage sections...");
      dispatch(fetchHomepageSections());
    } else {
      console.log("✅ Using existing homepage sections");
    }
  }, [dispatch]); // ✅ Remove featured and homepageSections from dependencies

  const carouselMovies = useMemo(() => featured || [], [featured]);

  // Rest of your component remains exactly the same...
  // ✅ GET ALL MOVIES FROM HOMEPAGE SECTIONS
  const allMovies = useMemo(() => {
    if (!homepageSections) return [];
    
    const movies = Object.values(homepageSections).flat();
    return movies;
  }, [homepageSections]);

  // ✅ CREATE GENRE-BASED SECTIONS
  const genreSections = useMemo(() => {
    const sections = {};
    const popularGenres = ["Action", "Drama", "Comedy", "Thriller", "Adventure", "Sci-Fi"];
    
    popularGenres.forEach(genre => {
      const genreMovies = allMovies.filter(movie => {
        const movieGenres = movie.genres || movie.genre || [];
        return Array.isArray(movieGenres) 
          ? movieGenres.includes(genre)
          : false;
      });
      
      if (genreMovies.length > 0) {
        sections[genre] = genreMovies;
      }
    });
    
    return sections;
  }, [allMovies]);

  // ✅ CREATE CATEGORY-BASED SECTIONS
  const categorySections = useMemo(() => {
    const sections = {};
    const popularCategories = ["Trending", "Blockbusters", "New Releases", "Epics"];
    
    popularCategories.forEach(category => {
      const categoryMovies = allMovies.filter(movie => 
        movie.category === category
      );
      
      if (categoryMovies.length > 0) {
        sections[category] = categoryMovies;
      }
    });
    
    return sections;
  }, [allMovies]);

  // ✅ COMBINE ALL SECTIONS FOR DISPLAY
  const displaySections = useMemo(() => {
    const sections = {
      ...categorySections,
      ...genreSections
    };
    
    return sections;
  }, [categorySections, genreSections]);

  // ✅ SECTION TITLES MAPPING
  const SECTION_TITLES = {
    "Trending": "Trending Now 🔥",
    "Blockbusters": "Blockbuster Hits 🎬", 
    "New Releases": "New Releases 🆕",
    "Epics": "Epic Adventures ⚔️",
    "Action": "Action Packed 💥",
    "Drama": "Drama Series 🎭",
    "Comedy": "Comedy Central 😂",
    "Thriller": "Thriller Zone 🕵️",
    "Adventure": "Adventure Quest 🌍",
    "Sci-Fi": "Sci-Fi Worlds 🚀"
  };

  if (loading && carouselMovies.length === 0) {
    return <Loading>Loading…</Loading>;
  }

  if (error) {
    return <ErrorBox>Error: {error}</ErrorBox>;
  }

  return (
    <Container>
      <Navbar />

      {carouselMovies.length > 0 && (
        <HeroCarousel>
          {carouselMovies.map((movie) => (
            <HeroSlide
              key={movie._id || movie.id}
              style={{
                backgroundImage: `linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0.85),
                    rgba(0, 0, 0, 0.35)
                  ),
                  url(${movie.backdrop || movie.poster})`,
              }}
            >
              <HeroSlideContent>
                <span className="badge">Featured</span>
                <h1>{movie.title}</h1>
                <p>{movie.description}</p>
                <HeroActions>
                  {movie.trailerUrl && (
                    <PrimaryButton
                      href={movie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ▶ Play Trailer
                    </PrimaryButton>
                  )}
                  {(movie.genres || movie.genre) && (
                    <SecondaryButton>
                      {Array.isArray(movie.genres || movie.genre)
                        ? (movie.genres || movie.genre).join(" • ")
                        : (movie.genres || movie.genre)}
                    </SecondaryButton>
                  )}
                </HeroActions>
              </HeroSlideContent>
            </HeroSlide>
          ))}
        </HeroCarousel>
      )}

      <SectionsWrapper>
        {Object.entries(displaySections).map(([sectionName, movies]) => {
          const displayTitle = SECTION_TITLES[sectionName] || sectionName;
          
          return (
            <CardSlider
              key={sectionName}
              title={displayTitle}
              movies={movies}
            />
          );
        })}

        {Object.keys(displaySections).length === 0 && !loading && (
          <NoContent>
            <h3>No movies available</h3>
            <p>Check your database for movie data.</p>
          </NoContent>
        )}
      </SectionsWrapper>
    </Container>
  );
};

/* ================= STYLES ================= */
const Container = styled.div`
  background: #000;
  color: #fff;
  min-height: 100vh;
`;

const Loading = styled.div`
  padding: 100px;
  text-align: center;
  color: white;
  font-size: 24px;
`;

const ErrorBox = styled.div`
  padding: 50px;
  color: red;
  text-align: center;
`;

const HeroCarousel = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 1rem;
  width: 100%;
  padding: 2rem 0 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  height: ${HERO_SECTION_HEIGHT};

  &::-webkit-scrollbar {
    height: 12px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 999px;
  }
`;

const HeroSlide = styled.article`
  position: relative;
  min-width: min(85vw, 1100px);
  border-radius: 24px;
  overflow: hidden;
  scroll-snap-align: center;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 3rem;
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.65));
    z-index: 0;
  }
`;

const HeroSlideContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;

  .badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    margin-bottom: 1rem;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.5rem, 4vw, 4.5rem);
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1.5rem;
    max-height: 4.5rem;
    overflow: hidden;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.a`
  background: #e50914;
  color: #fff;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.03em;
`;

const SecondaryButton = styled.span`
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
`;

const SectionsWrapper = styled.div`
  margin-top: 40px;
  padding-bottom: 4rem;
`;

const NoContent = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
  
  h3 {
    color: #e50914;
    margin-bottom: 1rem;
  }
`;

export default Netflix;