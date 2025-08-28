import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useWatchlistToggle } from "@/hooks/useWatchlistToggle";
import { Movie } from "@/pages/movieDetailPage/types";
import "./WatchListItem.scss";
import { memo } from "react";

type Props = {
  movie: Movie;
};

const WatchListItem = ({ movie }: Props) => {
  const { toggle } = useWatchlistToggle(movie);

  return (
    <div className="watchList-card" key={movie.id}>
      <Link to={`/movie/${movie.id}`} className="poster-link">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="poster-img"
        />
      </Link>
      <div className="details">
        <h3 className="title">{movie.title}</h3>
        <p className="meta">
          {movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}
        </p>
        <button className="toggle-btn" onClick={toggle}>
          ✖ Remove
        </button>
      </div>
    </div>
  );
};

export default memo(WatchListItem);
