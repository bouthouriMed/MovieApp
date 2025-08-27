import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_KEY_V3 = import.meta.env.VITE_TMDB_API_KEY_V3;

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3/",
    prepareHeaders: (headers, { endpoint }) => {
      // Only apply v4 Bearer for read endpoints
      if (
        endpoint !== "getRequestToken" &&
        endpoint !== "createSession" &&
        endpoint !== "getAccount" &&
        endpoint !== "addToWatchlist"
      ) {
        headers.set("Authorization", `Bearer ${API_KEY}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMovieById: builder.query<any, number>({
      query: (id) =>
        `movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`,
    }),
    // --- Movies ---
    getMovies: builder.query<any[], string>({
      query: (category) => `/movie/${category}`,
      transformResponse: (res: any) => res.results,
    }),

    searchMovies: builder.query<any[], string>({
      query: (term) => `/search/movie?query=${encodeURIComponent(term)}`,
      transformResponse: (res: any) => res.results,
    }),

    getWatchlist: builder.query<
      any[],
      { account_id: number; session_id: string }
    >({
      query: ({ account_id, session_id }) => ({
        url: `/account/${account_id}/watchlist/movies`,
        params: {
          api_key: API_KEY_V3, // must use v3 key
          session_id,
        },
      }),
      transformResponse: (res: any) => res.results,
    }),

    addToWatchlist: builder.mutation<
      any,
      { movieId: number; session_id: string; account_id: number }
    >({
      query: ({ movieId, session_id, account_id }) => ({
        url: `/account/${account_id}/watchlist`,
        method: "POST",
        params: {
          api_key: API_KEY_V3, // v3 key
          session_id,
        },
        body: {
          media_type: "movie",
          media_id: movieId,
          watchlist: true,
        },
      }),
    }),

    // --- Watchlist ---
    // Remove a movie from the user's watchlist
    deleteFromWatchlist: builder.mutation<
      any,
      { movieId: number; session_id: string; account_id: number }
    >({
      query: ({ movieId, session_id, account_id }) => ({
        url: `/account/${account_id}/watchlist`,
        method: "POST", // TMDB uses POST with watchlist=false
        params: {
          api_key: API_KEY_V3,
          session_id,
        },
        body: {
          media_type: "movie",
          media_id: movieId,
          watchlist: false, // set to false to remove
        },
      }),
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useSearchMoviesQuery,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
} = moviesApi;
