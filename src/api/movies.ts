// src/api/movies.ts
import { tmdb } from "./tmdb";

export const fetchMovies = async (category: string) => {
  const { data } = await tmdb.get(`/movie/${category}`);
  return data.results;
};

export const fetchMovieById = async (id: string | number) => {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
};

export const searchMovies = async (query: string) => {
  if (!query) return [];
  const { data } = await tmdb.get(`/search/movie`, {
    params: { query },
  });
  return data.results;
};
