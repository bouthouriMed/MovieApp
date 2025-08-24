import React, { useState } from "react";
import Carousel from "../../components/carousel/Carousel";
import {
  useGetMoviesQuery,
  useSearchMoviesQuery,
  useAddToWatchlistMutation,
} from "../../store/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store/store";
import { addTowatchList } from "../../store/watchListSlice";
import { toast } from "react-toastify";
import "./HomePage.scss";
import Loading from "../../components/loadingIndicator/LoadingIndicator";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const { data: popular, isLoading: popularLoading } =
    useGetMoviesQuery("popular");
  const { data: topRated, isLoading: topLoading } =
    useGetMoviesQuery("top_rated");
  const { data: upcoming, isLoading: upcomingLoading } =
    useGetMoviesQuery("upcoming");
  const { data: searchResults, isLoading: searchLoading } =
    useSearchMoviesQuery(searchTerm, { skip: !searchTerm });

  const [addToWatchlist] = useAddToWatchlistMutation();

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

  return (
    <div className="homepage">
      <h1>Film Explorer</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm && (
        <section>
          <h2>Search Results</h2>
          {searchLoading ? (
            <div>Searching...</div>
          ) : (
            <Carousel
              movies={searchResults || []}
              onAdd={handleAddToWatchlist}
            />
          )}
        </section>
      )}

      {!searchTerm && (
        <>
          <section>
            <h2>Popular Movies</h2>
            {popularLoading ? (
              <Loading />
            ) : (
              <Carousel
                movies={popular || []}
                onAdd={handleAddToWatchlist}
                category="popular"
              />
            )}
          </section>

          <section>
            <h2>Top Rated</h2>
            {topLoading ? (
              <Loading />
            ) : (
              <Carousel
                movies={topRated || []}
                onAdd={handleAddToWatchlist}
                category="topRated"
              />
            )}
          </section>

          <section>
            <h2>Upcoming</h2>
            {upcomingLoading ? (
              <Loading />
            ) : (
              <Carousel
                movies={upcoming || []}
                onAdd={handleAddToWatchlist}
                category="upcoming"
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default HomePage;
