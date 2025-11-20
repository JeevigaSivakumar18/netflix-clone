import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { myListAPI } from "../services/api";

/* -----------------------------
   THUNKS MUST COME FIRST
------------------------------ */

export const fetchMyList = createAsyncThunk(
  "myList/fetchMyList",
  async (_, thunkAPI) => {
    try {
      const response = await myListAPI.getAll();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch list"
      );
    }
  }
);

export const addToMyList = createAsyncThunk(
  "myList/addToMyList",
  async (movieId, thunkAPI) => {
    try {
      const response = await myListAPI.add(movieId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add movie"
      );
    }
  }
);

export const removeFromMyList = createAsyncThunk(
  "myList/removeFromMyList",
  async (movieId, thunkAPI) => {
    try {
      await myListAPI.remove(movieId);
      return movieId; // return removed ID
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove movie"
      );
    }
  }
);

export const checkMyListStatus = createAsyncThunk(
  "myList/checkMyListStatus",
  async (movieId, thunkAPI) => {
    try {
      const response = await myListAPI.check(movieId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to check status"
      );
    }
  }
);

/* -----------------------------
   INITIAL STATE
------------------------------ */

const initialState = {
  items: [],
  loading: false,
  error: null,
  pagination: null,
};

/* -----------------------------
   SLICE
------------------------------ */

const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMyList: (state) => {
      state.items = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- FETCH MY LIST -------- */
      .addCase(fetchMyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.myList || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchMyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      /* -------- ADD MOVIE -------- */
      .addCase(addToMyList.fulfilled, (state, action) => {
        if (action.payload?.item) {
          state.items.unshift(action.payload.item);
        }
      })

      /* -------- REMOVE MOVIE -------- */
      .addCase(removeFromMyList.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (m) => m.movie?._id !== action.payload
        );
      });
  },
});

/* -----------------------------
   EXPORTS
------------------------------ */

export const { clearError, clearMyList } = myListSlice.actions;
export default myListSlice.reducer;
