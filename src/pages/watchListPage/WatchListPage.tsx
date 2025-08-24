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
import LoginPrompt from "../../components/loginPrompt/LoginPrompt";
import Loading from "../../components/loadingIndicator/LoadingIndicator";

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

  useEffect(() => {
    if (apiWatchList && localwatchList.length === 0) {
      dispatch(setwatchList(apiWatchList));
    }
  }, [apiWatchList, localwatchList.length, dispatch]);

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

  if (!auth.sessionId) return <LoginPrompt />;
  if (isLoading) return <Loading />;

  if (!localwatchList.length)
    return <p className="empty">Your watchlist is empty.</p>;

  return (
    <div className="watchList-page">
      <h1>My Watchlist</h1>
      <div className="watchList-grid">
        {localwatchList.map((movie) => (
          <div key={movie.id} className="watchList-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="poster-img"
              />
            </Link>
            <div className="details">
              <h3 className="title">{movie.title}</h3>
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
    </div>
  );
};

export default WatchListPage;
