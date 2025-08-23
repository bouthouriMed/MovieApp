import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface watchListState {
  items: Movie[];
}

const initialState: watchListState = {
  items: [],
};

const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addTowatchList: (state, action: PayloadAction<Movie>) => {
      const movieExists = state.items.some((m) => m.id === action.payload.id);

      if (movieExists) {
        toast.info(`"${action.payload.title}" is already in your watchlist.`);
        return;
      }

      state.items = [...state.items, action.payload];
      toast.success(`"${action.payload.title}" added to your watchlist!`);
    },

    removeFromwatchList: (state, action: PayloadAction<number>) => {
      const movie = state.items.find((m) => m.id === action.payload);
      state.items = state.items.filter((m) => m.id !== movie?.id);
      if (movie) {
        toast.info(`${movie.title} is removed from watchList!`);
      }
    },

    setwatchList: (state, action: PayloadAction<Movie[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addTowatchList, removeFromwatchList, setwatchList } =
  watchListSlice.actions;
export default watchListSlice.reducer;
