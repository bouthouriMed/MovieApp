// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "https://api.themoviedb.org/3";

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { endpoint }) => {
      // Only apply v4 Bearer for read endpoints
      if (
        endpoint !== "getRequestToken" &&
        endpoint !== "createSession" &&
        endpoint !== "getAccount" &&
        endpoint !== "addToWatchlist"
      ) {
        headers.set(
          "Authorization",
          `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        );
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Movies", "Movie", "Watchlist", "Auth"],
  endpoints: (builder) => ({
    // --- Movies ---
    getMovies: builder.query<any[], string>({
      query: (category) => `/movie/${category}`,
      transformResponse: (res: any) => res.results,
    }),

    getMovieById: builder.query<any, number>({
      query: (id) => `/movie/${id}`,
    }),

    searchMovies: builder.query<any[], string>({
      query: (term) => `/search/movie?query=${encodeURIComponent(term)}`,
      transformResponse: (res: any) => res.results,
    }),

    // --- Auth ---
    // Step 1: get request token
    getRequestToken: builder.query<{ request_token: string }, void>({
      query: () => ({
        url: `/authentication/token/new`,
        params: { api_key: import.meta.env.VITE_TMDB_API_KEY_V3 }, // v3 key
      }),
    }),

    // Step 3: create session
    createSession: builder.mutation<
      { session_id: string },
      { request_token: string }
    >({
      query: ({ request_token }) => ({
        url: `/authentication/session/new`,
        method: "POST",
        params: { api_key: import.meta.env.VITE_TMDB_API_KEY_V3 }, // v3 key
        body: { request_token },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Step 4: get account id
    getAccount: builder.query<
      { id: number; username: string },
      { session_id: string }
    >({
      query: ({ session_id }) => ({
        url: `/account`,
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY_V3, // v3 key
          session_id,
        },
      }),
      providesTags: ["Auth"],
    }),

    // --- Watchlist ---
    addToWatchlist: builder.mutation<
      any,
      { movieId: number; session_id: string; account_id: number }
    >({
      query: ({ movieId, session_id, account_id }) => ({
        url: `/account/${account_id}/watchlist`,
        method: "POST",
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY_V3, // v3 key
          session_id,
        },
        body: {
          media_type: "movie",
          media_id: movieId,
          watchlist: true,
        },
      }),
      invalidatesTags: (res, err, { movieId }) => [
        { type: "Watchlist", id: movieId },
      ],
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
          api_key: import.meta.env.VITE_TMDB_API_KEY_V3,
          session_id,
        },
        body: {
          media_type: "movie",
          media_id: movieId,
          watchlist: false, // set to false to remove
        },
      }),
      invalidatesTags: (res, err, { movieId }) => [
        { type: "Watchlist", id: movieId },
      ],
    }),

    // --- Watchlist ---
    // Get the user's movie watchlist
    getWatchlist: builder.query<
      any[],
      { account_id: number; session_id: string }
    >({
      query: ({ account_id, session_id }) => ({
        url: `/account/${account_id}/watchlist/movies`,
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY_V3, // must use v3 key
          session_id,
        },
      }),
      transformResponse: (res: any) => res.results,
      providesTags: (res) =>
        res
          ? [
              ...res.map((m: any) => ({
                type: "Watchlist" as const,
                id: m.id,
              })),
              { type: "Watchlist", id: "LIST" },
            ]
          : [{ type: "Watchlist", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useSearchMoviesQuery,
  useGetRequestTokenQuery,
  useCreateSessionMutation,
  useGetAccountQuery,
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
  useGetWatchlistQuery,
} = moviesApi;
