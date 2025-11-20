import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Fetch featured movies
export const fetchFeaturedMovies = createAsyncThunk(
  'netflix/fetchFeaturedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/featured/list`);
      return response.data.movies;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured movies');
    }
  }
);

// Fetch homepage sections
export const fetchHomepageSections = createAsyncThunk(
  'netflix/fetchHomepageSections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/homepage/sections`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch homepage sections');
    }
  }
);

const netflixSlice = createSlice({
  name: 'netflix',
  initialState: {
    featured: [],
    homepageSections: {},
    loading: false,
    error: null,
    movies: []   // This MUST contain all movies
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // FEATURED
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;

        // Also store into movies list
        // Deduplicate by _id in case featured overlaps with other lists
        const map = new Map();
        action.payload.forEach(m => map.set(String(m._id || m.id || m.imdbId), m));
        state.movies = Array.from(map.values());
      })
      .addCase(fetchFeaturedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // HOMEPAGE SECTIONS
      .addCase(fetchHomepageSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageSections.fulfilled, (state, action) => {
        state.loading = false;
        state.homepageSections = action.payload;

        // 🔥 Collect all movies into a single array
        let combinedMovies = [];

        Object.values(action.payload).forEach(sectionMovies => {
          if (Array.isArray(sectionMovies)) {
            combinedMovies = [...combinedMovies, ...sectionMovies];
          }
        });

        // Deduplicate movies by id to avoid duplicate React keys when rendering lists
        const unique = new Map();
        combinedMovies.forEach(m => {
          const id = String(m._id || m.id || m.imdbId);
          if (!unique.has(id)) unique.set(id, m);
        });

        state.movies = Array.from(unique.values());
      })
      .addCase(fetchHomepageSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = netflixSlice.actions;
export default netflixSlice.reducer;
