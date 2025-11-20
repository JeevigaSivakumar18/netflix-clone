import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageSections } from "../store/netflixSlice";

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { homepageSections, loading } = useSelector((state) => state.netflix);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (Object.keys(homepageSections).length === 0 && !loading) {
      dispatch(fetchHomepageSections());
    }
  }, [dispatch, homepageSections, loading]);

  useEffect(() => {
    const movies = Object.values(homepageSections).flat();
    if (movies.length > 0) {
      const foundMovie = movies.find(m => m._id === id || m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        navigate("/");
      }
    }
  }, [homepageSections, id, navigate]);

  if (loading) {
    return <h2 style={{ color: "white" }}>Loading movie...</h2>;
  }

  if (!movie) {
    return <h2 style={{ color: "white" }}>Movie not found!</h2>;
  }

  return (
    <div
      style={{
        color: "white",
        padding: "2rem",
        textAlign: "center",
        background: "#141414",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#e50914",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        ← Back to Home
      </button>

      <h1>{movie.title}</h1>
      <p style={{ margin: "0.5rem 0", color: "#9ca3af" }}>
        {movie.year} • {movie.category}
      </p>

      {movie.poster && (
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            maxWidth: "300px",
            borderRadius: "8px",
            margin: "1rem auto",
            display: "block",
          }}
        />
      )}

      <p style={{ maxWidth: "600px", margin: "1rem auto" }}>
        {movie.description}
      </p>

      {movie.genres && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Genres:</strong> {movie.genres.join(", ")}
        </div>
      )}
    </div>
  );
}

export default Player;
