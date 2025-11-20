import axios from "axios";

const API = "http://localhost:5001/api/movies";

export const getAllMovies = async () => {
  try {
    const response = await axios.get(API);
    return response.data.movies; // because backend returns {movies:[...]}
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
