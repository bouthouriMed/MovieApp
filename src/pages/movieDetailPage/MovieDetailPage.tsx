import { useParams } from "react-router-dom";
import {
  useGetMovieByIdQuery,
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
} from "../../store/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addTowatchList,
  removeFromwatchList,
} from "../../store/watchListSlice";
import { useEffect, useState } from "react";
import { useTMDBAuth } from "../../hooks/useTMDBAuth";
import "./MovieDetailPage.scss";

const MovieDetailPage = () => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const { auth } = useTMDBAuth();

  const dispatch = useDispatch();
  const watchList = useSelector((state: any) => state.watchList.items);

  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading } = useGetMovieByIdQuery(id ? Number(id) : 0);

  const [addToWatchlist] = useAddToWatchlistMutation();
  const [deleteFromWatchlist] = useDeleteFromWatchlistMutation();

  const { sessionId, accountId } = auth;

  // Sync local state with Redux watchlist
  useEffect(() => {
    if (movie) {
      setIsInWatchlist(watchList.some((m: any) => m.id === movie.id));
    }
  }, [watchList, movie]);

  const toggleWatchlist = async () => {
    if (!sessionId || !accountId) {
      toast.error("You must be logged in to manage your watchlist.");
      return;
    }

    try {
      if (isInWatchlist) {
        const response = await deleteFromWatchlist({
          movieId: movie.id,
          session_id: sessionId,
          account_id: accountId,
        });

        if ("data" in response && response.data.success) {
          dispatch(removeFromwatchList(movie.id));
          setIsInWatchlist(false);
        }
      } else {
        const response = await addToWatchlist({
          movieId: movie.id,
          session_id: sessionId,
          account_id: accountId,
        });

        if ("data" in response && response.data.success) {
          dispatch(addTowatchList(movie));
          setIsInWatchlist(true);
        }
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  if (isLoading || !movie)
    return <div className="movie-detail-page">Loading...</div>;

  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="overlay" />
      <div className="content">
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
        <div className="info">
          <h1>{movie.title}</h1>
          {movie.tagline && <h3 className="tagline">“{movie.tagline}”</h3>}
          <div className="meta">
            <span>{movie.release_date.slice(0, 4)}</span> •{" "}
            <span>{movie.runtime} min</span> •{" "}
            <span>{movie.genres.map((g: any) => g.name).join(", ")}</span>
          </div>
          <div className="rating">
            ⭐ {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="buttons">
            <button className="favorite-btn" onClick={toggleWatchlist}>
              {isInWatchlist
                ? "❌ Remove from Watchlist"
                : "🎟️ Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>
      {/* Additional Info */}
      <div className="additional-info">
        <h2>Additional Information</h2>
        <div className="grid">
          <div>
            <strong>Spoken Languages:</strong>{" "}
            {movie.spoken_languages.map((l: any) => l.english_name).join(", ")}
          </div>
          <div>
            <strong>Budget:</strong> ${movie.budget.toLocaleString()}
          </div>
          <div>
            <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
          </div>
          <div>
            <strong>Popularity:</strong> {movie.popularity.toFixed(0)}
          </div>
        </div>
        {movie.production_companies.length > 0 && (
          <div className="companies">
            <h3>Production Companies</h3>
            <div className="logos">
              {movie.production_companies.map((c: any) => (
                <div key={c.id} className="company">
                  {c.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${c.logo_path}`}
                      alt={c.name}
                    />
                  ) : (
                    <span>{c.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
