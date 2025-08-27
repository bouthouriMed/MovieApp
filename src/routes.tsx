// src/routes.ts
import HomePage from "./pages/homePage/HomePage";
import MovieDetailPage from "./pages/movieDetailPage/MovieDetailPage";
import WatchListPage from "./pages/watchListPage/WatchListPage";
import AuthCallbackPage from "./pages/authCallbackPage/AuthCallbackPage";
import OopsPage from "./pages/oopsPage/OopsPage";

export const ROUTES_URLS = {
  Home: "/",
  MovieDetail: "/movie/:id",
  WatchList: "/watchList",
  AuthCallback: "/auth/callback",
  Oops: "/oops",
};

export const routes = [
  { path: ROUTES_URLS.Home, element: <HomePage /> },
  { path: ROUTES_URLS.MovieDetail, element: <MovieDetailPage /> },
  { path: ROUTES_URLS.WatchList, element: <WatchListPage /> },
  { path: ROUTES_URLS.AuthCallback, element: <AuthCallbackPage /> },
  { path: ROUTES_URLS.Oops, element: <OopsPage /> },
];
