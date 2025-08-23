import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log({ API_KEY });

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    accept: "application/json",
  },
});
