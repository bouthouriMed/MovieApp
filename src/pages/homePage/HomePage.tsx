import React, { useState } from "react";
import {
  useSearchMoviesQuery,
  useAddToWatchlistMutation,
} from "@/store/movieSlice";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store/store";
import { addTowatchList } from "@/store/watchListSlice";
import { toast } from "react-toastify";
import "./HomePage.scss";
import SearchBar from "@/components/home/searchBar/SearchBar";
import MovieSection from "@/components/home/movieSection/MovieSection";
import SearchResults from "@/components/home/searchResults/SearchResults";
import { useNavigate } from "react-router-dom";
import { ROUTES_URLS } from "@/routes";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [addToWatchlist] = useAddToWatchlistMutation();

  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: isSearchError,
  } = useSearchMoviesQuery(searchTerm, { skip: !searchTerm });

  const handleAddToWatchlist = async (movie: any) => {
    if (!auth.sessionId || !auth.accountId) {
      toast.error("You must be logged in to add movies to your watchlist.");
      return;
    }

    try {
      const response: any = await addToWatchlist({
        movieId: movie.id,
        session_id: auth.sessionId,
        account_id: auth.accountId,
      });

      if (response?.data?.success) {
        dispatch(addTowatchList(movie));
      } else {
        toast.error("Failed to add movie to watchlist.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const movieCategories = [
    { title: "Popular Movies", category: "popular" },
    { title: "Top Rated", category: "top_rated" },
    { title: "Upcoming", category: "upcoming" },
  ];

  if (isSearchError) navigate(ROUTES_URLS.Oops);

  return (
    <div className="homepage">
      <h1>Film Explorer</h1>

      {/* 🔹 SearchBar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* 🔹 SearchResults */}
      <SearchResults
        searchTerm={searchTerm}
        results={searchResults || []}
        isLoading={searchLoading}
        onAdd={handleAddToWatchlist}
      />

      {/* 🔹 Movie Sections */}
      {!searchTerm &&
        movieCategories.map(({ title, category }) => (
          <MovieSection
            key={category}
            title={title}
            category={category}
            onAdd={handleAddToWatchlist}
          />
        ))}
    </div>
  );
}

export default HomePage;
