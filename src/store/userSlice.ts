import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY_V3 = import.meta.env.VITE_TMDB_API_KEY_V3;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3/" }),
  endpoints: (builder) => ({
    createRequestToken: builder.query<{ request_token: string }, void>({
      query: () => ({
        url: `/authentication/token/new`,
        params: { api_key: API_KEY_V3 }, // v3 key
      }),
    }),
    createSession: builder.mutation<any, { request_token: string }>({
      query: ({ request_token }) => ({
        url: `authentication/session/new?api_key=${API_KEY_V3}`,
        method: "POST",
        body: { request_token },
      }),
    }),
    getAccount: builder.query<any, string>({
      query: (sessionId) =>
        `account?api_key=${API_KEY_V3}&session_id=${sessionId}`,
    }),
  }),
});

export const {
  useCreateRequestTokenQuery,
  useCreateSessionMutation,
  useGetAccountQuery,
} = userApi;
