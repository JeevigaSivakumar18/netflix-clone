// src/store/genreSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { moviesAPI } from "../services/api";

// ✔ renamed to avoid conflict with fetchGenres in netflixSlice
export const fetchAllGenres = createAsyncThunk(
  "genre/fetchAllGenres",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await moviesAPI.getGenres();
      return data.genres || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch genres"
      );
    }
  }
);

const genreSlice = createSlice({
  name: "genre",
  initialState: {
    genres: [],
    loading: false,
    error: null,
  },
  reducers: {
    setGenres(state, action) {
      state.genres = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchAllGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load genres";
      });
  },
});

export const { setGenres } = genreSlice.actions;
export default genreSlice.reducer;
