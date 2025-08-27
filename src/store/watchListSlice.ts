import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Movie } from "src/pages/movieDetailPage/types";

export interface WatchListItem {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface WatchListState {
  movies: Movie[];
}

const initialState: WatchListState = { movies: [] };

export const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addTowatchList: (state, action: PayloadAction<Movie>) => {
      const movieExists = state.movies.some((m) => m.id === action.payload.id);

      if (movieExists) {
        toast.info(`"${action.payload.title}" is already in your wishlist.`);
        return;
      }

      state.movies = [...state.movies, action.payload];
      toast.success(`"${action.payload.title}" added to your wishlist!`);
    },
    setwatchList: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
    removeFromwatchList: (state, action: PayloadAction<number>) => {
      const removedMovie = state.movies.find((m) => m.id === action.payload);
      state.movies = state.movies.filter((m) => m.id !== action.payload);
      toast.info(`"${removedMovie?.title}" is removed from you wishlist`);
    },
    clearWatchList: (state) => {
      state.movies = [];
    },
  },
});

// Explicitly type the reducer to allow undefined initial state
export default watchListSlice.reducer as unknown as (
  state: WatchListState | undefined,
  action: any
) => WatchListState;

export const {
  setwatchList,
  addTowatchList,
  removeFromwatchList,
  clearWatchList,
} = watchListSlice.actions;
