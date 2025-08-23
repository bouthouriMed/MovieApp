import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { removeFromwatchList, setwatchList } from "../../store/watchListSlice";
import {
  useGetWatchlistQuery,
  useDeleteFromWatchlistMutation,
} from "../../store/apiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./WatchListPage.scss";

const WatchListPage = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const { data: apiWatchList, isLoading } = useGetWatchlistQuery(
    { account_id: auth.accountId!, session_id: auth.sessionId! },
    { skip: !auth.sessionId }
  );

  const [deleteFromWatchlist] = useDeleteFromWatchlistMutation();

  const localwatchList = useSelector(
    (state: RootState) => state.watchList.items
  );

  const handleRemove = async (movieId: number) => {
    if (!auth.sessionId || !auth.accountId) return;

    try {
      const response = await deleteFromWatchlist({
        movieId,
        session_id: auth.sessionId,
        account_id: auth.accountId,
      });

      if ("data" in response && response.data.success) {
        dispatch(removeFromwatchList(movieId));
      } else {
        toast.error("Failed to remove movie from watchlist.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while removing the movie.");
    }
  };

  useEffect(() => {
    if (apiWatchList && localwatchList.length === 0) {
      dispatch(setwatchList(apiWatchList));
    }
  }, [apiWatchList, localwatchList.length, dispatch]);

  if (!auth.sessionId) return <p>Login first!</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="watchList-page">
      <h1>My watchList</h1>

      {localwatchList.length === 0 ? (
        <p className="empty">Your watchList is empty.</p>
      ) : (
        <div className="watchList-grid">
          {localwatchList.map((movie) => (
            <div key={movie.id} className="watchList-card">
              <Link to={`/movie/${movie.id}`}>
                <div className="poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
              </Link>
              <div className="details">
                <h2>{movie.title}</h2>
                <p className="meta">
                  {movie.release_date?.slice(0, 4)} • ⭐{" "}
                  {movie.vote_average.toFixed(1)}
                </p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(movie.id)}
                >
                  ✖ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchListPage;
