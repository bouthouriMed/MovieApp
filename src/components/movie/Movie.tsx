import { memo } from "react";
import { Link } from "react-router-dom";
import "./Movie.scss";

interface MovieProps {
  movie: any;
  onAdd?: (movie: any) => void;
  category?: string;
}

function Movie({ movie, category }: MovieProps) {
  return (
    <div className="movie-card">
      <Link
        to={`/movie/${movie.id}`}
        key={movie.id}
        state={{ category }}
        className="movie-link"
      >
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
      </Link>

      {/* {onAdd && (
        <button
          className="add-btn"
          onClick={() => onAdd(movie)}
          title="Add to Watchlist"
        >
          ➕
        </button>
      )} */}
    </div>
  );
}

export default memo(Movie);
