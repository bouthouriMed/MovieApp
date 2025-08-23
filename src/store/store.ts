import { configureStore } from "@reduxjs/toolkit";
import { moviesApi } from "./apiSlice";
import watchListReducer from "./watchListSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [moviesApi.reducerPath]: moviesApi.reducer,
    auth: authReducer,
    watchList: watchListReducer,
  },
  middleware: (gDM) => gDM().concat(moviesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
