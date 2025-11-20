import { configureStore } from "@reduxjs/toolkit";
import netflixReducer from "./netflixSlice";
import genreReducer from "./genreSlice";
import myListReducer from "./myListSlice";

export const store = configureStore({
  reducer: {
    netflix: netflixReducer,
    genre: genreReducer,
    myList: myListReducer,
  },
});



export default store;
