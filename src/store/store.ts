import { configureStore, Reducer } from "@reduxjs/toolkit";
import { moviesApi } from "./movieSlice";
import { userApi } from "./userSlice";
import authReducer, { AuthState } from "./authSlice";
import watchListReducer, { WatchListState } from "./watchListSlice";

// Explicit reducers type
const reducers: {
  auth: Reducer<AuthState>;
  watchList: Reducer<WatchListState>;
  [moviesApi.reducerPath]: typeof moviesApi.reducer;
  [userApi.reducerPath]: typeof userApi.reducer;
} = {
  auth: authReducer,
  watchList: watchListReducer,
  [moviesApi.reducerPath]: moviesApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(moviesApi.middleware)
      .concat(userApi.middleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
